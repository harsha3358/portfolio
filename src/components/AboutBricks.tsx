"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "@/lib/data";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

export default function AboutBricks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const words = personal.tagline.split(" ");
  let letterIndex = 0;

  useEffect(() => {
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rmQuery.matches) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

    gsap.set(letters, {
      opacity: 0,
      filter: "blur(10px)",
      color: "#f4f2ec",
      textShadow: "none",
    });
    letters.forEach((el, i) => {
      const rx = (seededRandom(i) - 0.5) * 2;
      const ry = (seededRandom(i + 50) - 0.5) * 2;
      gsap.set(el, {
        x: rx * 220,
        y: ry * 140,
        z: -400 - seededRandom(i + 100) * 300,
        rotationX: rx * 70,
        rotationY: ry * 70,
      });
    });

    const restingGlow = "0 0 1px rgba(244,242,236,0.15)";
    const activeGlow = "0 0 14px rgba(207,154,82,0.95), 0 0 34px rgba(207,154,82,0.6)";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
      },
    });

    tl.to(
      letters,
      {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.018, from: "random" },
      },
      0
    )
      .to(
        letters,
        { color: "#fff7e6", textShadow: activeGlow, duration: 0.22, stagger: { each: 0.018, from: "start" } },
        1.05
      )
      .to(
        letters,
        { color: "#f4f2ec", textShadow: restingGlow, duration: 0.35, stagger: { each: 0.018, from: "start" } },
        1.4
      )
      .to(
        letters,
        {
          y: 140,
          skewY: 8,
          filter: "blur(14px)",
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          stagger: { each: 0.014, from: "start" },
        },
        1.95
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background">
        <div
          className="container-cinematic text-center"
          style={{ perspective: "1000px" }}
        >
          <p
            className="font-display font-medium tracking-tight text-balance text-3xl md:text-5xl lg:text-6xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {words.map((word, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap mr-[0.28em]">
                {word.split("").map((char) => {
                  const idx = letterIndex++;
                  return (
                    <span
                      key={idx}
                      ref={(el) => {
                        lettersRef.current[idx] = el;
                      }}
                      className="inline-block"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
