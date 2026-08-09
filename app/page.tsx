import { AboutSection } from "@/components/about-section"
import { Hero } from "@/components/hero"
import { HomeSections } from "@/components/home-sections"
import { IntroTransition } from "@/components/intro-transition"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { getMediumPosts } from "@/lib/medium"

export const revalidate = 3600

export default async function Home() {
  const mediumPosts = await getMediumPosts().catch(() => [])

  return (
    <PullToRefresh>
      <IntroTransition>
        <a
          href="#content"
          className="skip-link fixed top-3 left-3 z-300 rounded-md bg-black px-4 py-2 text-white shadow-lg"
        >
          Skip to main content
        </a>
        <main
          id="content"
          tabIndex={-1}
          className="min-h-screen w-full overflow-x-clip rounded-b-[0.625rem] bg-white text-black focus:outline-none"
        >
          <Hero />
          <section
            id="about"
            className="relative z-20 scroll-mt-12 bg-white md:mt-[-100vh]"
          >
            <AboutSection />
          </section>
          <HomeSections mediumPosts={mediumPosts} />
        </main>
      </IntroTransition>
    </PullToRefresh>
  )
}
