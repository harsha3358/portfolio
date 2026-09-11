import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="container-cinematic py-28 md:py-36">
      <SectionHeading index="03" eyebrow="Toolbox" title="Skills" />

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={(i % 2) * 0.08}>
            <div className="border-b border-border pb-6">
              <h3 className="font-display text-lg text-accent mb-4">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm rounded-full border border-border px-4 py-1.5 text-foreground/80 hover:border-accent hover:text-accent transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
