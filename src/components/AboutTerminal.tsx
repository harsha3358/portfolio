"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mapRange, smoothstep } from "@/lib/laptopMath";
import { buildTypedHTML, tokenizeSource, totalChars } from "@/lib/codeHighlight";
import { profileCode, profileForHumans, profileOutput } from "@/lib/data";

function Dots({ className }: { className?: string }) {
  return (
    <span className={className}>
      Running python3 harsha.py
      <span className="loading-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </span>
  );
}

export default function AboutTerminal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const terminalWrapRef = useRef<HTMLDivElement>(null);
  const codePaneRef = useRef<HTMLDivElement>(null);
  const codeInnerRef = useRef<HTMLDivElement>(null);
  const outputPaneRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const outputContentRef = useRef<HTMLDivElement>(null);

  const codeLines = useMemo(() => tokenizeSource(profileCode), []);
  const codeTotal = useMemo(() => totalChars(codeLines), [codeLines]);
  const outputLines = useMemo(() => tokenizeSource(profileOutput), []);

  useEffect(() => {
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rmQuery.matches) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    if (codeInnerRef.current) {
      codeInnerRef.current.innerHTML = buildTypedHTML(codeLines, 0, false);
    }

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        const p = self.progress;

        const headingOpacity = smoothstep(0, 0.03, p) - smoothstep(0.08, 0.12, p);
        if (headingRef.current) {
          headingRef.current.style.opacity = String(Math.max(0, headingOpacity));
        }

        const terminalOpacity = smoothstep(0.1, 0.16, p) * (1 - smoothstep(0.92, 1, p));
        const terminalScale = mapRange(smoothstep(0.1, 0.16, p), 0, 1, 0.94, 1);
        if (terminalWrapRef.current) {
          terminalWrapRef.current.style.opacity = String(terminalOpacity);
          terminalWrapRef.current.style.transform = `scale(${terminalScale}) translateY(${(1 - smoothstep(0.92, 1, p)) < 1 ? -smoothstep(0.94, 1, p) * 30 : 0}px)`;
        }

        const typeProgress = smoothstep(0.16, 0.56, p);
        const visibleChars = Math.round(typeProgress * codeTotal);
        const typingActive = typeProgress > 0 && typeProgress < 1;
        if (codeInnerRef.current) {
          codeInnerRef.current.innerHTML = buildTypedHTML(codeLines, visibleChars, typingActive);
        }

        const splitT = smoothstep(0.56, 0.62, p);
        if (codePaneRef.current) {
          codePaneRef.current.style.flexBasis = `${mapRange(splitT, 0, 1, 100, 50)}%`;
        }
        if (outputPaneRef.current) {
          outputPaneRef.current.style.flexBasis = `${mapRange(splitT, 0, 1, 0, 50)}%`;
          outputPaneRef.current.style.opacity = String(splitT);
        }

        const loadingOpacity = smoothstep(0.6, 0.65, p) * (1 - smoothstep(0.68, 0.72, p));
        if (loadingRef.current) {
          loadingRef.current.style.opacity = String(loadingOpacity);
        }

        const outputOpacity = smoothstep(0.72, 0.82, p);
        if (outputContentRef.current) {
          outputContentRef.current.style.opacity = String(outputOpacity);
          outputContentRef.current.style.transform = `translateY(${(1 - outputOpacity) * 16}px)`;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [codeLines, codeTotal]);

  return (
    <section ref={sectionRef} id="about" className="relative h-[430vh] md:h-[460vh]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background">
        <div
          ref={headingRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: 0 }}
        >
          <p className="font-serif-accent italic text-accent text-lg md:text-xl mb-4">
            Who I am
          </p>
          <h2 className="font-display font-medium tracking-tight text-4xl md:text-6xl">
            know me here <span className="text-accent">:)</span>
          </h2>
        </div>

        <div
          ref={terminalWrapRef}
          className="container-cinematic w-full max-w-5xl px-4"
          style={{ opacity: 0, transform: "scale(0.94)" }}
        >
          <div className="flex gap-4 md:gap-5 items-stretch">
            <div
              ref={codePaneRef}
              className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col"
              style={{ flexBasis: "100%", minWidth: 0 }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2/60">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs text-muted font-mono">harsha.py</span>
              </div>
              <div
                ref={codeInnerRef}
                className="font-mono text-[11px] md:text-[13px] leading-[1.65] p-4 md:p-5 overflow-x-auto"
                style={{ whiteSpace: "pre" }}
              />
            </div>

            <div
              ref={outputPaneRef}
              className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col relative"
              style={{ flexBasis: "0%", opacity: 0, minWidth: 0 }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2/60">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs text-muted font-mono">output</span>
              </div>

              <div className="relative flex-1 p-4 md:p-5 overflow-y-auto">
                <div
                  ref={loadingRef}
                  className="absolute inset-0 flex items-center justify-center px-6"
                  style={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <span className="spinner-ring" />
                    <Dots className="font-mono text-xs text-muted whitespace-nowrap" />
                  </div>
                </div>

                <div ref={outputContentRef} style={{ opacity: 0 }}>
                  <pre className="font-mono text-[10px] md:text-[12px] leading-[1.6] whitespace-pre-wrap">
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

                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-accent mb-3">
                      In plain English
                    </p>
                    <ul className="flex flex-col gap-2">
                      {profileForHumans.map((line) => (
                        <li
                          key={line}
                          className="text-[11px] md:text-sm text-foreground/85 leading-relaxed flex gap-2"
                        >
                          <span className="text-accent">—</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
