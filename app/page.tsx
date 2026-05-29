import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Introduction } from "@/components/Introduction";
import { Clients } from "@/components/clients";
import { Gap } from "@/components/gap";
import { Works } from "@/components/works";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { FAQ } from "@/components/faq";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Introduction />
      <Clients />
      <Gap />
      <Works />
      <Services />
      <Process />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
