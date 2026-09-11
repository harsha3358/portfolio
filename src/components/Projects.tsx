import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/data";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="container-cinematic py-28 md:py-36">
      <SectionHeading index="02" eyebrow="Selected work" title="Projects" />

      <div className="flex flex-col gap-20 md:gap-28">
        {featured.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.05}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-16 items-start"
            >
              <div className="relative rounded-2xl border border-border bg-surface overflow-hidden aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-transparent transition-opacity group-hover:opacity-100 opacity-70" />
                <span className="font-display text-6xl md:text-7xl text-foreground/10 group-hover:text-accent/25 transition-colors select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl md:text-4xl tracking-tight text-balance group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight className="size-6 shrink-0 mt-1 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-sm text-muted mt-2">{project.period}</p>

                <p className="mt-5 text-foreground/80 leading-relaxed text-balance">
                  {project.description}
                </p>

                <ul className="mt-5 flex flex-col gap-2">
                  {project.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-sm text-muted leading-relaxed">
                      <span className="text-accent mt-1.5">—</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-border px-3 py-1 text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 md:mt-32">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.2em] text-muted mb-8">
            More on GitHub
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {rest.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.05}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between h-full rounded-2xl border border-border p-6 hover:border-accent/50 hover:bg-surface transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-lg tracking-tight group-hover:text-accent transition-colors">
                      {project.title}
                    </h4>
                    <ArrowUpRight className="size-4 shrink-0 text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-1.5 gap-y-1">
                  {project.tags.map((t, idx) => (
                    <span key={t} className="text-xs text-muted/70">
                      {t}
                      {idx < project.tags.length - 1 && <span className="mx-1.5">·</span>}
                    </span>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
