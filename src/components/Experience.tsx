import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { certifications, education, experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="container-cinematic py-28 md:py-36">
      <SectionHeading index="04" eyebrow="Track record" title="Experience" />

      <div className="flex flex-col gap-14">
        {experience.map((job) => (
          <Reveal key={job.company}>
            <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-16 border-b border-border pb-14">
              <div>
                <h3 className="font-display text-2xl tracking-tight">{job.company}</h3>
                <p className="text-accent mt-1">{job.role}</p>
                <p className="text-sm text-muted mt-2">{job.period}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {job.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-foreground/80 leading-relaxed">
                    <span className="text-accent mt-1">—</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-14 mt-20">
        <Reveal>
          <div>
            <h3 className="font-display text-xl mb-6">Education</h3>
            <div className="flex flex-col gap-6">
              {education.map((e) => (
                <div key={e.school} className="flex justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="font-medium">{e.school}</p>
                    <p className="text-sm text-muted mt-1">{e.degree}</p>
                  </div>
                  <p className="text-sm text-muted shrink-0 text-right">{e.period}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <h3 className="font-display text-xl mb-6">Certifications</h3>
            <div className="flex flex-col gap-6">
              {certifications.map((c) => (
                <div key={c.name} className="flex justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted mt-1">{c.issuer}</p>
                  </div>
                  <p className="text-sm text-muted shrink-0 text-right">{c.date}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
