type LogoSize = "sm" | "md" | "lg";

const sizes: Record<LogoSize, { box: string; img: string }> = {
  sm: { box: "w-9 h-9 rounded-xl", img: "w-9 h-9" },
  md: { box: "w-12 h-12 rounded-2xl", img: "w-12 h-12" },
  lg: { box: "w-16 h-16 rounded-2xl", img: "w-16 h-16" },
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
  showRing?: boolean;
}

export function Logo({ size = "md", className = "", showRing = false }: LogoProps) {
  const s = sizes[size];
  return (
    <div
      className={`${s.box} shrink-0 overflow-hidden ${showRing ? "ring-2 ring-accent-gold/40 ring-offset-2 ring-offset-brand-800" : ""} ${className}`}
    >
      <img
        src="/logo.svg"
        alt="لوگوی فرمنوتی"
        className={`${s.img} object-cover`}
        width={64}
        height={64}
      />
    </div>
  );
}
