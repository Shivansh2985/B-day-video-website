import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  text: string;
  triggerKey: string | number;
}

/**
 * GSAP-powered floating invitation text.
 * - Each word shoots up from below with blur + 3D rotate + scale.
 * - Lands with a satisfying overshoot (back.out).
 * - Then each word floats in a continuous wave, staggered from center.
 * - No box or container — raw floating words on the screen.
 */
export const FloatingText = ({ text, triggerKey }: Props) => {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const words = text.split(" ");

  useEffect(() => {
    const els = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!els.length) return;

    // Kill previous timeline
    tlRef.current?.kill();
    gsap.killTweensOf(els);

    // Reset
    gsap.set(els, {
      y: 70,
      opacity: 0,
      scale: 0.6,
      filter: "blur(14px)",
      rotationX: 45,
      transformPerspective: 600,
    });

    const tl = gsap.timeline();
    tlRef.current = tl;

    // ── Phase 1: Staggered shoot-up ──
    tl.to(els, {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotationX: 0,
      duration: 0.85,
      ease: "back.out(1.6)",
      stagger: 0.07,
    });

    // ── Phase 2: Gentle pulse glow on each word ──
    tl.to(els, {
      textShadow: [
        "0 0 30px hsl(45 100% 80% / 1)",
        "0 0 60px hsl(330 90% 75% / 0.9)",
        "0 0 100px hsl(300 80% 70% / 0.5)",
        "0 4px 0 hsl(330 70% 35% / 0.8)",
      ].join(", "),
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.06,
    }, "-=0.3");

    // ── Phase 3: Continuous wave float ──
    tl.to(els, {
      y: -14,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { amount: 0.9, from: "center" },
    }, "+=0.1");

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-[50%] -translate-y-1/2 z-40 flex flex-wrap items-center justify-center px-4"
      style={{ gap: "0.18em", perspective: 700 }}
    >
      {words.map((w, i) => (
        <span
          key={`${triggerKey}-${i}`}
          ref={(el) => { wordRefs.current[i] = el; }}
          style={{
            display: "inline-block",
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.35rem, 5.8vw, 2rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#fff",
            textShadow: [
              "0 0 18px hsl(330 90% 75% / 0.9)",
              "0 0 36px hsl(45 100% 75% / 0.65)",
              "0 3px 0 hsl(330 70% 35% / 0.8)",
              "0 5px 14px hsl(330 50% 20% / 0.6)",
            ].join(", "),
            willChange: "transform, opacity, filter",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};