"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LaptopScene from "@/components/laptop/LaptopScene";
import { personal } from "@/lib/data";

export default function LaptopIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    rmQuery.addEventListener("change", handleChange);
    return () => rmQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        document.body.classList.toggle("laptop-intro-active", self.progress < 0.97);
        if (canvasWrapRef.current) {
          const fadeOut = self.progress > 0.93 ? 1 - (self.progress - 0.93) / 0.07 : 1;
          canvasWrapRef.current.style.opacity = String(Math.max(0, fadeOut));
        }
      },
    });

    document.body.classList.add("laptop-intro-active");

    return () => {
      trigger.kill();
      document.body.classList.remove("laptop-intro-active");
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <div
          className="size-24 rounded-full flex items-center justify-center text-4xl"
          style={{ background: "linear-gradient(135deg, #cf9a52, #8a5f2b)" }}
        >
          🙂
        </div>
        <h1 className="font-display text-3xl md:text-5xl tracking-tight">
          {personal.displayName}
        </h1>
        <p className="text-muted">{personal.role}</p>
      </section>
    );
  }

  return (
    <div ref={sectionRef} className="relative h-[300vh] md:h-[330vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <div ref={canvasWrapRef} className="absolute inset-0">
          <Canvas
            shadows
            dpr={[1, 1.8]}
            gl={{ antialias: true }}
            onCreated={({ gl }) => {
              gl.setClearColor("#07070a", 1);
            }}
          >
            <Suspense fallback={null}>
              <LaptopScene progressRef={progressRef} reducedMotion={reducedMotion} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
