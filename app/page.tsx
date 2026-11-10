import { AboutSection, Stats } from "@/components/about";
import { ContactSection } from "@/components/contact";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { SkillsRibbons } from "@/components/skills-ribbons";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <main className="overflow-x-clip bg-paper">
      <Header />
      <Hero />
      <AboutSection />
      <Stats />
      <Work />
      <Journey />
      <SkillsRibbons />
      <ContactSection />
    </main>
  );
}
