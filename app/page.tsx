import { Hero } from "@/components/hero"
import { IntroLoader } from "@/components/intro-loader"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      <Navbar />
      <Hero />
      <IntroLoader />
    </main>
  )
}
