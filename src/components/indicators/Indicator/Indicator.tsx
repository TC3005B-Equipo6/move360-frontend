/**
 * Indicator's relation (backend `relationship`): does growth read as good
 * (`DIRECT`) or bad (`INVERSE`)? Combined with the sign of `deltaData` it
 * resolves the delta color — e.g. `INVERSE` + positive movement = danger.
 */
export type Relationship = "DIRECT" | "INVERSE";

export interface IndicatorProps {
  /** The displayed figure (backend `data`): a percentage or an absolute count. */
  data: number;
  /** The label shown above the figure (backend `title`). */
  title: string;
  className?: string;
  /** Additive (optional): secondary context rendered under the title. */
  subtitle?: string;
  /** Additive (optional): relation that, with the movement sign, drives the color. */
  relationship?: Relationship;
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
  data,
  title,
  subtitle,
  className = "",
  relationship,
  deltaData,
  unit,
}: IndicatorProps) => {
  const hasDelta = typeof deltaData === "number";
  const deltaSign = hasDelta ? Math.sign(deltaData) : 0;

  // relation ⊕ sign: DIRECT+up = good, DIRECT+down = bad, INVERSE flipped.
  const isGood =
    hasDelta &&
    deltaSign !== 0 &&
    ((relationship === "DIRECT" && deltaSign > 0) || (relationship === "INVERSE" && deltaSign < 0));
  const isBad = hasDelta && deltaSign !== 0 && !isGood;

  const deltaColor = isGood ? "text-success" : isBad ? "text-danger" : "text-content-muted";

  // No delta: the figure itself carries the relation color (neutral if no relation).
  const valueColor = hasDelta
    ? "text-content-primary"
    : relationship === "DIRECT"
    ? "text-success"
    : relationship === "INVERSE"
    ? "text-danger"
    : "text-content-primary";

  const arrowGlyph = deltaSign > 0 ? "▲" : deltaSign < 0 ? "▼" : null;

  const classes = [
    "group relative flex flex-col justify-between w-[180px] h-[180px] p-4 rounded-md bg-surface-raised border border-subtle shadow-sm overflow-hidden",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="min-w-0 pr-12">
        <p className="m-0 text-caption font-semibold uppercase tracking-wide text-content-muted leading-tight [text-wrap:balance]">
          {title}
        </p>
        {subtitle && (
          <p className="m-0 mt-1 text-[11px] font-medium text-content-secondary leading-tight [text-wrap:balance]">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-baseline gap-1 min-w-0">
        <span className={`text-[36px] font-bold leading-none tabular-nums ${valueColor}`}>
          {formatValue(data)}
        </span>
        {unit && <span className="text-body-sm font-medium text-content-secondary">{unit}</span>}
      </div>
      {hasDelta ? (
        <div className={`flex items-center gap-1 text-body-sm font-semibold tabular-nums ${deltaColor}`}>
          {arrowGlyph && <span aria-hidden="true">{arrowGlyph}</span>}
          <span>{formatDelta(deltaData)}</span>
        </div>
      ) : (
        // Reserve the row so single- and delta-bearing cards align consistently in a grid.
        <div className="h-[20px]" aria-hidden="true" />
      )}
    </div>
  );
};
