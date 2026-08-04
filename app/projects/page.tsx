import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CursorFollowLabel } from "@/components/ui/cursor-follow-label"
import { projects } from "@/lib/projects"
import { SITE_NAME } from "@/lib/site"

const projectsDescription =
  "Selected systems, research, and reliability projects by Karnik Kanojia."

export const metadata: Metadata = {
  title: "Projects",
  description: projectsDescription,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: "/projects",
    siteName: SITE_NAME,
    title: "Projects",
    description: projectsDescription,
    images: [
      {
        url: "/videos/intro-poster.webp",
        width: 1440,
        height: 810,
        alt: `${SITE_NAME} project archive`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects",
    description: projectsDescription,
    images: ["/videos/intro-poster.webp"],
  },
}

export default function ProjectsPage() {
  return (
    <main className="relative z-10 min-h-screen bg-white px-5 pt-28 pb-20 text-black md:px-8 md:pt-36 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-8 border-b border-black/12 pb-12 md:grid-cols-12 md:items-end md:pb-16">
          <div className="md:col-span-8">
            <h1 className="max-w-[26ch] text-2xl leading-[1.08] font-medium tracking-[-0.02em] text-balance md:text-4xl">
              Systems built for the real world.
            </h1>
          </div>
          <p className="max-w-[38ch] text-base leading-[1.5] text-black/58 md:col-span-4 md:justify-self-end md:pb-1">
            Selected work across reliability engineering, automation, computer
            vision, and operational tooling.
          </p>
        </header>

        <ol className="border-b border-black/12">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <CursorFollowLabel className="h-full" label="Case study">
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`View ${project.title} case study`}
                  className="project-list-item group grid gap-x-6 gap-y-5 border-t border-black/12 py-6 outline-2 outline-offset-4 outline-transparent transition-[background-color,transform] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-black active:scale-[0.995] md:grid-cols-12 md:items-center md:py-8"
                >
                  <div className="md:col-span-1 md:self-start md:pt-1">
                    <p
                      aria-hidden="true"
                      className="font-navbar text-xs tracking-[0.08em] text-black/60 uppercase"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="relative order-2 aspect-[16/10] overflow-hidden rounded-[0.75rem] bg-[#e8e8e4] md:order-none md:col-span-3 md:aspect-[4/3]">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(min-width: 1200px) 280px, (min-width: 768px) 25vw, calc(100vw - 40px)"
                      className="project-list-image object-cover transition-transform duration-240 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      preload={index === 0}
                    />
                  </div>

                  <div className="order-1 md:order-none md:col-span-4 md:self-start">
                    <h2 className="project-list-title max-w-[15ch] text-2xl leading-[1] font-medium tracking-[-0.025em] text-balance transition-colors duration-180 md:text-4xl">
                      {project.title}
                    </h2>
                    <ul
                      aria-label={`${project.title} technologies`}
                      className="mt-4 flex flex-wrap gap-1.5 md:mt-5"
                    >
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="project-tag-pill rounded-md border border-black/15 px-1.5 py-0.5 font-navbar text-xs tracking-wide text-black/62 uppercase transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-3 md:order-none md:col-span-4 md:self-stretch">
                    <p className="max-w-[42ch] text-base leading-[1.5] text-black/58 transition-colors duration-180">
                      {project.description}
                    </p>
                    <p className="mt-5 font-navbar text-xs leading-[1.5] tracking-[0.08em] text-black/58 uppercase md:mt-8">
                      {project.outcomes.join(" . ")}
                    </p>
                  </div>
                </Link>
              </CursorFollowLabel>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}
