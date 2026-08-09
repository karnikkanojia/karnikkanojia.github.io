import { BlogFooterTransition } from "@/components/blog-footer-transition"
import {
  BlogsShowcase,
  ProjectsShowcase,
} from "@/components/editorial-showcase"
import { GithubCalendar } from "@/components/ui/github-calendar"
import { WorkExperience } from "@/components/work-experience"
import type { MediumPost } from "@/lib/medium"
import { WORK_EXPERIENCES } from "@/lib/work-experiences"

type HomeSectionsProps = {
  mediumPosts: MediumPost[]
}

const SECTION_BASE_CLASS =
  "relative z-10 flex scroll-mt-12 bg-white px-5 text-black md:px-8"

export function HomeSections({ mediumPosts }: HomeSectionsProps) {
  return (
    <>
      <WorkSection />
      <GithubSection />
      <ProjectsSection />
      <BlogsSection posts={mediumPosts} />
    </>
  )
}

function WorkSection() {
  return (
    <section
      id="work"
      data-deferred-section="true"
      className={`${SECTION_BASE_CLASS} min-h-screen items-center py-12 md:py-16`}
    >
      <div className="mx-auto w-full max-w-3xl text-left">
        <h2 className="sr-only">
          Reliability engineering for services people count on.
        </h2>
        <WorkExperience
          className="mt-10 md:mt-14"
          experiences={WORK_EXPERIENCES}
        />
      </div>
    </section>
  )
}

function GithubSection() {
  return (
    <section
      id="github"
      data-deferred-section="true"
      className={`${SECTION_BASE_CLASS} min-h-0 items-start py-6 md:py-8`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="sr-only">
          A year of building, learning, and shipping in public.
        </h2>
        <div className="w-full min-w-0">
          <GithubCalendar
            username="karnikkanojia"
            colorSchema="blue"
            shape="rounded"
          />
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      data-deferred-section="true"
      className={`${SECTION_BASE_CLASS} min-h-0 items-start py-8 md:py-6`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="sr-only">
          Experiments in automation, observability, and resilient systems.
        </h2>
        <ProjectsShowcase />
      </div>
    </section>
  )
}

function BlogsSection({ posts }: { posts: MediumPost[] }) {
  return (
    <BlogFooterTransition>
      <h2 className="sr-only">
        Notes on reliability, infrastructure, and building resilient systems.
      </h2>
      <BlogsShowcase posts={posts} />
    </BlogFooterTransition>
  )
}
