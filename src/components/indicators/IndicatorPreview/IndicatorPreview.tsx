import type { Relationship } from "../Indicator/Indicator";

export interface IndicatorPreviewProps {
  title: string;
  subtitle?: string;
  relationship?: Relationship;
  unit?: string;
}

// Mirrors the real Indicator card so the modal shows the true anatomy of the
// widget being configured. The backend fills `data`/`deltaData` only after the
// query runs, so at create/edit time the figure is a placeholder "X". The
// sample delta row assumes an upward movement to surface the relationship color
// (DIRECT = success, INVERSE = danger).
export const IndicatorPreview = ({ title, subtitle, relationship, unit }: IndicatorPreviewProps) => {
  const sampleDeltaColor =
    relationship === "DIRECT"
      ? "text-success"
      : relationship === "INVERSE"
      ? "text-danger"
      : "text-content-muted";

  return (
    <div className="group relative flex flex-col justify-between w-[180px] h-[180px] p-4 rounded-md bg-surface-raised border border-subtle shadow-sm overflow-hidden">
      <div className="min-w-0 pr-12">
        <p className="m-0 text-caption font-semibold uppercase tracking-wide text-content-muted leading-tight [text-wrap:balance]">
          {title || "Título"}
        </p>
        <p className="m-0 mt-1 text-[11px] font-medium text-content-secondary leading-tight [text-wrap:balance]">
          {subtitle || "Subtítulo"}
        </p>
      </div>
      <div className="flex items-baseline gap-1 min-w-0">
        <span className="text-[36px] font-bold leading-none tabular-nums text-content-primary">X</span>
        {unit && <span className="text-body-sm font-medium text-content-secondary">{unit}</span>}
      </div>
      <div className={`flex items-center gap-1 text-body-sm font-semibold tabular-nums ${sampleDeltaColor}`}>
        <span aria-hidden="true">▲</span>
        <span>X</span>
        {unit && <span>{unit}</span>}
      </div>
    </div>
  );
};
