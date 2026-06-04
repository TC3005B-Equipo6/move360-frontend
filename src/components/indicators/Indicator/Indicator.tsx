/**
 * Edit-time semantic of an indicator: does growth read as good (`direct`) or
 * bad (`inverse`)? The render no longer consumes this — the backend already
 * folds it into `delta` (the verdict). Kept for the create/edit modal.
 */
export type IndicatorTone = "direct" | "inverse";

/** Period-over-period verdict computed by the backend: drives the color. */
export type IndicatorDelta = "positive" | "negative";

export interface IndicatorProps {
  /** The displayed figure (backend `data`): a percentage or an absolute count. */
  value: number;
  label: string;
  className?: string;
  /** Additive (optional): secondary context rendered under the label. */
  subtitle?: string;
  /**
   * Additive (optional): period-over-period verdict (backend `delta`).
   * `positive` = success color, `negative` = danger color. Drives only color,
   * never the arrow. Omit it to leave the figure in the neutral color.
   */
  delta?: IndicatorDelta;
  /**
   * Additive (optional): signed magnitude of the change (backend `deltaData`).
   * Sign drives the arrow (▲/▼); the absolute value is rendered. Omit it to
   * render without a delta row.
   */
  deltaData?: number;
  /** Additive (optional): unit suffix rendered next to the value (e.g. "M", "%", "min"). */
  unit?: string;
}

const deltaFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const valueFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatDelta = (delta: number): string => deltaFormatter.format(Math.abs(delta));
const formatValue = (value: number): string => valueFormatter.format(value);

export const Indicator = ({
  value,
  label,
  subtitle,
  className = "",
  delta,
  deltaData,
  unit,
}: IndicatorProps) => {
  const hasDelta = typeof deltaData === "number";
  const deltaSign = hasDelta ? Math.sign(deltaData) : 0;

  // The backend already resolved good/bad into `delta`; we just map it to a color.
  const verdictColor =
    delta === "positive"
      ? "text-success"
      : delta === "negative"
      ? "text-danger"
      : "text-content-muted";

  // With a movement row, the figure stays neutral and the row carries the verdict;
  // without one, the verdict colors the figure itself (neutral when there is none).
  const valueColor = hasDelta ? "text-content-primary" : delta ? verdictColor : "text-content-primary";

  const arrowGlyph = deltaSign > 0 ? "▲" : deltaSign < 0 ? "▼" : null;

  const classes = [
    "group relative flex flex-col justify-between w-[180px] h-[180px] p-4 rounded-md bg-surface-raised border border-subtle shadow-sm overflow-hidden",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="min-w-0 pr-12">
        <p className="m-0 text-caption font-semibold uppercase tracking-wide text-content-muted leading-tight [text-wrap:balance]">
          {label}
        </p>
        {subtitle && (
          <p className="m-0 mt-1 text-[11px] font-medium text-content-secondary leading-tight [text-wrap:balance]">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-baseline gap-1 min-w-0">
        <span className={`text-[36px] font-bold leading-none tabular-nums ${valueColor}`}>
          {formatValue(value)}
        </span>
        {unit && <span className="text-body-sm font-medium text-content-secondary">{unit}</span>}
      </div>
      {hasDelta ? (
        <div className={`flex items-center gap-1 text-body-sm font-semibold tabular-nums ${verdictColor}`}>
          {arrowGlyph && <span aria-hidden="true">{arrowGlyph}</span>}
          <span>{formatDelta(deltaData)}</span>
          {unit && <span>{unit}</span>}
        </div>
      ) : (
        // Reserve the row so single- and delta-bearing cards align consistently in a grid.
        <div className="h-[20px]" aria-hidden="true" />
      )}
    </div>
  );
};
