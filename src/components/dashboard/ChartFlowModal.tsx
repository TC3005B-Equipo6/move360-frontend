import { type Ref, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Modal } from "../common/Modal/Modal";
import { Button } from "../common/Button/Button";
import { MonthYearPicker } from "../common/MonthYearPicker/MonthYearPicker";
import { getGraphCatalog, type CatalogSource, type CatalogTable } from "../../services/graph/graphService";
import type { ChartConfig, GraphDataRow } from "./types";
import type { ChartType, GraphOperation } from "./itemMapping";
import type { ItemType } from "./grid.config";

type ChartSize = "chartSm" | "chartMd" | "chartLg";

interface PreviewRow {
  [key: string]: string | number | undefined;
}

interface TooltipRow {
  name?: string | number;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
}

interface Props {
  onClose: () => void;
  onSave: (result: { type: ItemType; config: ChartConfig }) => void;
  /** When provided, the modal opens in edit mode prefilled from this graph. The
   * grid `type` is a chart size (`chartSm|chartMd|chartLg`). */
  chart?: { type: ItemType; config: ChartConfig };
}

const SIZE_OPTIONS: { label: string; value: ChartSize }[] = [
  { label: "Pequena", value: "chartSm" },
  { label: "Mediana", value: "chartMd" },
  { label: "Grande", value: "chartLg" },
];

const TYPE_OPTIONS: { label: string; value: ChartType }[] = [
  { label: "Barras", value: "bar" },
  { label: "Lineas", value: "line" },
  { label: "Ranking", value: "ranking" },
];

const OPERATION_OPTIONS: { label: string; value: GraphOperation }[] = [
  { label: "Suma", value: "SUM" },
  { label: "Promedio", value: "AVG" },
];

const TYPE_BY_SIZE: Record<ChartSize, ChartType[]> = {
  chartSm: ["bar"],
  chartMd: ["bar", "line", "ranking"],
  chartLg: ["line"],
};

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const STRUCTURE_PREVIEW_LABELS = ["Periodo 1", "Periodo 2", "Periodo 3", "Periodo 4", "Periodo 5"];

const compactFormatter = new Intl.NumberFormat("es-MX", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("es-MX");

const formatValue = (value: string | number | undefined) => {
  if (value === undefined) return "-";
  if (typeof value === "number") return numberFormatter.format(value);
  return value;
};

const formatCompactValue = (value: string | number) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? compactFormatter.format(numericValue) : String(value);
};

const buildStructurePreviewRows = (selectedColumns: string[]): PreviewRow[] =>
  STRUCTURE_PREVIEW_LABELS.map((label, rowIndex) => {
    const row: PreviewRow = { name: label };
    selectedColumns.forEach((column, columnIndex) => {
      row[column] = (rowIndex + 2) * (columnIndex + 3) * 100_000;
    });
    return row;
  });

const optionButtonClasses = (active: boolean) =>
  [
    "min-h-11 cursor-pointer rounded-md px-3 text-body-sm font-semibold",
    "transition-[background-color,color,box-shadow,transform] duration-200 ease-out",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]",
    active
      ? "bg-surface-raised text-primary shadow-sm ring-1 ring-inset ring-border"
      : "bg-transparent text-content-secondary hover:bg-surface-raised hover:text-content-primary",
  ].join(" ");

function OptionGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <span className="mb-2 block text-body-sm font-semibold text-content-primary">{label}</span>
      <div
        className="grid w-full gap-1 rounded-lg bg-surface-sunken p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={optionButtonClasses(value === option.value)}
            onClick={() => onChange(option.value)}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  error = false,
  fieldRef,
}: {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  error?: boolean;
  fieldRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={fieldRef} tabIndex={-1} className="min-w-0 scroll-mt-4 outline-none">
      <label htmlFor={id} className="mb-2 block text-body-sm font-semibold text-content-primary">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full cursor-pointer rounded-md border bg-surface-raised px-3 text-body-sm text-content-primary outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          error
            ? "border-danger focus-visible:border-danger focus-visible:outline-danger"
            : "border-default focus-visible:border-primary focus-visible:outline-primary"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-caption font-medium text-danger">Campo requerido</span>}
    </div>
  );
}

