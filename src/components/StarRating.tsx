import { Star } from "lucide-react";

export function StarRating({
  value,
  max = 5,
  size = "md",
}: {
  value: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const iconClass = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5" aria-label={`امتیاز ${value} از ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          <Star
            key={i}
            className={`${iconClass} ${
              filled || half ? "text-amber-400 fill-amber-400" : "text-white/30"
            }`}
          />
        );
      })}
    </div>
  );
}
