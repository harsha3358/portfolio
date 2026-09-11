import Reveal from "@/components/Reveal";

export default function SectionHeading({
  index,
  title,
  eyebrow,
}: {
  index: string;
  title: string;
  eyebrow: string;
}) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <p className="font-serif-accent italic text-accent text-lg md:text-xl mb-2">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-balance">
            {title}
          </h2>
        </div>
        <span className="font-display text-sm md:text-base text-muted shrink-0 pb-1">
          {index}
        </span>
      </div>
    </Reveal>
  );
}