function MonthField({
  id,
  label,
  value,
  onChange,
  error = false,
  errorText = "Campo requerido",
  fieldRef,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorText?: string;
  fieldRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={fieldRef} tabIndex={-1} className="min-w-0 scroll-mt-4 outline-none">
      <label htmlFor={id} className="mb-2 block text-body-sm font-semibold text-content-primary">
        {label}
      </label>
      <div className={error ? "rounded-md ring-1 ring-danger" : undefined}>
        <MonthYearPicker id={id} value={value} onChange={onChange} size="sm" />
      </div>
      {error && <span className="mt-1 block text-caption font-medium text-danger">{errorText}</span>}
    </div>
  );
}

function StructureTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[150px] rounded-md border border-subtle bg-surface-overlay px-3 py-2 text-body-sm shadow-md">
      <p className="mb-1 font-semibold text-content-primary">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((row, index) => (
          <div key={`${row.dataKey ?? index}`} className="flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2 text-content-secondary">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="truncate">{row.name}</span>
            </span>
            <span className="font-semibold tabular-nums text-content-primary">{formatValue(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewChart({
  chartType,
  chartDataRows,
  selectedColumns,
}: {
  chartType: ChartType;
  chartDataRows: PreviewRow[];
  selectedColumns: string[];
}) {
  if (!selectedColumns.length || !chartDataRows.length) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center rounded-md bg-surface-sunken text-body-sm font-semibold text-content-secondary">
        Sin metricas seleccionadas
      </div>
    );
  }

  if (chartType === "ranking") {
    const valueColumn = selectedColumns[0];
    const rankingRows = [...chartDataRows]
      .map((row) => ({
        name: String(row.name ?? "-"),
        value: Number(row[valueColumn]) || 0,
      }))
      .sort((a, b) => b.value - a.value);
    const maxValue = Math.max(...rankingRows.map((row) => row.value), 0);

    return (
      <ol className="m-0 flex h-full min-h-[220px] flex-col justify-center gap-3 p-0">
        {rankingRows.map((row, index) => (
          <li
            key={`${row.name}-${index}`}
            className="grid min-h-11 grid-cols-[28px_minmax(84px,140px)_minmax(80px,1fr)_76px] items-center gap-3"
          >
            <span className="text-body-sm font-semibold tabular-nums text-content-muted">{index + 1}</span>
            <span className="truncate text-body-sm font-semibold text-content-primary">{row.name}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-surface-sunken">
              <span
                className="block h-full rounded-full bg-[var(--chart-1)]"
                style={{ width: maxValue ? `${Math.max((row.value / maxValue) * 100, 3)}%` : "0%" }}
              />
            </span>
            <span className="text-right text-body-sm font-semibold tabular-nums text-content-secondary">
              {formatCompactValue(row.value)}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartDataRows} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "var(--chart-axis)", fontSize: 12 }} tickLine={false} />
          <YAxis
            tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
            tickFormatter={formatCompactValue}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<StructureTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
          {selectedColumns.map((column, index) => (
            <Line
              key={column}
              dataKey={column}
              name={column}
              stroke={colors[index % colors.length]}
              strokeWidth={2.25}
              dot={{ r: 3, fill: colors[index % colors.length], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              type="linear"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartDataRows} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--chart-axis)", fontSize: 12 }} tickLine={false} />
        <YAxis
          tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
          tickFormatter={formatCompactValue}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<StructureTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
        {selectedColumns.map((column, index) => (
          <Bar
            key={column}
            dataKey={column}
            name={column}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export const ChartFlowModal = ({ onClose, onSave, chart }: Props) => {
  const isEditMode = !!chart;
  const initial = chart?.config.config;

  const [sources, setSources] = useState<CatalogSource[]>([]);
  const [catalogError, setCatalogError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState(chart?.config.title ?? "");
  const [subtitle, setSubtitle] = useState(chart?.config.subtitle ?? "");
  const [size, setSize] = useState<ChartSize>(chart ? (chart.type as ChartSize) : "chartMd");
  const [chartType, setChartType] = useState<ChartType>(initial?.chartType ?? "bar");
  const [operation, setOperation] = useState<GraphOperation>(initial?.operation ?? "SUM");
  const [sourceId, setSourceId] = useState<number | null>(initial?.sourceId ?? null);
  const [tableId, setTableId] = useState<number | null>(initial?.tableId ?? null);
  const [dimensionColumn, setDimensionColumn] = useState(initial?.dimensionColumn ?? "");
  const [metricColumns, setMetricColumns] = useState<string[]>(initial?.metricColumns ?? []);
  const [compareEnabled, setCompareEnabled] = useState(initial?.compareEnabled ?? false);
  const [compareTableId, setCompareTableId] = useState<number | null>(initial?.compareTableId ?? null);
  const [startMonth, setStartMonth] = useState(initial?.startMonth ?? "");
  const [endMonth, setEndMonth] = useState(initial?.endMonth ?? "");

  useEffect(() => {
    let active = true;
    getGraphCatalog()
      .then((catalog) => {
        if (!active) return;
        setSources(catalog.sources);
        // Edit mode keeps the graph's saved selection; only seed defaults on create.
        if (isEditMode) return;
        const firstSource = catalog.sources[0];
        const firstTable = firstSource?.tables[0];
        setSourceId(firstSource?.sourceId ?? null);
        setTableId(firstTable?.tableId ?? null);
        setDimensionColumn(firstTable?.defaultDimension ?? "");
      })
      .catch(() => {
        if (active) setCatalogError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isEditMode]);

  const currentSource = useMemo(
    () => sources.find((s) => s.sourceId === sourceId) ?? sources[0],
    [sources, sourceId],
  );
  const currentTable: CatalogTable | undefined = useMemo(
    () => currentSource?.tables.find((t) => t.tableId === tableId) ?? currentSource?.tables[0],
    [currentSource, tableId],
  );

  const allowedTypes = TYPE_BY_SIZE[size];
  const effectiveType = allowedTypes.includes(chartType) ? chartType : allowedTypes[0];
  const previewRows = buildStructurePreviewRows(metricColumns);
  const compatibleTables = (currentSource?.tables ?? []).filter((t) => t.tableId !== currentTable?.tableId);

  const rankingMetricOk = effectiveType !== "ranking" || metricColumns.length === 1;
  const canSave = Boolean(
    title.trim() &&
      currentSource &&
      currentTable &&
      dimensionColumn &&
      metricColumns.length &&
      rankingMetricOk &&
      startMonth &&
      endMonth &&
      endMonth >= startMonth,
  );

  // Set on a failed Save attempt; drives the red highlight on missing fields.
  // Flags read live state, so each clears as soon as its field is satisfied.
  const [showErrors, setShowErrors] = useState(false);
  const titleError = showErrors && !title.trim();
  const dimensionError = showErrors && !dimensionColumn;
  const metricsError = showErrors && (!metricColumns.length || !rankingMetricOk);
  const startError = showErrors && !startMonth;
  const endError = showErrors && (!endMonth || (Boolean(startMonth) && endMonth < startMonth));
  const endErrorText = endMonth && startMonth && endMonth < startMonth ? "Debe ser posterior al inicio" : "Campo requerido";

  // Refs to required fields, top-to-bottom, so a failed Save scrolls to the
  // first missing one.
  const titleRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const dimensionRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const scrollToFirstMissing = () => {
    const target: HTMLElement | null =
      !title.trim() ? titleRef.current
      : !startMonth ? startRef.current
      : !endMonth || endMonth < startMonth ? endRef.current
      : !dimensionColumn ? dimensionRef.current
      : !metricColumns.length || !rankingMetricOk ? metricsRef.current
      : null;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.focus?.({ preventScroll: true });
  };

  const handleSizeChange = (nextSize: ChartSize) => {
    setSize(nextSize);
    const nextAllowedTypes = TYPE_BY_SIZE[nextSize];
    if (!nextAllowedTypes.includes(chartType)) setChartType(nextAllowedTypes[0]);
  };

  const handleSourceChange = (nextSourceId: string) => {
    const nextSource = sources.find((s) => s.sourceId === Number(nextSourceId));
    const nextTable = nextSource?.tables[0];
    setSourceId(nextSource?.sourceId ?? null);
    setTableId(nextTable?.tableId ?? null);
    setDimensionColumn(nextTable?.defaultDimension ?? "");
    setMetricColumns([]);
    setCompareTableId(null);
  };

  const handleTableChange = (nextTableId: string) => {
    const nextTable = currentSource?.tables.find((t) => t.tableId === Number(nextTableId));
    setTableId(nextTable?.tableId ?? null);
    setDimensionColumn(nextTable?.defaultDimension ?? "");
    setMetricColumns([]);
    setCompareTableId(null);
  };

  const toggleMetric = (column: string) => {
    setMetricColumns((prev) => {
      // RANKING accepts exactly one metric: selecting replaces the previous one.
      if (effectiveType === "ranking") return prev.includes(column) ? [] : [column];
      return prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column];
    });
  };

  const handleSave = () => {
    if (!canSave || !currentSource || !currentTable) {
      setShowErrors(true);
      scrollToFirstMissing();
      return;
    }

    const series = metricColumns.map((column, index) => ({
      key: column,
      label: column,
      color: colors[index % colors.length],
    }));

    const config: ChartConfig = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      config: {
        chartType: effectiveType,
        sourceId: currentSource.sourceId,
        tableId: currentTable.tableId,
        dimensionColumn,
        metricColumns,
        operation,
        compareEnabled,
        compareTableId: compareEnabled ? compareTableId : null,
        startMonth,
        endMonth,
        sourceName: currentSource.name,
        tableName: currentTable.displayName,
      },
      // Structural placeholder until the backend POST returns real data/series.
      data: previewRows as GraphDataRow[],
      series,
    };

    onSave({ type: size, config });
  };

  return (
    <Modal title={isEditMode ? "Editar grafica" : "Nueva grafica"} onClose={onClose} className="w-[92vw] max-w-[1180px] max-h-[84vh]">
      {isLoading ? (
        <p className="m-0 py-6 text-center text-body-sm font-medium text-content-muted">Cargando catalogo…</p>
      ) : catalogError ? (
        <p className="m-0 py-6 text-center text-body-sm font-medium text-content-secondary">
          No se pudo cargar el catalogo de graficas.
        </p>
      ) : (
        <div className="flex min-h-0 flex-col gap-4">
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="chart-title" className="mb-2 block text-body-sm font-semibold text-content-primary">
                    Titulo
                  </label>
                  <input
                    ref={titleRef}
                    id="chart-title"
                    type="text"
                    maxLength={40}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Nombre de la grafica"
                    className={`h-11 w-full rounded-md border bg-surface-raised px-3 text-body-sm text-content-primary outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      titleError
                        ? "border-danger focus-visible:border-danger focus-visible:outline-danger"
                        : "border-default focus-visible:border-primary focus-visible:outline-primary"
                    }`}
                  />
                  {titleError && <span className="mt-1 block text-caption font-medium text-danger">Campo requerido</span>}
                </div>
                <div className="min-w-0">
                  <label htmlFor="chart-subtitle" className="mb-2 block text-body-sm font-semibold text-content-primary">
                    Subtitulo
                  </label>
                  <input
                    id="chart-subtitle"
                    type="text"
                    maxLength={60}
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                    placeholder="Contexto (opcional)"
                    className="h-11 w-full rounded-md border border-default bg-surface-raised px-3 text-body-sm text-content-primary outline-none transition-colors focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  />
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <OptionGroup label="Tamano" value={size} options={SIZE_OPTIONS} onChange={handleSizeChange} />
                <OptionGroup
                  key={size}
                  label="Tipo"
                  value={effectiveType}
                  options={TYPE_OPTIONS.filter((option) => allowedTypes.includes(option.value))}
                  onChange={setChartType}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <MonthField id="chart-start" label="Inicio" value={startMonth} onChange={setStartMonth} error={startError} fieldRef={startRef} />
                <MonthField id="chart-end" label="Fin" value={endMonth} onChange={setEndMonth} error={endError} errorText={endErrorText} fieldRef={endRef} />
                <OptionGroup label="Operacion" value={operation} options={OPERATION_OPTIONS} onChange={setOperation} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  id="chart-source"
                  label="Fuente"
                  value={String(currentSource?.sourceId ?? "")}
                  onChange={handleSourceChange}
                  options={sources.map((s) => ({ label: s.name, value: String(s.sourceId) }))}
                />
                <SelectField
                  id="chart-table"
                  label="Tabla"
                  value={String(currentTable?.tableId ?? "")}
                  onChange={handleTableChange}
                  options={(currentSource?.tables ?? []).map((t) => ({
                    label: t.displayName,
                    value: String(t.tableId),
                  }))}
                />
              </div>

              <SelectField
                id="chart-dimension"
                label="Dimension"
                value={dimensionColumn}
                onChange={setDimensionColumn}
                error={dimensionError}
                fieldRef={dimensionRef}
                options={(currentTable?.dimensions ?? []).map((d) => ({
                  label: d.displayName,
                  value: d.columnName,
                }))}
              />

              <section ref={metricsRef} tabIndex={-1} className={`scroll-mt-4 rounded-lg border bg-surface-sunken p-4 outline-none ${metricsError ? "border-danger" : "border-default"}`}>
                <h4 className="mb-3 text-body-sm font-semibold text-content-primary">
                  Metricas{effectiveType === "ranking" ? " (una)" : ""}
                </h4>
                {metricsError && (
                  <p className="mb-3 mt-0 text-caption font-medium text-danger">
                    {effectiveType === "ranking" && metricColumns.length > 1
                      ? "Ranking acepta una sola metrica."
                      : "Selecciona al menos una metrica."}
                  </p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  {(currentTable?.metrics ?? []).map((metric) => (
                    <label
                      key={metric.columnName}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-subtle bg-surface-raised px-3 text-body-sm text-content-secondary transition-colors hover:text-content-primary"
                    >
                      <input
                        type="checkbox"
                        checked={metricColumns.includes(metric.columnName)}
                        onChange={() => toggleMetric(metric.columnName)}
                        className="h-4 w-4 cursor-pointer accent-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      />
                      <span className="min-w-0 truncate">{metric.displayName}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-default bg-surface-raised p-4">
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body-sm font-semibold text-content-primary">
                  <input
                    type="checkbox"
                    checked={compareEnabled}
                    onChange={(event) => setCompareEnabled(event.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  />
                  Comparar con otra tabla
                </label>
                {compareEnabled && (
                  <div className="mt-3">
                    <SelectField
                      id="chart-compare"
                      label="Tabla de comparacion"
                      value={String(compareTableId ?? "")}
                      onChange={(v) => setCompareTableId(v ? Number(v) : null)}
                      options={[
                        { label: "Sin seleccion", value: "" },
                        ...compatibleTables.map((t) => ({ label: t.displayName, value: String(t.tableId) })),
                      ]}
                    />
                  </div>
                )}
              </section>
            </div>

            <section className="flex min-h-0 min-w-0 flex-col gap-4 rounded-lg border border-default bg-surface-raised p-4">
              <div>
                <h4 className="text-body font-semibold text-content-primary">Vista previa de estructura</h4>
                <p className="text-body-sm text-content-secondary">
                  {currentTable?.displayName ?? "Sin tabla"} - datos ilustrativos, sin consulta real
                </p>
              </div>

              <div className="h-64 min-h-0 rounded-md border border-subtle bg-surface-overlay p-3 sm:h-72">
                <PreviewChart chartType={effectiveType} chartDataRows={previewRows} selectedColumns={metricColumns} />
              </div>
            </section>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-subtle pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-body-sm font-medium text-danger">
              {showErrors && !canSave ? "Completa los campos marcados en rojo." : ""}
            </span>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Button label="Cancelar" variant="white" size="large" onPress={onClose} />
              <Button label={isEditMode ? "Guardar cambios" : "Crear grafica"} size="large" onPress={handleSave} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
