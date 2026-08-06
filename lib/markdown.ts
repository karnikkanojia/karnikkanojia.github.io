import { projects } from "@/lib/projects"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"

const markdownMediaType = "text/markdown"

export function acceptsMarkdown(accept: string | null) {
  if (!accept) return false

  return accept.split(",").some((value) => {
    const [mediaType, ...parameters] = value.trim().toLowerCase().split(";")
    const quality = parameters.find((parameter) =>
      parameter.trim().startsWith("q=")
    )
    const qualityValue = quality
      ? Number.parseFloat(quality.trim().slice(2))
      : 1

    return mediaType === markdownMediaType && qualityValue > 0
  })
}

export function markdownForPath(pathname: string) {
  if (pathname === "/") return homeMarkdown()
  if (pathname === "/projects") return projectsMarkdown()

  const slug = pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1]
  let decodedSlug: string | undefined
  try {
    decodedSlug = slug ? decodeURIComponent(slug) : undefined
  } catch {
    return null
  }

  const project = decodedSlug
    ? projects.find((candidate) => candidate.slug === decodedSlug)
    : undefined

  if (!project) return null

  return [
    frontmatter(project.title, project.summary),
    `# ${project.title}`,
    project.summary,
    "## Project details",
    `- Focus: ${project.tags.join(", ")}`,
    `- Stack: ${project.stack.join(", ")}`,
    "## The challenge",
    project.challenge,
    "## What I built",
    ...project.contribution.map((item) => `- ${item}`),
    "## Measurable impact",
    ...project.outcomes.map((outcome) => `- ${outcome}`),
    `## Next project\n[${nextProjectTitle(project.slug)}](${SITE_URL}/projects/${nextProjectSlug(project.slug)})`,
  ].join("\n\n")
}

function homeMarkdown() {
  return [
    frontmatter(SITE_NAME, SITE_DESCRIPTION),
    `# ${SITE_NAME}`,
    SITE_DESCRIPTION,
    "## Work",
    "Site Reliability Engineer at Oracle Financial Services Software. Karnik builds centralized monitoring and logging for multi-tenant banking platforms, automated change-data-capture systems, and proactive SaaSOps alerting.",
    "## Experience",
    "- Oracle Financial Services Software — Site Reliability Engineer (August 2024–present)",
    "- Mi4People — Data Scientist (December 2022–June 2024)",
    "- Samsung Research Institute of India — Research Intern (December 2022–August 2023)",
    "- National University of Singapore — Research Intern (December 2022–May 2023)",
    "## Projects",
    ...projects.map(
      (project) =>
        `- [${project.title}](${SITE_URL}/projects/${project.slug}) — ${project.description}`
    ),
    "## Links",
    "- [GitHub](https://github.com/karnikkanojia)",
    "- [LinkedIn](https://www.linkedin.com/in/karnikkanojia)",
    "- [Medium](https://medium.com/@karnikk1406120)",
  ].join("\n\n")
}

function projectsMarkdown() {
  return [
    frontmatter(
      "Projects",
      "Selected systems, research, and reliability projects by Karnik Kanojia."
    ),
    "# Projects",
    "Selected work across reliability engineering, automation, computer vision, and operational tooling.",
    ...projects.map((project) =>
      [
        `## [${project.title}](${SITE_URL}/projects/${project.slug})`,
        project.description,
        `- Focus: ${project.tags.join(", ")}`,
        `- Outcomes: ${project.outcomes.join("; ")}`,
      ].join("\n\n")
    ),
  ].join("\n\n")
}

function frontmatter(title: string, description: string) {
  return [
    "---",
    `title: ${title}`,
    `description: ${description}`,
    `url: ${SITE_URL}`,
    "---",
  ].join("\n")
}

function nextProjectSlug(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length].slug
}

function nextProjectTitle(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length].title
}
