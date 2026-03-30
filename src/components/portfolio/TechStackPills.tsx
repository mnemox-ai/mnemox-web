interface TechStackPillsProps {
  items: string[];
}

export function TechStackPills({ items }: TechStackPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-3 py-1 border border-border rounded-full text-[11px] font-mono text-txt-dim"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
