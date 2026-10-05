/**
 * The 5x5 dot-matrix "M" from tradememory-protocol/assets/generate_header.html.
 * `active` pulses the dots (the page's working indicator); prefers-reduced-motion
 * turns that off in CSS.
 */
const ON = new Set([0, 4, 5, 7, 9, 10, 12, 14, 15, 19, 20, 24]);
const MID = new Set([6, 8, 11, 13]);

export function DotMark({
  size = 10,
  gap = 4,
  active = false,
  label,
  className = '',
}: {
  size?: number;
  gap?: number;
  active?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`tm-mark ${active ? 'tm-mark-active' : ''} ${className}`}
      style={{ gridTemplateColumns: `repeat(5, ${size}px)`, gap }}
    >
      {Array.from({ length: 25 }, (_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const opacity = ON.has(i) ? 1 : MID.has(i) ? 0.6 : 0.15;
        return (
          <span
            key={i}
            aria-hidden
            className="tm-dot"
            style={{ width: size, height: size, opacity, animationDelay: `${(row + col) * 90}ms` }}
          />
        );
      })}
    </span>
  );
}
