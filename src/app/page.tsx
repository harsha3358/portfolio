import Nav from "@/components/Nav";
import LaptopIntro from "@/components/laptop/LaptopIntro";
import Marquee from "@/components/Marquee";
import AboutBricks from "@/components/AboutBricks";
import AboutTerminal from "@/components/AboutTerminal";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <LaptopIntro />
        <Marquee />
        <AboutBricks />
        <AboutTerminal />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
