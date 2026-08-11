import {
  assertTransitionRegistry,
  type CrossDocumentTransitionDefinition,
} from "./registry"

type RuntimeTransitionDefinition = Pick<
  CrossDocumentTransitionDefinition,
  "id" | "targetAttribute" | "activationAttribute" | "keys" | "navigation"
>

function serializeForInlineScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

export function generateViewTransitionRuntime(
  definitions: readonly CrossDocumentTransitionDefinition[]
) {
  assertTransitionRegistry(definitions)

  const runtimeDefinitions: RuntimeTransitionDefinition[] = definitions.map(
    ({ id, targetAttribute, activationAttribute, keys, navigation }) => ({
      id,
      targetAttribute,
      activationAttribute,
      keys,
      navigation,
    })
  )

  return String.raw`
(() => {
  "use strict"

  const definitions = ${serializeForInlineScript(runtimeDefinitions)}
  const navigationContextKey = "portfolio:view-transition-navigation"

  const getPathname = (url) => {
    if (typeof url !== "string" || url.length === 0) return ""

    try {
      return new URL(url, window.location.href).pathname
    } catch {
      return ""
    }
  }

  const matchRoute = (matcher, pathname) => {
    if (matcher.kind === "exact") {
      return { matches: matcher.paths.includes(pathname), key: null }
    }

    const match = pathname.match(new RegExp(matcher.pattern))
    return {
      matches: match !== null,
      key: match?.[matcher.keyGroup] ?? null,
    }
  }

  const resolveKeys = (definition, sourcePath, destinationPath) => {
    for (const rule of definition.navigation) {
      const source = matchRoute(rule.from, sourcePath)
      const destination = matchRoute(rule.to, destinationPath)
      if (!source.matches || !destination.matches) continue

      if (rule.select === "all") return definition.keys

      const key =
        rule.select === "source-key" ? source.key : destination.key
      return key && definition.keys.includes(key) ? [key] : []
    }

    return []
  }

  const writeNavigationContext = (sourceUrl, destinationUrl) => {
    if (!sourceUrl || !destinationUrl) return

    try {
      window.sessionStorage.setItem(
        navigationContextKey,
        JSON.stringify({ sourceUrl, destinationUrl })
      )
    } catch {
      // Navigation activation remains the primary source of truth when
      // storage is unavailable.
    }
  }

  const consumeNavigationContext = () => {
    try {
      const value = window.sessionStorage.getItem(navigationContextKey)
      window.sessionStorage.removeItem(navigationContextKey)
      if (!value) return null

      const context = JSON.parse(value)
      const isValid =
        typeof context?.sourceUrl === "string" &&
        typeof context?.destinationUrl === "string" &&
        getPathname(context.destinationUrl) === window.location.pathname

      return isValid ? context : null
    } catch {
      return null
    }
  }

  const reportUnexpectedError = (error) => {
    if (
      error instanceof DOMException &&
      (error.name === "AbortError" || error.name === "TimeoutError")
    ) {
      return
    }

    console.error("Unexpected view-transition failure", error)
  }

  const watchTransition = (transition) => {
    transition?.ready.catch(reportUnexpectedError)
  }

  const activateTargets = (transition, definition, requestedKeys) => {
    if (!transition || requestedKeys.length === 0) return

    const requested = new Set(requestedKeys)
    const targets = Array.from(
      document.querySelectorAll("[" + definition.targetAttribute + "]")
    )
    const activeKeys = [
      ...new Set(
        targets
          .map((target) => target.getAttribute(definition.targetAttribute))
          .filter((key) => key && requested.has(key))
      ),
    ]
    if (activeKeys.length === 0) return

    const value = activeKeys.join(" ")
    document.documentElement.setAttribute(definition.activationAttribute, value)

    const cleanup = () => {
      if (
        document.documentElement.getAttribute(definition.activationAttribute) ===
        value
      ) {
        document.documentElement.removeAttribute(definition.activationAttribute)
      }
    }

    transition.finished.then(cleanup, (error) => {
      cleanup()
      reportUnexpectedError(error)
    })
  }

  const activateDefinitions = (transition, sourceUrl, destinationUrl) => {
    const sourcePath = getPathname(sourceUrl)
    const destinationPath = getPathname(destinationUrl)

    for (const definition of definitions) {
      const keys = resolveKeys(definition, sourcePath, destinationPath)
      activateTargets(transition, definition, keys)
    }
  }

  window.addEventListener("pageswap", (event) => {
    const transition = event.viewTransition
    const activation = event.activation
    if (!transition || !activation) return

    watchTransition(transition)

    const sourceUrl = activation.from?.url ?? window.location.href
    const destinationUrl = activation.entry?.url
    if (!destinationUrl) return

    writeNavigationContext(sourceUrl, destinationUrl)
    activateDefinitions(transition, sourceUrl, destinationUrl)
  })

  window.addEventListener("pagereveal", (event) => {
    const transition = event.viewTransition
    if (!transition) return

    watchTransition(transition)

    const context = consumeNavigationContext()
    const sourceUrl =
      window.navigation?.activation?.from?.url ?? context?.sourceUrl

    activateDefinitions(transition, sourceUrl, window.location.href)
  })
})()
`
}
