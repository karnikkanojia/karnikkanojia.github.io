import assert from "node:assert/strict"
import { describe, test } from "node:test"

import { generateCrossDocumentTransitionCss } from "./css"
import { projectImageTransition, sharedImageMorphMotion } from "./project-image"
import {
  assertTransitionRegistry,
  defineCrossDocumentTransition,
  getViewTransitionTargetProps,
  resolveTransitionKeys,
} from "./registry"

const projectKeys = projectImageTransition.keys

describe("project image view transitions", () => {
  test("generates an explicit transition name for every project", () => {
    const css = generateCrossDocumentTransitionCss([projectImageTransition])

    for (const key of projectKeys) {
      assert.ok(css.includes(`html[data-project-transition-images~="${key}"]`))
      assert.ok(css.includes(`[data-project-transition-image="${key}"]`))
      assert.ok(css.includes(`view-transition-name: project-image-${key};`))
      assert.ok(css.includes(`::view-transition-group(project-image-${key})`))
      assert.ok(css.includes(`::view-transition-old(project-image-${key})`))
      assert.ok(css.includes(`::view-transition-new(project-image-${key})`))
    }

    assert.ok(css.includes("animation-duration: 520ms;"))
    assert.ok(css.includes("z-index: 1;"))
    assert.ok(
      css.includes("animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);")
    )
    assert.ok(!css.includes("view-transition-class"))
    assert.ok(!css.includes("opacity"))
    assert.ok(css.includes("width: 100%;"))
    assert.ok(css.includes("height: 100%;"))
    assert.ok(css.includes("object-fit: cover;"))
    assert.ok(css.includes("overflow: hidden;"))
    assert.ok(css.includes("mix-blend-mode: normal;"))
  })

  test("returns hydration-safe target attributes", () => {
    assert.deepEqual(
      getViewTransitionTargetProps(
        projectImageTransition,
        "ops-command-center"
      ),
      { "data-project-transition-image": "ops-command-center" }
    )
  })

  const routeCases: ReadonlyArray<
    readonly [string, string, string, readonly string[]]
  > = [
    ["home to projects", "/", "/projects", projectKeys],
    [
      "home to detail",
      "/",
      "/projects/ops-command-center",
      ["ops-command-center"],
    ],
    ["projects to detail", "/projects", "/projects/vision-lab", ["vision-lab"]],
    ["detail to projects", "/projects/changeflow", "/projects", ["changeflow"]],
    [
      "detail to home",
      "/projects/infrastructure-atlas",
      "/",
      ["infrastructure-atlas"],
    ],
    [
      "detail to detail",
      "/projects/changeflow",
      "/projects/vision-lab",
      ["vision-lab"],
    ],
    ["unrelated routes", "/about", "/projects", []],
    ["malformed detail route", "/projects", "/projects/changeflow/more", []],
    ["unknown project", "/projects", "/projects/not-registered", []],
  ]

  for (const [label, source, destination, expected] of routeCases) {
    test(`resolves ${label}`, () => {
      assert.deepEqual(
        resolveTransitionKeys(projectImageTransition, source, destination),
        expected
      )
    })
  }
})

describe("transition registry validation", () => {
  const createDefinition = (
    overrides: Partial<Parameters<typeof defineCrossDocumentTransition>[0]> = {}
  ) =>
    defineCrossDocumentTransition({
      id: "example",
      targetAttribute: "data-example-target",
      activationAttribute: "data-example-active",
      keys: ["alpha"],
      navigation: [
        {
          from: { kind: "exact", paths: ["/"] },
          to: { kind: "exact", paths: ["/example"] },
          select: "all",
        },
      ],
      motion: sharedImageMorphMotion,
      ...overrides,
    })

  test("rejects duplicate keys", () => {
    assert.throws(
      () => createDefinition({ keys: ["alpha", "alpha"] }),
      /Duplicate transition key/
    )
  })

  test("rejects invalid CSS identifiers", () => {
    assert.throws(
      () => createDefinition({ id: "Invalid ID" }),
      /Transition id must start/
    )
    assert.throws(
      () => createDefinition({ keys: ["invalid key"] }),
      /Transition key/
    )
  })

  test("rejects duplicate family registry entries", () => {
    const definition = createDefinition()
    assert.throws(
      () => assertTransitionRegistry([definition, definition]),
      /Duplicate transition family id/
    )
  })

  test("rejects invalid keyed route capture groups", () => {
    assert.throws(
      () =>
        createDefinition({
          navigation: [
            {
              from: {
                kind: "keyed",
                pattern: "^/example/([^/]+)$",
                keyGroup: 0,
              },
              to: { kind: "exact", paths: ["/example"] },
              select: "source-key",
            },
          ],
        }),
      /positive key capture group/
    )
  })
})
