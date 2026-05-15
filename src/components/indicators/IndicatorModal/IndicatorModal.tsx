import { useState } from "react";
import { Modal } from "../../common/Modal/Modal";
import { Button } from "../../common/Button/Button";
import { IndicatorPreview } from "../IndicatorPreview/IndicatorPreview";
import type { IndicatorWidget } from "../../dashboard/types";
import type { IndicatorTone } from "../Indicator/Indicator";

interface Props {
  onClose: () => void;
  onSave: (widget: IndicatorWidget) => void;
  indicator?: IndicatorWidget;
}

// Mock data for dropdowns - replace with actual API calls
const sources = ["Source 1", "Source 2", "Source 3"];
const tablesBySource: Record<string, string[]> = {
  "Source 1": ["Table A", "Table B", "Table C"],
  "Source 2": ["Table D", "Table E"],
  "Source 3": ["Table F", "Table G", "Table H"],
};
const columnsByTable: Record<string, string[]> = {
  "Table A": ["Column A1", "Column A2", "Column A3"],
  "Table B": ["Column B1", "Column B2"],
  "Table C": ["Column C1", "Column C2", "Column C3"],
  "Table D": ["Column D1"],
  "Table E": ["Column E1", "Column E2"],
  "Table F": ["Column F1", "Column F2", "Column F3", "Column F4"],
  "Table G": ["Column G1"],
  "Table H": ["Column H1", "Column H2"],
};

// Neutral surface colors for all indicators — sourced from design tokens.
const neutralColors = {
  background: "var(--surface-sunken)",
  text: "var(--text-secondary)",
};

export const IndicatorModal = ({ onClose, onSave, indicator }: Props) => {
  const isEditMode = !!indicator;

  const [source, setSource] = useState(indicator?.source || "");
  const [table, setTable] = useState(indicator?.table || "");
  const [column, setColumn] = useState(indicator?.column || "");
  const [operation, setOperation] = useState<"porcentaje" | "total">(indicator?.operation || "porcentaje");
  const [tone, setTone] = useState<IndicatorTone>(indicator?.tone || "direct");
  const [startDate, setStartDate] = useState(
    indicator?.startDate ? new Date(indicator.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    indicator?.endDate ? new Date(indicator.endDate).toISOString().split("T")[0] : ""
  );
  const [name, setName] = useState(indicator?.name || "");
  const [value, setValue] = useState(indicator?.value || 0);

  const availableTables = source ? tablesBySource[source] || [] : [];
  const availableColumns = table ? columnsByTable[table] || [] : [];

  const handleSave = () => {
    const newIndicator: IndicatorWidget = {
      id: indicator?.id || crypto.randomUUID(),
      type: "indicator",
      value,
      ...(operation === "porcentaje" && { tone }),
      label: name,
      name,
      operation,
      source,
      table,
      column,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      backgroundColor: neutralColors.background,
      textColor: neutralColors.text,
    };
    onSave(newIndicator);
  };

  return (
    <Modal
      title={isEditMode ? "Editar indicador" : "Crear indicador"}
      onClose={onClose}
      className="w-[950px] rounded-2xl"
      footer={
        <>
          <Button label="Cancelar" variant="white" onPress={onClose} />
          <Button
            label={isEditMode ? "Guardar cambios" : "Guardar"}
            onPress={handleSave}
          />
        </>
      }
    >
      <div className="flex items-start gap-10 pt-2">
        <div className="flex-1 flex flex-col gap-6">
          {!isEditMode && (
            <>
              <div className="flex flex-col gap-3">
                <label className="text-body-sm font-semibold text-content-primary">Fuente</label>
                <select
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setTable("");
                    setColumn("");
                  }}
                  className="h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary"
                >
                  <option value="">Selecciona una fuente</option>
                  {sources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-body-sm font-semibold text-content-primary">Tabla</label>
                <select
                  value={table}
                  onChange={(e) => {
                    setTable(e.target.value);
                    setColumn("");
                  }}
                  disabled={!source}
                  className="h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona una tabla</option>
                  {availableTables.map((tbl) => (
                    <option key={tbl} value={tbl}>
                      {tbl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-body-sm font-semibold text-content-primary">Columna</label>
                <select
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                  disabled={!table}
                  className="h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona una columna</option>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-body-sm font-semibold text-content-primary">Operación</label>
            <div className="flex gap-3">
              {(["porcentaje", "total"] as const).map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    setOperation(op);
                    if (op === "total") {
                      setTone("direct");
                    }
                  }}
                  className={`flex-1 h-[52px] rounded-md font-semibold text-body cursor-pointer transition-[background-color,border-color,color,scale] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    operation === op
                      ? "bg-primary text-content-on-primary border-2 border-primary"
                      : "bg-surface-raised text-content-primary border-2 border-default hover:border-primary"
                  }`}
                >
                  {op === "porcentaje" ? "Porcentaje" : "Total"}
                </button>
              ))}
            </div>
          </div>

          {operation === "porcentaje" && (
            <div className="flex flex-col gap-3">
              <label className="text-body-sm font-semibold text-content-primary">Tipo</label>
              <div className="flex gap-3">
                {(["direct", "inverse"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`flex-1 h-[52px] rounded-md font-semibold text-body cursor-pointer transition-[background-color,border-color,color,scale] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      tone === t
                        ? "bg-primary text-content-on-primary border-2 border-primary"
                        : "bg-surface-raised text-content-primary border-2 border-default hover:border-primary"
                    }`}
                  >
                    {t === "direct" ? "Directo" : "Inverso"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-body-sm font-semibold text-content-primary">Fecha de inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-body-sm font-semibold text-content-primary">Fecha de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-body-sm font-semibold text-content-primary">Nombre</label>
            <input
              type="text"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
            />
          </div>

          {isEditMode && (
            <div className="flex flex-col gap-3">
              <label className="text-body-sm font-semibold text-content-primary">Valor</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary"
              />
            </div>
          )}

        </div>
        <div className="flex items-center justify-center min-w-[320px]">
          <IndicatorPreview
            value={value}
            label={name}
            tone={tone}
            backgroundColor={neutralColors.background}
            textColor={neutralColors.text}
          />
        </div>
      </div>
    </Modal>
  );
};
