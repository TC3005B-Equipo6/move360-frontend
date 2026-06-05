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
  /** Additive: render a loading skeleton instead of the figure. */
  isLoading?: boolean;
  /** Additive: message overlaid on the skeleton (e.g. "Actualizando…"). */
  loadingLabel?: string;
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
  isLoading = false,
  loadingLabel,
}: IndicatorProps) => {
  const skeletonClasses = [
    "flex flex-col justify-between w-[180px] h-[180px] p-4 rounded-md bg-surface-raised border border-subtle shadow-sm overflow-hidden",
    className,
  ].filter(Boolean).join(" ");

  if (isLoading) {
    return (
      <div className={`relative ${skeletonClasses}`} aria-busy="true" aria-label={loadingLabel ?? "Cargando indicador"}>
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded bg-surface-sunken animate-pulse" />
          <div className="h-2.5 w-1/2 rounded bg-surface-sunken animate-pulse" />
        </div>
        <div className="h-9 w-2/3 rounded bg-surface-sunken animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-surface-sunken animate-pulse" />
        {loadingLabel && (
          <span className="absolute inset-0 flex items-center justify-center p-3">
            <span className="flex max-w-full items-center gap-2 rounded-2xl bg-surface-overlay px-3 py-1.5 text-caption font-semibold text-content-secondary shadow-sm ring-1 ring-inset ring-border-subtle">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="text-center [text-wrap:balance]">{loadingLabel}</span>
            </span>
          </span>
        )}
      </div>
    );
  }

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
