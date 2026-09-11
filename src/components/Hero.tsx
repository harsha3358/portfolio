"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { personal } from "@/lib/data";

const line1 = "AI Engineer".split("");
const line2 = "& Full-Stack".split("");
const line3 = "Developer".split("");

function KineticLine({ chars, delayStart }: { chars: string[]; delayStart: number }) {
  return (
    <span className="inline-block overflow-hidden">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{
            duration: 0.9,
            delay: delayStart + i * 0.02,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[70rem] h-[70rem] rounded-full bg-accent/10 blur-[140px]" />

      <div className="container-cinematic relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif-accent italic text-accent text-lg md:text-2xl mb-6"
        >
          {personal.name}
        </motion.p>

        <h1 className="font-display font-medium tracking-tight leading-[0.95] text-[13vw] md:text-[7.5vw] lg:text-[6.5rem]">
          <KineticLine chars={line1} delayStart={0.3} />
          <br />
          <span className="text-muted">
            <KineticLine chars={line2} delayStart={0.55} />
          </span>
          <br />
          <KineticLine chars={line3} delayStart={0.8} />
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <p className="max-w-md text-muted text-base md:text-lg leading-relaxed text-balance">
            {personal.tagline} Working across LLMs, RAG, and NLP — shipped end to end
            with FastAPI, Kafka, and AWS.
          </p>

          <a
            href="#work"
            className="group inline-flex items-center gap-3 self-start md:self-auto rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            View selected work
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
