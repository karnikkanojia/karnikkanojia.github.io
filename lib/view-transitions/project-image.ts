import { projects } from "@/lib/projects"

import {
  defineCrossDocumentTransition,
  type ViewTransitionMotion,
} from "./registry"

export const sharedImageMorphMotion: ViewTransitionMotion = {
  group: {
    zIndex: 1,
    durationMs: 520,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  snapshots: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    overflow: "hidden",
    mixBlendMode: "normal",
  },
}

const collectionRoutes = {
  kind: "exact",
  paths: ["/", "/projects"],
} as const

const projectDetailRoute = {
  kind: "keyed",
  pattern: "^/projects/([^/]+)/?$",
  keyGroup: 1,
} as const

export const projectImageTransition = defineCrossDocumentTransition({
  id: "project-image",
  targetAttribute: "data-project-transition-image",
  activationAttribute: "data-project-transition-images",
  keys: projects.map(({ slug }) => slug),
  navigation: [
    {
      from: { kind: "exact", paths: ["/"] },
      to: { kind: "exact", paths: ["/projects"] },
      select: "all",
    },
    {
      from: collectionRoutes,
      to: projectDetailRoute,
      select: "destination-key",
    },
    {
      from: projectDetailRoute,
      to: collectionRoutes,
      select: "source-key",
    },
    {
      from: projectDetailRoute,
      to: projectDetailRoute,
      select: "destination-key",
    },
  ],
  motion: sharedImageMorphMotion,
})

export const viewTransitionRegistry = [projectImageTransition] as const
