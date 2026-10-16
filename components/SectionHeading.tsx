export default function SectionHeading({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-8 flex items-baseline gap-4 border-b border-hairline pb-4">
      <span className="font-display text-xs text-dim">{index}</span>
      <div>
        <p className="font-display text-[10px] tracking-[0.25em] text-teal">
          {label}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
