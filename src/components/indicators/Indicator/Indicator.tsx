export type IndicatorTone = "direct" | "inverse";


export interface IndicatorProps {
  value: number;
  tone: IndicatorTone;
  label: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isMenuOpen: boolean;
  className?: string;
  /**
   * Additive (optional): period-over-period movement.
   * Sign drives the arrow direction; `tone` ⊕ sign drives the color
   * (good = success, bad = danger). Omit it to render without a delta row.
   */
  delta?: number;
  /** Additive (optional): unit suffix rendered next to the value (e.g. "M", "%", "min"). */
  unit?: string;
}

const deltaFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const formatDelta = (delta: number): string => deltaFormatter.format(Math.abs(delta));

export const Indicator = ({
  value,
  tone,
  label,
  className = "",
  delta,
  unit,
}: IndicatorProps) => {
  const hasDelta = typeof delta === "number";
  const deltaSign = hasDelta ? Math.sign(delta) : 0;

  // tone ⊕ sign: direct+up = good, direct+down = bad, inverse flipped.
  const isGood =
    hasDelta && deltaSign !== 0 && ((tone === "direct" && deltaSign > 0) || (tone === "inverse" && deltaSign < 0));
  const isBad = hasDelta && deltaSign !== 0 && !isGood;

  const deltaColor = isGood
    ? "text-success"
    : isBad
    ? "text-danger"
    : "text-content-muted";

  // No delta: the big number itself carries the tone color.
  const valueColor = hasDelta
    ? "text-content-primary"
    : tone === "direct"
    ? "text-success"
    : "text-danger";

  const arrowGlyph = deltaSign > 0 ? "▲" : deltaSign < 0 ? "▼" : null;

  const classes = [
    "group relative flex flex-col justify-between w-[180px] h-[180px] p-4 rounded-md bg-surface-raised border border-subtle shadow-sm overflow-hidden",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <p className="m-0 text-caption font-semibold uppercase tracking-wide text-content-muted leading-tight [text-wrap:balance]">
        {label}
      </p>
      <div className="flex items-baseline gap-1 min-w-0">
        <span className={`text-[36px] font-bold leading-none tabular-nums ${valueColor}`}>{value}</span>
        {unit && <span className="text-body-sm font-medium text-content-secondary">{unit}</span>}
      </div>
      {hasDelta ? (
        <div className={`flex items-center gap-1 text-body-sm font-semibold tabular-nums ${deltaColor}`}>
          {arrowGlyph && <span aria-hidden="true">{arrowGlyph}</span>}
          <span>{formatDelta(delta)}</span>
        </div>
      ) : (
        // Reserve the row so single- and delta-bearing cards align consistently in a grid.
        <div className="h-[20px]" aria-hidden="true" />
      )}
    </div>
  );
};
