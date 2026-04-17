import { Heart } from "lucide-react";
import { useMemo } from "react";

interface HeartCfg {
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
}

const COLORS = [
  "text-primary",
  "text-offer",
  "text-request",
  "text-cat-moral",
  "text-cat-consult",
];

export function FloatingHearts({ count = 18 }: { count?: number }) {
  const hearts = useMemo<HeartCfg[]>(() => {
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      size: 12 + Math.random() * 28,
      delay: Math.random() * 12,
      duration: 14 + Math.random() * 16,
      opacity: 0.25 + Math.random() * 0.45,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {hearts.map((h, i) => (
        <span
          key={i}
          className={`absolute bottom-[-40px] ${h.color} animate-float-up`}
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            ["--heart-opacity" as string]: h.opacity,
          }}
        >
          <Heart
            style={{ width: h.size, height: h.size }}
            fill="currentColor"
            strokeWidth={0}
          />
        </span>
      ))}
    </div>
  );
}
