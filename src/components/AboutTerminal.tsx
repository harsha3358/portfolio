"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildTypedHTML, CODE_BG, CODE_BG_HEADER, CODE_COLORS, tokenizeSource, totalChars } from "@/lib/codeHighlight";
import { profileCode, profileOutput } from "@/lib/data";

type Phase = "heading" | "typing" | "ready" | "compiling" | "output";

// Cinematic self-typing pace, kept under a ~150 lines/min ceiling.
const CHARS_PER_SEC = 60;

export default function AboutTerminal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const codeInnerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const initialReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const initialPhase: Phase = initialReducedMotion ? "ready" : "heading";
  const phaseRef = useRef<Phase>(initialPhase);
  const [phase, setPhase] = useState<Phase>(initialPhase);

  const codeLines = useMemo(() => tokenizeSource(profileCode), []);
  const codeTotal = useMemo(() => totalChars(codeLines), [codeLines]);
  const outputLines = useMemo(() => tokenizeSource(profileOutput), []);

  const goTo = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  useEffect(() => {
    if (initialReducedMotion) {
      if (codeInnerRef.current) {
        codeInnerRef.current.innerHTML = buildTypedHTML(codeLines, codeTotal, false);
      }
      return;
    }

    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    let typingStarted = false;

    const startTyping = () => {
      typingStarted = true;
      goTo("typing");
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000;
        const visible = Math.min(codeTotal, Math.floor(elapsed * CHARS_PER_SEC));
        if (codeInnerRef.current) {
          codeInnerRef.current.innerHTML = buildTypedHTML(codeLines, visible, visible < codeTotal);
        }
        if (visible >= codeTotal) {
          goTo("ready");
          return;
        }
        rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);
    };

    // A normal scrollable section — no scroll-locking. Scrolling through it
    // at a normal pace lets the typing beat play out; scrolling straight
    // through moves on to the next section like any other.
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (!typingStarted && self.progress > 0.12) {
          startTyping();
        }
      },
      onLeaveBack: () => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        typingStarted = false;
        goTo("heading");
      },
    });

    return () => {
      trigger.kill();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [codeLines, codeTotal, initialReducedMotion]);

  const handleCompile = () => {
    if (phase !== "ready") return;
    goTo("compiling");
    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      goTo("output");
    }, delay);
  };

  const terminalVisible = phase !== "heading";

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-[220vh] md:h-[240vh]"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background px-4">
        <div
          className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-500 ${
            phase === "heading" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="font-display font-medium tracking-tight text-4xl md:text-6xl text-center">
            know me here <span className="text-accent">:)</span>
          </h2>
        </div>

        <div
          className={`w-full max-w-3xl transition-all duration-700 ease-out ${
            terminalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div
            className="rounded-xl border border-black/10 overflow-hidden"
            style={{ background: CODE_BG, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.55)" }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ background: CODE_BG_HEADER }}
            >
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[11px] font-mono" style={{ color: CODE_COLORS.punct }}>
                  harsha.py
                </span>
              </div>
              {phase === "ready" && (
                <button onClick={handleCompile} className="compile-btn">
                  ▶ Compile
                </button>
              )}
            </div>

            <div className="relative" style={{ height: "min(64vh, 620px)" }}>
              {phase !== "output" && (
                <div
                  ref={codeInnerRef}
                  data-lenis-prevent
                  className="terminal-scroll font-mono text-[12px] md:text-[13.5px] leading-[1.65] p-5 md:p-6 h-full overflow-y-auto"
                  style={{ whiteSpace: "pre" }}
                />
              )}

              {phase === "compiling" && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 font-mono text-[13px]"
                  style={{ background: CODE_BG, color: CODE_COLORS.default }}
                >
                  <div>
                    <span style={{ color: CODE_COLORS.punct }}>$ </span>
                    python3 harsha.py
                  </div>
                  <span className="spinner-ring-dark" />
                  <div style={{ color: CODE_COLORS.punct }} className="text-[11px]">
                    compiling vibes, please hold...
                  </div>
                </div>
              )}

              {phase === "output" && (
                <pre
                  data-lenis-prevent
                  className="terminal-scroll font-mono text-[12px] md:text-[13.5px] leading-[1.65] whitespace-pre-wrap p-5 md:p-6 h-full overflow-y-auto m-0"
                >
                  {outputLines.map((line, i) => (
                    <div key={i}>
                      {line.length === 0 ? (
                        <>&nbsp;</>
                      ) : (
                        line.map((t, j) => (
                          <span key={j} style={{ color: t.color }}>
                            {t.text}
                          </span>
                        ))
                      )}
                    </div>
                  ))}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
