import { AboutSection } from "@/components/about";
import { ContactSection } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Portfolio } from "@/components/portfolio";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <Portfolio />
        <Experience />
        <Skills />
        <ContactSection />
      </main>
    </>
  );
}
