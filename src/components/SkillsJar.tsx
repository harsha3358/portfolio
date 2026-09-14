"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

type JarItem = {
  label: string;
  color: string;
};

const PALETTE = [
  "#cf9a52",
  "#e8c893",
  "#c9834a",
  "#b0664f",
  "#d9a86c",
  "#a97c9a",
  "#7fa8c9",
  "#8fb37a",
];

const LABELS = [
  "Python",
  "Java",
  "SQL",
  "TensorFlow",
  "Scikit-Learn",
  "NLP",
  "BERT",
  "LSTM",
  "LangChain",
  "Hugging Face",
  "RAG",
  "AI Agents",
  "FastAPI",
  "REST APIs",
  "AWS",
  "PySpark",
  "Kafka",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "GitHub",
  "Docker",
  "Power BI",
  "Jupyter",
  "Linux",
  "Postman",
];

const ITEMS: JarItem[] = LABELS.map((label, i) => ({
  label,
  color: PALETTE[i % PALETTE.length],
}));

const CHIP_HEIGHT = 34;
const REPEL_RADIUS = 100;
const REPEL_STRENGTH = 0.018;

function chipWidth(label: string) {
  return Math.min(150, Math.max(64, label.length * 8.4 + 30));
}

export default function SkillsJar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed || reducedMotion) return;
    const column = columnRef.current;
    const jar = jarRef.current;
    if (!column || !jar) return;

    const columnRect = column.getBoundingClientRect();
    const jarRect = jar.getBoundingClientRect();
    const wallThickness = 20;
    const inset = 12;
    const jarLeft = jarRect.left - columnRect.left + inset;
    const jarRight = jarRect.right - columnRect.left - inset;
    const jarBottom = jarRect.bottom - columnRect.top - 6;
    const jarTop = jarRect.top - columnRect.top;
    const columnHeight = columnRect.height;
    const spawnYMax = Math.max(10, jarTop - 36);

    const engine = Matter.Engine.create();
    engine.gravity.y = 1.05;
    engine.enableSleeping = true;

    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      restitution: 0.1,
      friction: 0.5,
    };

    const leftWall = Matter.Bodies.rectangle(
      jarLeft - wallThickness / 2,
      columnHeight / 2,
      wallThickness,
      columnHeight + 200,
      wallOptions
    );
    const rightWall = Matter.Bodies.rectangle(
      jarRight + wallThickness / 2,
      columnHeight / 2,
      wallThickness,
      columnHeight + 200,
      wallOptions
    );
    const floor = Matter.Bodies.rectangle(
      (jarLeft + jarRight) / 2,
      jarBottom + wallThickness / 2 - 4,
      jarRight - jarLeft,
      wallThickness,
      wallOptions
    );

    Matter.World.add(engine.world, [leftWall, rightWall, floor]);

    const bodies: { body: Matter.Body; el: HTMLDivElement; w: number; h: number }[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const order = ITEMS.map((_, i) => i).sort(() => Math.random() - 0.5);

    order.forEach((itemIndex, seq) => {
      const el = chipRefs.current[itemIndex];
      if (!el) return;
      const w = chipWidth(ITEMS[itemIndex].label);
      const h = CHIP_HEIGHT;
      const delay = 350 + seq * (90 + Math.random() * 140);
      const t = setTimeout(() => {
        const halfW = w / 2 + 3;
        const spawnStart = jarLeft + halfW;
        const spawnEnd = jarRight - halfW;
        const x = spawnStart + Math.random() * Math.max(1, spawnEnd - spawnStart);
        const y = 6 + Math.random() * spawnYMax * 0.5;
        const body = Matter.Bodies.rectangle(x, y, w, h, {
          restitution: 0.32,
          friction: 0.25,
          frictionAir: 0.015,
          density: 0.0016,
          chamfer: { radius: h / 2 },
        });
        // Falls flat and stays horizontal — no tumbling.
        Matter.Body.setInertia(body, Infinity);
        Matter.World.add(engine.world, body);
        bodies.push({ body, el, w, h });
        el.style.opacity = "1";
      }, delay);
      timeouts.push(t);
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const mouse = { x: -9999, y: -9999, active: false };
    const handleMove = (e: MouseEvent) => {
      const rect = column.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleLeave = () => {
      mouse.active = false;
    };
    column.addEventListener("mousemove", handleMove);
    column.addEventListener("mouseleave", handleLeave);

    const sync = () => {
      for (const { body, el, w } of bodies) {
        let hoverScale = 1;
        let glow = 0;
        if (mouse.active) {
          const dx = body.position.x - mouse.x;
          const dy = body.position.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < REPEL_RADIUS && !body.isStatic) {
            const falloff = (REPEL_RADIUS - dist) / REPEL_RADIUS;
            const force = falloff * REPEL_STRENGTH;
            Matter.Body.applyForce(body, body.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            });
            hoverScale = 1 + falloff * 0.22;
            glow = falloff;
          }
        }
        el.style.transform = `translate3d(${body.position.x - w / 2}px, ${
          body.position.y - CHIP_HEIGHT / 2
        }px, 0) rotate(${body.angle}rad) scale(${hoverScale})`;
        el.style.filter =
          glow > 0 ? `brightness(${1 + glow * 0.5}) saturate(${1 + glow * 0.4})` : "";
      }
    };
    Matter.Events.on(engine, "afterUpdate", sync);

    return () => {
      timeouts.forEach(clearTimeout);
      column.removeEventListener("mousemove", handleMove);
      column.removeEventListener("mouseleave", handleLeave);
      Matter.Events.off(engine, "afterUpdate", sync);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, [revealed, reducedMotion]);

  return (
    <section ref={sectionRef} id="skills" className="relative overflow-hidden py-24 md:py-32">
      <div className="container-cinematic grid md:grid-cols-2 gap-12 items-center">
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="font-serif-accent italic text-accent text-lg md:text-xl mb-3">
            fair warning
          </p>
          <h2 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-balance leading-[1.05]">
            Skill Issue?
            <br />
            Not Here.
          </h2>
          <p className="mt-6 text-muted text-base md:text-lg max-w-md leading-relaxed">
            Certified stack, unboxed and dropped in live. Hover the jar if you
            dare — nobody likes personal space.
          </p>
        </div>

        <div ref={columnRef} className="relative h-[420px] md:h-[560px] w-full select-none">
          <div
            ref={jarRef}
            className="jar-glass absolute left-1/2 -translate-x-1/2 bottom-0 w-[86%] md:w-[76%]"
            style={{
              height: "72%",
              opacity: revealed ? 1 : 0,
              transform: revealed
                ? "translateX(calc(-50% + 30px)) translateY(0) scale(1)"
                : "translateX(calc(-50% + 30px)) translateY(16px) scale(0.97)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span className="jar-highlight" />
          </div>

          {reducedMotion ? (
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[4%] w-[60%] md:w-[52%] flex flex-wrap gap-1.5 justify-center content-end"
              style={{ minHeight: "50%", opacity: revealed ? 1 : 0, transition: "opacity 0.8s ease" }}
            >
              {ITEMS.map((item) => (
                <SkillChip key={item.label} item={item} />
              ))}
            </div>
          ) : (
            ITEMS.map((item, i) => (
              <div
                key={item.label}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                className="absolute top-0 left-0 opacity-0"
                style={{ willChange: "transform" }}
              >
                <SkillChip item={item} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SkillChip({ item }: { item: JarItem }) {
  return (
    <div
      className="flex items-center justify-center rounded-full border whitespace-nowrap"
      style={{
        height: CHIP_HEIGHT,
        padding: "0 14px",
        background: "var(--surface-2)",
        borderColor: `${item.color}55`,
        boxShadow: `0 4px 14px -4px rgba(0,0,0,0.5), inset 0 0 0 1px ${item.color}1a`,
      }}
    >
      <span
        className="font-display font-medium tracking-tight text-[12px]"
        style={{ color: item.color }}
      >
        {item.label}
      </span>
    </div>
  );
}
