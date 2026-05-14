import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { IndicatorPreview } from "../IndicatorPreview/IndicatorPreview";
import type { IndicatorWidget } from "../Dashboard/types";
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

// Neutral gray/white colors for all indicators
const neutralColors = {
  background: "#f3f4f6",
  text: "#6b7280",
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
      className="w-[950px] rounded-[32px]"
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
                <label className="text-sm font-semibold text-[#1F4E79]">Fuente</label>
                <select
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setTable("");
                    setColumn("");
                  }}
                  className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
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
                <label className="text-sm font-semibold text-[#1F4E79]">Tabla</label>
                <select
                  value={table}
                  onChange={(e) => {
                    setTable(e.target.value);
                    setColumn("");
                  }}
                  disabled={!source}
                  className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79] disabled:opacity-50 disabled:cursor-not-allowed"
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
                <label className="text-sm font-semibold text-[#1F4E79]">Columna</label>
                <select
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                  disabled={!table}
                  className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79] disabled:opacity-50 disabled:cursor-not-allowed"
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
            <label className="text-sm font-semibold text-[#1F4E79]">Operación</label>
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
                  className={`flex-1 h-[52px] rounded-2xl font-semibold text-[16px] transition-all ${
                    operation === op
                      ? "bg-[#1F4E79] text-white border-2 border-[#1F4E79]"
                      : "bg-white text-[#1F4E79] border-2 border-[#DCE4EE] hover:border-[#1F4E79]"
                  }`}
                >
                  {op === "porcentaje" ? "Porcentaje" : "Total"}
                </button>
              ))}
            </div>
          </div>

          {operation === "porcentaje" && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[#1F4E79]">Tipo</label>
              <div className="flex gap-3">
                {(["direct", "inverse"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`flex-1 h-[52px] rounded-2xl font-semibold text-[16px] transition-all ${
                      tone === t
                        ? "bg-[#1F4E79] text-white border-2 border-[#1F4E79]"
                        : "bg-white text-[#1F4E79] border-2 border-[#DCE4EE] hover:border-[#1F4E79]"
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
              <label className="text-sm font-semibold text-[#1F4E79]">Fecha de inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-sm font-semibold text-[#1F4E79]">Fecha de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[#1F4E79]">Nombre</label>
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
              <label className="text-sm font-semibold text-[#1F4E79]">Valor</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="h-[52px] rounded-2xl border border-[#DCE4EE] px-5 text-[18px] text-[#1F4E79] outline-none focus:border-[#1F4E79]"
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
