import { Hero } from "@/components/hero"
import { IntroTransition } from "@/components/intro-transition"
import { Navbar } from "@/components/navbar"
import { GithubCalendar } from "@/components/ui/github-calendar"
import {
  WorkExperience,
  type ExperienceItemType,
} from "@/components/work-experience"

const workExperiences: ExperienceItemType[] = [
  {
    id: "oracle",
    companyName: "Oracle",
    companyLogo: "/logos/work/oracle.jpg",
    companyWebsite: "https://www.oracle.com/",
    isCurrentEmployer: true,
    positions: [
      {
        id: "oracle-site-reliability-engineer",
        title: "Site Reliability Engineer",
        employmentType: "Full-time",
        employmentPeriod: { start: "08.2024" },
        skills: ["Python", "Oracle Database"],
      },
    ],
  },
  {
    id: "mi4people",
    companyName: "MI4People",
    companyLogo: "/logos/work/mi4people.jpg",
    companyWebsite: "https://www.mi4people.org/",
    positions: [
      {
        id: "mi4people-data-scientist",
        title: "Data Scientist",
        employmentType: "Part-time",
        employmentPeriod: { start: "07.2022", end: "07.2024" },
        skills: ["Python", "TensorFlow"],
      },
    ],
  },
  {
    id: "samsung-rd-institute-india",
    companyName: "Samsung R&D Institute India",
    companyLogo: "/logos/work/samsung-rd-india.jpg",
    companyWebsite: "https://research.samsung.com/",
    positions: [
      {
        id: "samsung-research-intern",
        title: "Research Intern",
        employmentType: "Full-time",
        employmentPeriod: { start: "12.2022", end: "08.2023" },
        skills: ["Data Analysis"],
      },
    ],
  },
  {
    id: "national-university-of-singapore",
    companyName: "National University of Singapore",
    companyLogo: "/logos/work/nus.jpg",
    companyWebsite: "https://www.nus.edu.sg/",
    positions: [
      {
        id: "nus-research-intern",
        title: "Research Intern",
        employmentType: "Internship",
        employmentPeriod: { start: "01.2023", end: "05.2023" },
        skills: ["Deep Learning", "Data Analysis"],
      },
    ],
  },
]

const sections = [
  {
    id: "about",
    eyebrow: "About Me",
    title: "Keeping critical systems calm, clear, and dependable.",
  },
  {
    id: "work",
    eyebrow: "Work",
    title: "Reliability engineering for services people count on.",
  },
  {
    id: "github",
    eyebrow: "GitHub",
    title: "A year of building, learning, and shipping in public.",
  },
  {
    id: "projects",
    eyebrow: "Projects",
    title: "Experiments in automation, observability, and resilient systems.",
  },
  {
    id: "blogs",
    eyebrow: "Blogs",
    title:
      "Notes on reliability, infrastructure, and building resilient systems.",
  },
  {
    id: "contact",
    eyebrow: "Contact Me",
    title: "Let’s build something reliable together.",
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <IntroTransition>
        <main className="min-h-screen w-full overflow-x-clip bg-white text-black">
          <Hero />
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`relative z-10 flex min-h-[70vh] scroll-mt-12 items-end bg-white px-5 py-12 text-black md:px-8 md:py-16 ${
                section.id === "about" ? "md:-mt-[100vh]" : ""
              }`}
            >
              <div
                className={
                  section.id === "work"
                    ? "mx-auto w-full max-w-6xl"
                    : section.id === "github"
                      ? "mx-auto w-full max-w-6xl"
                      : "w-full max-w-3xl"
                }
              >
                <p className="mb-4 text-sm tracking-wide text-black/55">
                  {section.eyebrow}
                </p>
                <h2 className="max-w-4xl text-3xl leading-[1.02] font-medium tracking-tight text-balance md:text-5xl">
                  {section.title}
                </h2>
                {section.id === "work" && (
                  <WorkExperience
                    className="mt-10 md:mt-14"
                    experiences={workExperiences}
                  />
                )}
                {section.id === "github" && (
                  <div className="mt-10 w-full min-w-0 md:mt-14">
                    <GithubCalendar
                      username="karnikkanojia"
                      colorSchema="blue"
                      shape="rounded"
                    />
                  </div>
                )}
              </div>
            </section>
          ))}
        </main>
      </IntroTransition>
    </>
  )
}
