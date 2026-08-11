export type ViewTransitionSelection = "all" | "source-key" | "destination-key"

export type ViewTransitionRouteMatcher =
  | {
      kind: "exact"
      paths: readonly string[]
    }
  | {
      kind: "keyed"
      pattern: string
      keyGroup: number
    }

export type ViewTransitionNavigationRule = {
  from: ViewTransitionRouteMatcher
  to: ViewTransitionRouteMatcher
  select: ViewTransitionSelection
}

export type ViewTransitionMotion = {
  group: {
    zIndex: number
    durationMs: number
    easing: string
    overflow?: string
  }
  snapshots: {
    width: string
    height: string
    objectFit: string
    overflow: string
    mixBlendMode: string
  }
}

export type CrossDocumentTransitionDefinition<TKey extends string = string> = {
  id: string
  targetAttribute: `data-${string}`
  activationAttribute: `data-${string}`
  keys: readonly TKey[]
  navigation: readonly ViewTransitionNavigationRule[]
  motion: ViewTransitionMotion
}

type CrossDocumentTransitionConfig<TKey extends string> = Omit<
  CrossDocumentTransitionDefinition<TKey>,
  "keys" | "navigation"
> & {
  keys: readonly TKey[]
  navigation: readonly ViewTransitionNavigationRule[]
}

const CSS_IDENTIFIER_PATTERN = /^[a-z][a-z0-9-]*$/
const DATA_ATTRIBUTE_PATTERN = /^data-[a-z][a-z0-9-]*$/

function assertCssIdentifier(value: string, label: string) {
  if (!CSS_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens: ${value}`
    )
  }
}

function assertDataAttribute(value: string, label: string) {
  if (!DATA_ATTRIBUTE_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a valid lowercase data attribute: ${value}`
    )
  }
}

function assertRouteMatcher(
  matcher: ViewTransitionRouteMatcher,
  label: string
) {
  if (matcher.kind === "exact") {
    if (matcher.paths.length === 0 || matcher.paths.some((path) => !path)) {
      throw new Error(`${label} must contain at least one pathname`)
    }
    return
  }

  if (!Number.isInteger(matcher.keyGroup) || matcher.keyGroup < 1) {
    throw new Error(`${label} must define a positive key capture group`)
  }

  try {
    new RegExp(matcher.pattern)
  } catch {
    throw new Error(`${label} contains an invalid regular expression`)
  }
}

export function defineCrossDocumentTransition<const TKey extends string>(
  config: CrossDocumentTransitionConfig<TKey>
): CrossDocumentTransitionDefinition<TKey> {
  assertCssIdentifier(config.id, "Transition id")
  assertDataAttribute(config.targetAttribute, "Target attribute")
  assertDataAttribute(config.activationAttribute, "Activation attribute")

  if (config.targetAttribute === config.activationAttribute) {
    throw new Error("Target and activation attributes must be different")
  }

  if (config.keys.length === 0) {
    throw new Error(`Transition ${config.id} must define at least one key`)
  }

  const uniqueKeys = new Set<string>()
  for (const key of config.keys) {
    assertCssIdentifier(key, `Transition key for ${config.id}`)
    if (uniqueKeys.has(key)) {
      throw new Error(`Duplicate transition key for ${config.id}: ${key}`)
    }
    uniqueKeys.add(key)
  }

  if (config.navigation.length === 0) {
    throw new Error(`Transition ${config.id} must define navigation rules`)
  }

  config.navigation.forEach((rule, index) => {
    assertRouteMatcher(rule.from, `Navigation rule ${index} source`)
    assertRouteMatcher(rule.to, `Navigation rule ${index} destination`)
  })

  return Object.freeze({
    ...config,
    keys: Object.freeze([...config.keys]),
    navigation: Object.freeze([...config.navigation]),
  })
}

export function assertTransitionRegistry(
  definitions: readonly CrossDocumentTransitionDefinition[]
) {
  const ids = new Set<string>()
  const transitionNames = new Set<string>()
  const attributes = new Set<string>()

  for (const definition of definitions) {
    if (ids.has(definition.id)) {
      throw new Error(`Duplicate transition family id: ${definition.id}`)
    }
    ids.add(definition.id)

    for (const attribute of [
      definition.targetAttribute,
      definition.activationAttribute,
    ]) {
      if (attributes.has(attribute)) {
        throw new Error(`Duplicate transition data attribute: ${attribute}`)
      }
      attributes.add(attribute)
    }

    for (const key of definition.keys) {
      const name = getViewTransitionName(definition, key)
      if (transitionNames.has(name)) {
        throw new Error(`Duplicate view transition name: ${name}`)
      }
      transitionNames.add(name)
    }
  }
}

export function getViewTransitionName(
  definition: CrossDocumentTransitionDefinition,
  key: string
) {
  return `${definition.id}-${key}`
}

export function getViewTransitionTargetProps<TKey extends string>(
  definition: CrossDocumentTransitionDefinition<TKey>,
  key: TKey
): Record<`data-${string}`, string> {
  if (!definition.keys.includes(key)) {
    throw new Error(`Unknown transition key for ${definition.id}: ${key}`)
  }

  return { [definition.targetAttribute]: key }
}

type RouteMatch = {
  matches: boolean
  key: string | null
}

function matchRoute(
  matcher: ViewTransitionRouteMatcher,
  pathname: string
): RouteMatch {
  if (matcher.kind === "exact") {
    return { matches: matcher.paths.includes(pathname), key: null }
  }

  const match = pathname.match(new RegExp(matcher.pattern))
  return {
    matches: match !== null,
    key: match?.[matcher.keyGroup] ?? null,
  }
}

export function resolveTransitionKeys(
  definition: CrossDocumentTransitionDefinition,
  sourcePath: string,
  destinationPath: string
): readonly string[] {
  for (const rule of definition.navigation) {
    const source = matchRoute(rule.from, sourcePath)
    const destination = matchRoute(rule.to, destinationPath)
    if (!source.matches || !destination.matches) continue

    if (rule.select === "all") return definition.keys

    const key = rule.select === "source-key" ? source.key : destination.key
    return key && definition.keys.includes(key) ? [key] : []
  }

  return []
}
