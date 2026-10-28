import { About, Stats } from "@/components/about";
import { Contact } from "@/components/contact";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Marquee } from "@/components/marquee";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <main className="overflow-x-clip bg-paper">
      <Header />
      <Hero />
      <About />
      <Stats />
      <Work />
      <Journey />
      <Marquee />
      <Contact />
    </main>
  );
}
