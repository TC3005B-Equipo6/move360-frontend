import { useState } from "react";
import { BarChart3, LineChart } from "lucide-react";
import { Modal } from "../common/Modal/Modal";
import { Button } from "../common/Button/Button";
import SegmentedControl from "../common/SegmentedControl/SegmentedControl";
import chartData from "./ChartDatasets.json";
import type { ChartConfig } from "./types";
import type { ItemType } from "./grid.config";

type ChartSize = "chartSm" | "chartMd" | "chartLg";
type ChartType = "bar" | "line";

const SIZE_OPTIONS: { label: string; value: ChartSize }[] = [
  { label: "Pequeña", value: "chartSm" },
  { label: "Mediana", value: "chartMd" },
  { label: "Grande", value: "chartLg" },
];

const TYPE_BY_SIZE: Record<ChartSize, ChartType[]> = {
  chartSm: ["bar"],
  chartMd: ["bar", "line"],
  chartLg: ["line"],
};

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

interface Props {
  onClose: () => void;
  onSave: (result: { type: ItemType; config: ChartConfig }) => void;
}

export const ChartFlowModal = ({ onClose, onSave }: Props) => {
  const [size, setSize] = useState<ChartSize | null>(null);
  const allowedTypes = size ? TYPE_BY_SIZE[size] : [];
  const [chartType, setChartType] = useState<ChartType>("bar");
  const effectiveType: ChartType =
    size && allowedTypes.includes(chartType) ? chartType : allowedTypes[0] ?? "bar";

  const sources = chartData.sources;
  const [source, setSource] = useState(sources[0]?.name || "");
  const currentSource = sources.find((s) => s.name === source);

  const [datasetId, setDatasetId] = useState("");
  const selectedDataset = currentSource?.datasets.find((d) => d.id === datasetId);
  const currentDataset = selectedDataset ?? currentSource?.datasets[0];
  const currentDatasetId = currentDataset?.id ?? "";
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareTable, setCompareTable] = useState("");
  const [startDate, setStartDate] = useState("2025-01");
  const [endDate, setEndDate] = useState("2025-12");

  const compatibleTables = currentSource?.datasets.filter((d) => {
    if (d.id === currentDatasetId) return false;
    return selectedColumns.some((column) => d.columns.includes(column));
  }) ?? [];

  const toggleColumn = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column],
    );
  };

  const handleSave = () => {
    if (!size) return;
    const preview = currentDataset?.preview || [];
    const formattedData = preview.map((row) => {
      const result: Record<string, string | number | undefined> = {
        name: row["Mes"] || row["Año"],
      };
      selectedColumns.forEach((column) => {
        result[column] = (row as Record<string, string | number | undefined>)[column];
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
    <Modal
      title="Nueva gráfica"
      onClose={onClose}
      className="w-[92vw] max-w-[1550px] max-h-[92vh] overflow-y-auto mt-6"
    >
      <div className="flex flex-col h-full min-h-0 gap-5">
        <div className="flex justify-center">
          <SegmentedControl
            label="TAMAÑO"
            value={size ?? undefined}
            onChange={(v) => setSize(v as ChartSize)}
            options={SIZE_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
          />
        </div>

        {!size && (
          <p className="text-center text-content-secondary text-body-sm py-8">
            Elige un tamaño para continuar.
          </p>
        )}

        {size && (
          <>
            <div className="flex justify-center">
              <SegmentedControl
                key={size}
                value={effectiveType}
                onChange={(v) => setChartType(v as ChartType)}
                options={allowedTypes.map((t) =>
                  t === "bar"
                    ? { label: "Barras", value: "bar", icon: <BarChart3 size={18} /> }
                    : { label: "Líneas", value: "line", icon: <LineChart size={18} /> },
                )}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-semibold text-content-primary">Inicio</label>
                  <input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-12 rounded-md border border-default bg-surface-raised px-4 outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-semibold text-content-primary">Fin</label>
                  <input
                    type="month"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-12 rounded-md border border-default bg-surface-raised px-4 outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-semibold text-content-primary">Fuente</label>
                  <select
                    value={source}
                    onChange={(e) => {
                      setSource(e.target.value);
                      setDatasetId("");
                      setSelectedColumns([]);
                      setCompareTable("");
                    }}
                    className="h-12 rounded-md border border-default bg-surface-raised px-4 outline-none transition-colors focus:border-primary"
                  >
                    {sources.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-semibold text-content-primary">Tabla</label>
                <select
                  value={currentDatasetId}
                  onChange={(e) => {
                    setDatasetId(e.target.value);
                    setSelectedColumns([]);
                    setCompareTable("");
                  }}
                  className="h-12 rounded-md border border-default bg-surface-raised px-4 outline-none transition-colors focus:border-primary"
                >
                  {currentSource?.datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-body-sm font-semibold text-content-primary">Columnas</label>
                <div className="rounded-lg border border-default bg-surface-sunken p-5 grid grid-cols-4 gap-4">
                  {currentDataset?.columns.map((column) => (
                    <label key={column} className="flex items-center gap-2 text-body-sm text-content-secondary">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column)}
                        onChange={() => toggleColumn(column)}
                      />
                      {column}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 text-body-sm font-semibold text-content-primary">
                  <input
                    type="checkbox"
                    checked={compareEnabled}
                    onChange={() => setCompareEnabled(!compareEnabled)}
                  />
                  Comparar con otra tabla
                </label>
                {compareEnabled && (
                  <select
                    value={compareTable}
                    onChange={(e) => setCompareTable(e.target.value)}
                    className="h-12 rounded-md border border-default bg-surface-raised px-4 outline-none transition-colors focus:border-primary"
                  >
                    <option value="">Selecciona tabla</option>
                    {compatibleTables.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="rounded-lg border border-default overflow-hidden bg-surface-raised">
                <div className="px-6 py-4 border-b border-default bg-surface-sunken">
                  <h3 className="font-bold text-content-primary text-h3">Vista previa de datos</h3>
                </div>
                <div className="overflow-auto max-h-[160px]">
                  <table className="w-full text-body-sm">
                    <thead className="bg-surface-sunken sticky top-0">
                      <tr>
                        {selectedColumns.map((column) => (
                          <th
                            key={column}
                            className="px-4 py-3 text-left text-content-primary border-b border-default"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentDataset?.preview.map((row, index) => (
                        <tr key={index} className="border-b border-subtle">
                          {selectedColumns.map((column) => (
                            <td key={column} className="px-4 py-3 text-content-secondary">
                              {String((row as Record<string, string | number | undefined>)[column] ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <Button label="Cancelar" variant="white" onPress={onClose} />
              <Button label="Agregar" onPress={handleSave} />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
