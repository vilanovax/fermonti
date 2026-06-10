interface SparklineProps {
  data: number[];
  positive?: boolean;
  className?: string;
}

export function Sparkline({ data, positive = true, className = "" }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const pad = 2;

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const stroke = positive ? "#22c55e" : "#ef4444";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`w-16 h-6 ${className}`}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
