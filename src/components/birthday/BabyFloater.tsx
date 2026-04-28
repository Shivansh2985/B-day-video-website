import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  src: string;
  name: string;
  /** "left" | "right" — entry side */
  side?: "left" | "right";
  /** trigger remount on phase change */
  triggerKey: string | number;
}

/**
 * GSAP-driven floating baby portrait.
 * - Flies in from off-screen, hovers with a fairy-blessing lightning glow,
 *   then drifts away. Optimized: timeline auto-cleans on unmount.
 */
export const BabyFloater = ({ src, name, side = "left", triggerKey }: Props) => {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const bolt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const dirX = side === "left" ? -180 : 180;
    const tl = gsap.timeline();
    tl.set(wrap.current, { xPercent: dirX, yPercent: 20, opacity: 0, scale: 0.6, rotation: side === "left" ? -8 : 8 })
      .set(halo.current, { opacity: 0, scale: 0.5 })
      .set(bolt.current, { opacity: 0, scaleY: 0 })
      // fly in
      .to(wrap.current, { xPercent: 0, yPercent: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.4, ease: "power3.out" })
      // fairy lightning blessing
      .to(bolt.current, { opacity: 1, scaleY: 1, duration: 0.18, ease: "power2.out" }, "-=0.4")
      .to(bolt.current, { opacity: 0, duration: 0.25, ease: "power1.in" })
      .to(halo.current, { opacity: 1, scale: 1.1, duration: 0.6, ease: "power2.out" }, "-=0.3")
      // gentle hover bob
      .to(wrap.current, { y: -14, duration: 1.2, yoyo: true, repeat: 2, ease: "sine.inOut" })
      // drift away
      .to(halo.current, { opacity: 0, duration: 0.6 }, "-=0.4")
      .to(wrap.current, { yPercent: -40, opacity: 0, scale: 0.7, duration: 1.2, ease: "power2.in" });

    return () => { tl.kill(); };
  }, [side, triggerKey]);

  return (
    <div
      ref={wrap}
      className="pointer-events-none absolute z-[45] will-change-transform"
      style={{
        top: "12%",
        [side === "left" ? "left" : "right"]: "6%",
        width: "min(38vw, 180px)",
      } as React.CSSProperties}
    >
      {/* Fairy-blessing lightning bolt above head */}
      <div
        ref={bolt}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "-60%",
          width: 6,
          height: "70%",
          background: "linear-gradient(to bottom, transparent, hsl(50 100% 80%), hsl(45 100% 95%), hsl(50 100% 80%), transparent)",
          filter: "drop-shadow(0 0 18px hsl(50 100% 70%)) drop-shadow(0 0 32px hsl(330 90% 75%))",
          transformOrigin: "top center",
          borderRadius: 999,
        }}
      />
      {/* Soft glow halo */}
      <div
        ref={halo}
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(50 100% 80% / 0.7), hsl(330 90% 80% / 0.35) 50%, transparent 75%)",
          filter: "blur(12px)",
          transform: "scale(1.4)",
        }}
      />
      <div className="relative aspect-square overflow-hidden rounded-full border-[3px] border-[hsl(var(--gold))] shadow-[0_0_30px_hsl(var(--gold)/0.7),0_0_60px_hsl(var(--rose)/0.5)]">
        <img
          ref={img}
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          decoding="async"
          loading="eager"
          draggable={false}
        />
      </div>
      <p
        className="mt-2 text-center font-display text-xl font-bold text-[hsl(var(--rose))] md:text-2xl"
        style={{ textShadow: "0 0 18px hsl(50 100% 80% / 0.9), 0 2px 4px hsl(330 50% 30% / 0.4)" }}
      >
        {name}
      </p>
    </div>
  );
};