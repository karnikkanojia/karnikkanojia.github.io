export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  image: string
  imageAlt: string
  homeClassName: string
  homeImageSizes: string
  label: string
  summary: string
  challenge: string
  contribution: string[]
  outcomes: string[]
  stack: string[]
}

export const projects: Project[] = [
  {
    slug: "ops-command-center",
    title: "Ops Command Center",
    description:
      "A unified observability workspace for finding signal across incidents, services, and customer impact.",
    tags: ["Observability", "Platform"],
    image: "/images/bento/ops-command-center.svg",
    imageAlt: "Abstract command center dashboard with service health charts",
    homeClassName: "md:col-span-7",
    homeImageSizes:
      "(min-width: 1200px) 650px, (min-width: 768px) 58vw, calc(100vw - 40px)",
    label: "Reliability engineering . Oracle Financial Services",
    summary:
      "A central operating view for multi-tenant banking platforms, designed to connect incident signals with the services and customers they affect.",
    challenge:
      "Operational context was spread across monitoring, logs, and incident workflows, making it slow to establish impact and decide where to act first.",
    contribution: [
      "Designed a centralized monitoring and logging workflow across tenant environments.",
      "Connected customer incidents to the metrics and service health indicators needed for triage.",
      "Added proactive alerting patterns to surface emerging SaaSOps issues earlier.",
    ],
    outcomes: ["~25% faster incident resolution", "99.9% uptime reliability"],
    stack: ["Python", "SQL", "Observability", "SaaSOps"],
  },
  {
    slug: "vision-lab",
    title: "Vision Lab",
    description:
      "An open-source imaging pipeline built to make model evaluation clear and repeatable.",
    tags: ["Computer Vision", "Research"],
    image: "/images/bento/vision-lab.svg",
    imageAlt: "Abstract medical imaging model interface",
    homeClassName: "md:col-span-5",
    homeImageSizes:
      "(min-width: 1200px) 460px, (min-width: 768px) 42vw, calc(100vw - 40px)",
    label: "Open-source research . Mi4People",
    summary:
      "A repeatable computer-vision workflow for training, evaluating, and sharing diagnostic imaging models with healthcare research teams.",
    challenge:
      "Research needed a practical path from varied medical imagery to reliable experiments, without losing traceability across datasets, model versions, and error analysis.",
    contribution: [
      "Built DenseNet121-based CNN pipelines with transfer learning and targeted augmentation.",
      "Created systematic evaluation and error-analysis workflows to make results easier to compare.",
      "Containerized training and deployed scalable inference services through Azure ML.",
    ],
    outcomes: ["0.88 AUC", "Fewer false positives"],
    stack: ["Python", "DenseNet121", "Azure ML", "Docker"],
  },
  {
    slug: "changeflow",
    title: "Changeflow",
    description:
      "Reliable data synchronization with visible checkpoints and recovery paths.",
    tags: ["CDC", "Automation"],
    image: "/images/bento/changeflow.svg",
    imageAlt: "Abstract data synchronization flow",
    homeClassName: "md:col-span-5",
    homeImageSizes:
      "(min-width: 1200px) 460px, (min-width: 768px) 42vw, calc(100vw - 40px)",
    label: "Data reliability . Oracle Financial Services",
    summary:
      "A visible change-data-capture system that makes environment synchronization safer, easier to audit, and simpler to recover when something goes wrong.",
    challenge:
      "Keeping multiple environments aligned relied on error-prone manual intervention, with limited visibility into what had synced and where recovery was needed.",
    contribution: [
      "Implemented custom CDC flows to synchronize every environment automatically.",
      "Made checkpoints and recovery paths explicit so teams could investigate failures with confidence.",
      "Reduced the operational burden around recurring data synchronization work.",
    ],
    outcomes: ["~40% fewer data-sync errors", "~10 hours saved weekly"],
    stack: ["Python", "SQL", "CDC", "Automation"],
  },
  {
    slug: "infrastructure-atlas",
    title: "Infrastructure Atlas",
    description:
      "A living map of services, dependencies, ownership, and the paths incidents travel.",
    tags: ["SRE", "Systems Design"],
    image: "/images/bento/infrastructure-atlas.svg",
    imageAlt: "Abstract infrastructure dependency map",
    homeClassName: "md:col-span-7",
    homeImageSizes:
      "(min-width: 1200px) 650px, (min-width: 768px) 58vw, calc(100vw - 40px)",
    label: "Systems design . Reliability practice",
    summary:
      "A service map that turns a complex platform into an understandable operating model—showing dependencies, ownership, and how incidents can propagate.",
    challenge:
      "During an incident, knowing the affected service is only the start. Teams need to quickly understand upstream dependencies, downstream risk, and who can help.",
    contribution: [
      "Mapped service relationships and ownership alongside operational health signals.",
      "Framed incident paths as navigable dependency chains rather than isolated alerts.",
      "Created a shared systems view that supports faster, more deliberate triage.",
    ],
    outcomes: ["Clearer incident context", "Shared service ownership"],
    stack: ["SRE", "Systems Design", "Observability", "Service Mapping"],
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getNextProject(slug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === slug)
  return projects[(currentIndex + 1) % projects.length]
}
