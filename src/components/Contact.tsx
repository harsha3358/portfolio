import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="container-cinematic py-28 md:py-40">
      <Reveal>
        <p className="font-serif-accent italic text-accent text-lg md:text-xl mb-6">
          Get in touch
        </p>
        <h2 className="font-display font-medium tracking-tight leading-[0.95] text-[11vw] md:text-[6vw] lg:text-6xl text-balance">
          Let&rsquo;s build something
          <br />
          <span className="text-muted">worth shipping.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-t border-border pt-10">
          <a
            href={`mailto:${personal.email}`}
            className="group inline-flex items-center gap-3 font-display text-2xl md:text-3xl hover:text-accent transition-colors"
          >
            {personal.email}
            <ArrowUpRight className="size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <div className="flex gap-8">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-sm text-muted">{personal.phone}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
