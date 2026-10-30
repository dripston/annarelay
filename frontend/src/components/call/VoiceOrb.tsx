"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/motion";
import { cx } from "@/components/ui";

export type OrbMode = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "ended";

const RING: Record<OrbMode, string> = {
  idle: "#1f7a4c",
  connecting: "#f2b544",
  listening: "#1f7a4c",
  thinking: "#f2b544",
  speaking: "#d9822b",
  ended: "#b9b0a2",
};

/**
 * The call's living centre. One rAF loop reads `level()` (0..1, mic or agent voice) and writes CSS
 * variables, so React never re-renders per frame. Static under prefers-reduced-motion.
 */
export function VoiceOrb({ mode, level, className }: { mode: OrbMode; level: () => number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    let smooth = 0;
    let t = 0;
    const tick = () => {
      t += 1;
      const target = mode === "listening" || mode === "speaking" ? level() : mode === "thinking" ? 0.25 + 0.15 * Math.sin(t / 9) : 0.05;
      smooth += (target - smooth) * 0.18;
      el.style.setProperty("--lvl", smooth.toFixed(3));
      el.style.setProperty("--spin", `${(t * (mode === "thinking" ? 2.4 : 0.6)) % 360}deg`);
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, level, reduced]);

  const color = RING[mode];
  return (
    <div
      ref={ref}
      aria-hidden
      className={cx("relative aspect-square w-full max-w-[300px]", className)}
      style={{ ["--lvl" as string]: "0", ["--spin" as string]: "0deg", ["--c" as string]: color }}
    >
      {/* outer glow, breathes with the voice */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-colors duration-500"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--c) 45%, transparent) 0%, transparent 65%)`,
          transform: "scale(calc(0.85 + var(--lvl) * 0.5))",
          opacity: "calc(0.45 + var(--lvl) * 0.55)",
        }}
      />
      {/* rotating conic ring */}
      <div
        className="absolute inset-[9%] rounded-full"
        style={{
          background: `conic-gradient(from var(--spin), transparent 0deg, var(--c) 90deg, transparent 180deg, color-mix(in srgb, var(--c) 60%, transparent) 270deg, transparent 360deg)`,
          mask: "radial-gradient(circle, transparent 63%, #000 64%, #000 67%, transparent 68%)",
          WebkitMask: "radial-gradient(circle, transparent 63%, #000 64%, #000 67%, transparent 68%)",
          opacity: mode === "idle" || mode === "ended" ? 0.25 : 0.9,
        }}
      />
      {/* echo rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-[18%] rounded-full border transition-colors duration-500"
          style={{
            borderColor: `color-mix(in srgb, var(--c) ${30 - i * 8}%, transparent)`,
            transform: `scale(calc(1 + var(--lvl) * ${0.18 + i * 0.12}))`,
          }}
        />
      ))}
      {/* core */}
      <div
        className="absolute inset-[26%] rounded-full shadow-[inset_0_-14px_36px_rgb(30_38_32/0.28),0_18px_40px_-18px_rgb(30_38_32/0.45)]"
        style={{
          background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--c) 55%, #fff) 0%, var(--c) 42%, color-mix(in srgb, var(--c) 70%, #1e2620) 100%)`,
          transform: "scale(calc(0.94 + var(--lvl) * 0.14))",
          transition: "background 500ms",
        }}
      />
      {/* specular highlight */}
      <div className="absolute top-[31%] left-[36%] h-[12%] w-[18%] rounded-full bg-snow/55 blur-md" />
    </div>
  );
}
