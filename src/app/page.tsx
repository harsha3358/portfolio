import Nav from "@/components/Nav";
import LaptopIntro from "@/components/laptop/LaptopIntro";
import SkillsJar from "@/components/SkillsJar";
import AboutBricks from "@/components/AboutBricks";
import AboutTerminal from "@/components/AboutTerminal";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <LaptopIntro />
        <SkillsJar />
        <AboutBricks />
        <AboutTerminal />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
