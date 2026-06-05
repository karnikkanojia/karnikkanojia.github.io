import { Clients } from "@/components/clients";
import { CTA } from "@/components/cta";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Gap } from "@/components/gap";
import { Hero } from "@/components/hero";
import { Introduction } from "@/components/introduction";
import { Navbar } from "@/components/navbar";
import { Process } from "@/components/process";
import { Services } from "@/components/services";
import { SiteLoader } from "@/components/site-loader";
import { Works } from "@/components/works";

export default function Home() {
  return (
    <main className="relative">
      <SiteLoader />
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
