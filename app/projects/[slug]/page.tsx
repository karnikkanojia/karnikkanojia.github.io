import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { CrossDocumentLink } from "@/components/cross-document-link"
import { getNextProject, getProject, projects } from "@/lib/projects"
import { SITE_NAME, SITE_URL } from "@/lib/site"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) return {}

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "website",
      url: `/projects/${project.slug}`,
      siteName: SITE_NAME,
      title: project.title,
      description: project.summary,
      images: [
        {
          url: "/videos/intro-poster.webp",
          width: 1440,
          height: 810,
          alt: `${project.title} by ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: ["/videos/intro-poster.webp"],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) notFound()

  const nextProject = getNextProject(project.slug)
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: `${SITE_URL}${project.image}`,
    creator: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  return (
    <main className="relative z-10 min-h-screen bg-white text-black">
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <header className="px-5 pt-24 pb-10 md:px-8 md:pt-32 md:pb-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <p className="font-navbar text-xs tracking-[0.09em] text-black/60 uppercase">
                  {project.label}
                </p>
                <h1 className="mt-5 max-w-[26ch] text-2xl leading-[1.08] font-medium tracking-[-0.02em] text-balance md:text-4xl">
                  {project.title}
                </h1>
              </div>
              <p className="max-w-[42ch] text-base leading-normal text-black/62 md:col-span-4 md:justify-self-end md:pb-1">
                {project.summary}
              </p>
            </div>
          </div>
        </header>

        <div className="px-2 md:px-3">
          <div
            className="relative mx-auto h-[55svh] max-h-128 min-h-80 max-w-376 overflow-hidden rounded-[1rem] bg-[#e8e8e4] md:aspect-16/8.5 md:h-auto md:max-h-[82svh] md:min-h-0"
            style={{ viewTransitionName: `project-image-${project.slug}` }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 1536px) 1504px, calc(100vw - 24px)"
              className="object-cover"
              preload
            />
          </div>
        </div>

        <div className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-12 md:gap-8">
            <aside className="md:col-span-4">
              <div className="md:sticky md:top-24">
                <p className="font-navbar text-xs tracking-[0.09em] text-black/60 uppercase">
                  Project details
                </p>
                <dl className="mt-6 divide-y divide-black/10 border-y border-black/10">
                  <div className="grid grid-cols-[5rem_1fr] gap-4 py-4">
                    <dt className="font-navbar text-xs tracking-[0.08em] text-black/58 uppercase">
                      Focus
                    </dt>
                    <dd className="text-xs leading-[1.4] text-black/70">
                      {project.tags.join(", ")}
                    </dd>
                  </div>
                  <div className="grid grid-cols-[5rem_1fr] gap-4 py-4">
                    <dt className="font-navbar text-xs tracking-[0.08em] text-black/58 uppercase">
                      Stack
                    </dt>
                    <dd className="text-xs leading-[1.4] text-black/70">
                      {project.stack.join(", ")}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>

            <div className="md:col-span-7 md:col-start-6">
              <section aria-labelledby="challenge-title">
                <p className="font-navbar text-xs tracking-[0.09em] text-black/60 uppercase">
                  01 . Context
                </p>
                <h2
                  id="challenge-title"
                  className="mt-4 text-xl leading-[1.02] font-medium tracking-tight md:text-2xl"
                >
                  The challenge
                </h2>
                <p className="mt-5 max-w-[58ch] text-base leading-[1.55] text-black/65">
                  {project.challenge}
                </p>
              </section>

              <section
                aria-labelledby="contribution-title"
                className="mt-20 border-t border-black/12 pt-16 md:mt-28 md:pt-20"
              >
                <p className="font-navbar text-xs tracking-[0.09em] text-black/60 uppercase">
                  02 . Contribution
                </p>
                <h2
                  id="contribution-title"
                  className="mt-4 text-xl leading-[1.02] font-medium tracking-tight md:text-2xl"
                >
                  What I built
                </h2>
                <ol className="mt-8 divide-y divide-black/10 border-y border-black/10">
                  {project.contribution.map((item, index) => (
                    <li
                      key={item}
                      className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 text-base leading-normal text-black/68 md:grid-cols-[3.5rem_1fr] md:py-6"
                    >
                      <span
                        aria-hidden="true"
                        className="font-navbar text-xs tracking-wider text-black/58"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </section>

              <section
                aria-labelledby="impact-title"
                className="mt-20 border-t border-black/12 pt-16 md:mt-28 md:pt-20"
              >
                <p className="font-navbar text-xs tracking-[0.09em] text-black/60 uppercase">
                  03 . Outcome
                </p>
                <h2
                  id="impact-title"
                  className="mt-4 text-xl leading-[1.02] font-medium tracking-tight md:text-2xl"
                >
                  Measurable impact
                </h2>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {project.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="flex min-h-36 items-end rounded-xl bg-[#f4f4f1] p-5 md:min-h-44 md:p-6"
                    >
                      <p className="max-w-[15ch] text-2xl leading-none font-medium tracking-tight">
                        {outcome}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        <nav
          aria-label="Project navigation"
          className="border-t border-black/10 px-5 py-16 md:px-8 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="font-navbar text-xs tracking-[0.09em] text-black/60 uppercase">
              Next project
            </p>
            <CrossDocumentLink
              href={`/projects/${nextProject.slug}`}
              className="project-next-link group mt-6 flex items-end justify-between gap-5 border-b border-black/20 pb-5 outline-2 outline-offset-4 outline-transparent transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:border-black focus-visible:outline-black active:scale-[0.99]"
            >
              <span className="text-2xl font-medium tracking-[-0.03em] text-balance md:text-4xl">
                {nextProject.title}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="project-next-arrow mb-1 size-7 shrink-0 stroke-[1.3] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] md:size-10"
              />
            </CrossDocumentLink>
          </div>
        </nav>
      </article>
    </main>
  )
}
