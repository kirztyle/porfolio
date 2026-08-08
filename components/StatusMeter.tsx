type Status = "open" | "limited" | "closed";

const CONFIG: Record<
  Status,
  { label: string; activeIndex: number; color: string; note: string }
> = {
  open: {
    label: "OPEN TO WORK",
    activeIndex: 3,
    color: "var(--accent-green)",
    note: "Available for new roles & collaborations",
  },
  limited: {
    label: "LIMITED AVAILABILITY",
    activeIndex: 1,
    color: "var(--accent-amber)",
    note: "Selectively open to new opportunities",
  },
  closed: {
    label: "NOT AVAILABLE",
    activeIndex: 0,
    color: "var(--accent-red)",
    note: "Currently not looking for new roles",
  },
};

const TIERS = ["CRITICAL", "WARNING", "MEDIUM", "LOW"];
const TIER_COLORS = [
  "var(--accent-red)",
  "var(--accent-amber)",
  "#5b8fd6",
  "var(--accent-green)",
];

export default function StatusMeter({ status }: { status: Status }) {
  const cfg = CONFIG[status] ?? CONFIG.open;

  return (
    <div className="inline-flex flex-col gap-2.5 rounded-sm border border-hairline bg-panel2/60 px-4 py-3">
      <div className="flex items-center justify-between gap-6">
        <span className="font-display text-[10px] tracking-[0.2em] text-dim">
          AVAILABILITY_STATUS
        </span>
        <span
          className="font-display text-[10px] tracking-[0.15em]"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex gap-1">
        {TIERS.map((tier, i) => {
          const active = i === cfg.activeIndex;
          return (
            <div key={tier} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-opacity"
                style={{
                  background: TIER_COLORS[i],
                  opacity: active ? 1 : 0.18,
                }}
              />
            </div>
          );
        })}
      </div>

      <p className="font-body text-xs text-muted">{cfg.note}</p>
    </div>
  );
}
