import { useState } from "react";
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
import chartData from "./ChartDatasets.json";
import type { ChartConfig } from "./types";
import type { ItemType } from "./grid.config";

type ChartSize = "chartSm" | "chartMd" | "chartLg";
type ChartType = "bar" | "line" | "ranking";

interface PreviewRow {
  [key: string]: string | number | undefined;
}

interface Dataset {
  id: string;
  label: string;
  columns: string[];
  preview: PreviewRow[];
}

interface Source {
  name: string;
  datasets: Dataset[];
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
}

const sources = chartData.sources as Source[];

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

const getLabelColumn = (dataset?: Dataset, chartType: ChartType = "bar") => {
  if (!dataset) return "";
  const firstRow = dataset.preview[0] ?? {};
  const stringColumns = dataset.columns.filter((column) => typeof firstRow[column] === "string");

  if (chartType === "ranking") {
    return stringColumns[1] ?? stringColumns[0] ?? dataset.columns[0] ?? "";
  }

  return stringColumns[0] ?? dataset.columns[0] ?? "";
};

const buildStructurePreviewRows = (selectedColumns: string[], labelColumn: string): PreviewRow[] =>
  STRUCTURE_PREVIEW_LABELS.map((label, rowIndex) => {
    const row: PreviewRow = {
      name: label,
      [labelColumn]: label,
    };

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
}: {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-body-sm font-semibold text-content-primary">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full cursor-pointer rounded-md border border-default bg-surface-raised px-3 text-body-sm text-content-primary outline-none transition-colors focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MonthField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-body-sm font-semibold text-content-primary">
        {label}
      </label>
      <input
        id={id}
        type="month"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-default bg-surface-raised px-3 text-body-sm text-content-primary outline-none transition-colors focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
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
        Sin columnas seleccionadas
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

export const ChartFlowModal = ({ onClose, onSave }: Props) => {
  const defaultSource = sources[0];
  const defaultDataset = defaultSource?.datasets[0];

  const [size, setSize] = useState<ChartSize>("chartMd");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [source, setSource] = useState(defaultSource?.name ?? "");
  const [datasetId, setDatasetId] = useState(defaultDataset?.id ?? "");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareTable, setCompareTable] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const currentSource = sources.find((item) => item.name === source) ?? defaultSource;
  const currentDataset = currentSource?.datasets.find((dataset) => dataset.id === datasetId) ?? currentSource?.datasets[0];
  const currentDatasetId = currentDataset?.id ?? "";
  const allowedTypes = TYPE_BY_SIZE[size];
  const effectiveType = allowedTypes.includes(chartType) ? chartType : allowedTypes[0];
  const labelColumn = getLabelColumn(currentDataset, effectiveType);
  const chartDataRows = buildStructurePreviewRows(selectedColumns, labelColumn || "Categoria");
  const compatibleTables = (currentSource?.datasets ?? []).filter((dataset) => {
    if (dataset.id === currentDatasetId) return false;
    return selectedColumns.some((column) => dataset.columns.includes(column));
  });

  const canSave = Boolean(currentDataset && selectedColumns.length);

  const handleSizeChange = (nextSize: ChartSize) => {
    setSize(nextSize);
    const nextAllowedTypes = TYPE_BY_SIZE[nextSize];
    if (!nextAllowedTypes.includes(chartType)) setChartType(nextAllowedTypes[0]);
  };

  const handleSourceChange = (nextSourceName: string) => {
    const nextSource = sources.find((item) => item.name === nextSourceName);
    const nextDataset = nextSource?.datasets[0];

    setSource(nextSourceName);
    setDatasetId(nextDataset?.id ?? "");
    setSelectedColumns([]);
    setCompareTable("");
  };

  const handleDatasetChange = (nextDatasetId: string) => {
    setDatasetId(nextDatasetId);
    setSelectedColumns([]);
    setCompareTable("");
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((item) => item !== column) : [...prev, column],
    );
  };

  const handleSave = () => {
    if (!canSave) return;

    const preview = currentDataset?.preview ?? [];
    const formattedData = preview.map((row) => {
      const rowData = row as Record<string, string | number | undefined>;

      if (effectiveType === "ranking") {
        const valueColumn = selectedColumns[0];

        return {
          name: rowData["Linea"] || rowData["LÃ­nea"] || rowData["Mes"] || rowData["AÃ±o"],
          value: valueColumn ? rowData[valueColumn] : undefined,
        };
      }

      const result: Record<string, string | number | undefined> = {
        name: rowData["Mes"] || rowData["AÃ±o"],
      };

      selectedColumns.forEach((column) => {
        result[column] = rowData[column];
      });

      return result;
    });

    const series = selectedColumns.map((column, index) => ({
      key: column,
      label: column,
      color: colors[index % colors.length],
    }));

    const config: ChartConfig = {
      config: {
        chartType: effectiveType,
        source,
        datasetId: currentDatasetId,
        columns: selectedColumns,
        compareEnabled,
        compareTable,
        startDate,
        endDate,
      },
      data: formattedData,
      series,
    };

    onSave({ type: size, config });
  };

  return (
    <Modal title="Nueva grafica" onClose={onClose} className="w-[92vw] max-w-[1180px] max-h-[84vh]">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-4">
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
              <MonthField id="chart-start" label="Inicio" value={startDate} onChange={setStartDate} />
              <MonthField id="chart-end" label="Fin" value={endDate} onChange={setEndDate} />
              <SelectField
                id="chart-source"
                label="Fuente"
                value={source}
                onChange={handleSourceChange}
                options={sources.map((item) => ({ label: item.name, value: item.name }))}
              />
            </div>

            <SelectField
              id="chart-table"
              label="Tabla"
              value={currentDatasetId}
              onChange={handleDatasetChange}
              options={(currentSource?.datasets ?? []).map((dataset) => ({
                label: dataset.label,
                value: dataset.id,
              }))}
            />

            <section className="rounded-lg border border-default bg-surface-sunken p-4">
              <h4 className="mb-3 text-body-sm font-semibold text-content-primary">Columnas</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {(currentDataset?.columns ?? []).map((column) => (
                  <label
                    key={column}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-subtle bg-surface-raised px-3 text-body-sm text-content-secondary transition-colors hover:text-content-primary"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={() => toggleColumn(column)}
                      className="h-4 w-4 cursor-pointer accent-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    />
                    <span className="min-w-0 truncate">{column}</span>
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
                    value={compareTable}
                    onChange={setCompareTable}
                    options={[
                      { label: "Sin seleccion", value: "" },
                      ...compatibleTables.map((dataset) => ({ label: dataset.label, value: dataset.id })),
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
                {currentDataset?.label ?? "Sin tabla"} - datos ilustrativos, sin consulta real
              </p>
            </div>

            <div className="h-64 min-h-0 rounded-md border border-subtle bg-surface-overlay p-3 sm:h-72">
              <PreviewChart chartType={effectiveType} chartDataRows={chartDataRows} selectedColumns={selectedColumns} />
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-subtle pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Button label="Cancelar" variant="white" size="large" onPress={onClose} />
          <Button label="Crear grafica" size="large" disabled={!canSave} onPress={handleSave} />
        </div>
      </div>
    </Modal>
  );
};
