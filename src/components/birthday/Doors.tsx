import { motion } from "framer-motion";
import doors from "@/assets/magic-doors.png";

export const Doors = ({ open }: { open: boolean }) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ perspective: 1600 }}
    >
      <div className="relative h-[88vh] aspect-[1/1] max-w-[700px]">
        {/* Left half */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: open ? -115 : 0 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={doors}
            alt=""
            className="h-full w-[200%] max-w-none object-contain"
            style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))" }}
          />
        </motion.div>
        {/* Right half */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
          style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: open ? 115 : 0 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={doors}
            alt=""
            className="h-full w-[200%] max-w-none object-contain -translate-x-1/2"
            style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))" }}
          />
        </motion.div>
        {/* Glow behind doors when opening */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(42 100% 70% / 0.7), transparent 60%)" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: open ? 1 : 0.3, scale: open ? 1.4 : 0.8 }}
          transition={{ duration: 2 }}
        />
      </div>
    </div>
  );
};
