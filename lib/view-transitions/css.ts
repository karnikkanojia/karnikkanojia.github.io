import {
  assertTransitionRegistry,
  getViewTransitionName,
  type CrossDocumentTransitionDefinition,
} from "./registry"

function generateDefinitionCss(definition: CrossDocumentTransitionDefinition) {
  const names = definition.keys.map((key) =>
    getViewTransitionName(definition, key)
  )
  const targetRules = definition.keys
    .map(
      (key) => `html[${definition.activationAttribute}~="${key}"]
  [${definition.targetAttribute}="${key}"] {
  view-transition-name: ${getViewTransitionName(definition, key)};
}`
    )
    .join("\n\n")

  const groupSelectors = names
    .map((name) => `::view-transition-group(${name})`)
    .join(",\n")
  const snapshotSelectors = [
    ...names.map((name) => `::view-transition-old(${name})`),
    ...names.map((name) => `::view-transition-new(${name})`),
  ].join(",\n")
  const { group, snapshots } = definition.motion

  return `${targetRules}

${groupSelectors} {
  z-index: ${group.zIndex};
  ${group.overflow ? `overflow: ${group.overflow};\n  ` : ""}animation-duration: ${group.durationMs}ms;
  animation-timing-function: ${group.easing};
}

${snapshotSelectors} {
  width: ${snapshots.width};
  height: ${snapshots.height};
  object-fit: ${snapshots.objectFit};
  overflow: ${snapshots.overflow};
  mix-blend-mode: ${snapshots.mixBlendMode};
}`
}

export function generateCrossDocumentTransitionCss(
  definitions: readonly CrossDocumentTransitionDefinition[]
) {
  assertTransitionRegistry(definitions)
  return definitions.map(generateDefinitionCss).join("\n\n")
}
