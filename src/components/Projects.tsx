"use client";

import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/lib/data";

const SPACING = 280;
const THROTTLE_MS = 420;

function ProjectCard({
  project,
  offset,
  onSelect,
}: {
  project: (typeof projects)[number];
  offset: number;
  onSelect: () => void;
}) {
  const isActive = offset === 0;
  const abs = Math.abs(offset);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{ zIndex: 100 - abs, pointerEvents: abs > 2 ? "none" : "auto" }}
      initial={{ x: "-50%", y: "-50%", scale: 0.82, opacity: 0 }}
      animate={{
        x: `calc(-50% + ${offset * SPACING}px)`,
        y: "-50%",
        scale: isActive ? 1 : Math.max(0.62, 1 - abs * 0.15),
        opacity: Math.max(0.1, 1 - abs * 0.32),
        rotateY: offset * -10,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
    >
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!isActive) {
            e.preventDefault();
            onSelect();
          }
        }}
        className="block w-[78vw] max-w-[300px] sm:max-w-[380px] md:max-w-[460px] rounded-xl overflow-hidden border border-border bg-surface"
        style={{ boxShadow: isActive ? "0 40px 80px -25px rgba(0,0,0,0.65)" : "0 20px 40px -20px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center min-w-0">
            <span className="text-[10px] font-mono text-muted px-3 py-0.5 rounded-full bg-background/50 truncate max-w-full">
              {project.domain}
            </span>
          </div>
        </div>

        <div className="relative aspect-[16/10] bg-background overflow-hidden">
          {project.image || project.repo ? (
            <Image
              src={project.image ?? `https://opengraph.githubassets.com/1/${project.repo}`}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 460px, 78vw"
              className="object-cover"
              unoptimized={project.image?.includes("thum.io") ?? false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/25 via-surface to-surface">
              <span className="font-display text-4xl md:text-5xl text-foreground/15 select-none">
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 md:p-5">
          <h3 className="font-display text-base md:text-xl tracking-tight text-balance">
            {project.title}
          </h3>
          <p className="text-[11px] text-muted mt-1">{project.period}</p>
          <p className="mt-2.5 text-xs md:text-sm text-foreground/75 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[9px] md:text-[10px] rounded-full border border-border px-2 py-0.5 text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Projects() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const throttleRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(projects.length - 1, i)));

  const step = (forward: boolean) => {
    if (throttleRef.current) return;
    throttleRef.current = true;
    setIndex((i) => Math.max(0, Math.min(projects.length - 1, i + (forward ? 1 : -1))));
    setTimeout(() => {
      throttleRef.current = false;
    }, THROTTLE_MS);
  };

  // React attaches onWheel as a passive listener, so preventDefault() there
  // is silently ignored. Attach a native, non-passive listener instead so we
  // can actually stop page scroll while cycling through projects.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const primary = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(primary) < 4) return;
      const forward = primary > 0;
      const atStart = index === 0;
      const atEnd = index === projects.length - 1;

      if ((atStart && !forward) || (atEnd && forward)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      step(forward);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [index]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let inView = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    const handleKey = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(false);
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) step(dx < 0);
    touchStartX.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative min-h-screen flex flex-col overflow-hidden py-24"
    >
      <div className="container-cinematic w-full">
        <SectionHeading index="02" eyebrow="Selected work" title="Projects" />
      </div>

      <div
        ref={carouselRef}
        data-lenis-prevent
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 w-full flex items-center justify-center"
        style={{ perspective: "1600px", minHeight: "420px" }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} offset={i - index} onSelect={() => goTo(i)} />
        ))}

        <button
          aria-label="Previous project"
          onClick={() => step(false)}
          disabled={index === 0}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[200] size-9 md:size-11 rounded-full border border-border bg-surface/80 backdrop-blur flex items-center justify-center text-foreground/80 hover:text-accent hover:border-accent/50 transition-colors disabled:opacity-25 disabled:pointer-events-none"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          aria-label="Next project"
          onClick={() => step(true)}
          disabled={index === projects.length - 1}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[200] size-9 md:size-11 rounded-full border border-border bg-surface/80 backdrop-blur flex items-center justify-center text-foreground/80 hover:text-accent hover:border-accent/50 transition-colors disabled:opacity-25 disabled:pointer-events-none"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="container-cinematic w-full flex items-center justify-center gap-2 mt-8">
        {projects.map((project, i) => (
          <button
            key={project.title}
            aria-label={`Go to ${project.title}`}
            onClick={() => goTo(i)}
            className="p-1.5"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                background: i === index ? "var(--accent)" : "var(--border)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
