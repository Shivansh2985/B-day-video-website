import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface Props {
  label: string;
  src: string | null;
  onChange: (src: string) => void;
  side: "left" | "right";
}

export const PhotoUpload = ({ label, src, onChange, side }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(f);
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute top-[10%] ${side === "left" ? "left-[5%]" : "right-[5%]"} w-[180px] md:w-[220px] z-10`}
    >
      <button
        onClick={() => ref.current?.click()}
        className="group relative w-full aspect-square rounded-full overflow-hidden border-4 border-[hsl(var(--gold))] shadow-glow-gold"
        style={{
          maskImage: "radial-gradient(circle, black 55%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 95%)",
        }}
      >
        {src ? (
          <img src={src} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[hsl(var(--twilight-soft))] text-[hsl(var(--cream))]">
            <Upload className="mb-2 h-6 w-6 opacity-80" />
            <span className="font-mono-tag text-[10px] uppercase tracking-widest opacity-80">Add {label}</span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-[hsl(var(--gold))]/40 transition group-hover:ring-2" />
      </button>
      <p className="mt-3 text-center font-display text-2xl text-[hsl(var(--gold))] text-glow-gold">
        {label}
      </p>
      <input ref={ref} type="file" accept="image/*" hidden onChange={handle} />
    </motion.div>
  );
};
