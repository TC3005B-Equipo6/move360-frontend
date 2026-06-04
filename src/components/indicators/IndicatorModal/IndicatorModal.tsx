import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../common/Modal/Modal";
import { Button } from "../../common/Button/Button";
import { IndicatorPreview } from "../IndicatorPreview/IndicatorPreview";
import { icons } from "../../../icons";
import type { IndicatorWidget, IndicatorType, IndicatorOperation } from "../../dashboard/types";
import type { RelationType } from "../Indicator/Indicator";

interface Props {
  onClose: () => void;
  onSave: (widget: IndicatorWidget) => void;
  indicator?: IndicatorWidget;
}

// Mock data for dropdowns - replace with actual API calls (GET /source, tables, columns).
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

const HelpIcon = icons.help;

// The modal body scrolls (overflow-y-auto) and the modal root clips
// (overflow-hidden), so an in-flow popover would be cut off. We portal the
// bubble to <body> with fixed coordinates measured from the trigger on hover.
const HelpTip = ({ text }: { text: string }) => {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const show = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setCoords({ x: rect.left + rect.width / 2, y: rect.top });
  };
  const hide = () => setCoords(null);

  return (
    <span
      ref={triggerRef}
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className="inline-flex items-center text-content-muted outline-none focus-visible:text-primary"
    >
      <HelpIcon size={15} className="cursor-help" aria-label={text} />
      {coords &&
        createPortal(
          <span
            role="tooltip"
            style={{ position: "fixed", left: coords.x, top: coords.y - 8, transform: "translate(-50%, -100%)" }}
            className="pointer-events-none z-[1100] w-max max-w-[240px] rounded-md bg-surface-inverse px-2.5 py-1.5 text-caption font-medium text-content-on-inverse shadow-md"
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  );
};

const FieldLabel = ({ children, help }: { children: ReactNode; help?: string }) => (
  <span className="flex items-center gap-1.5 text-body-sm font-semibold text-content-primary">
    {children}
    {help && <HelpTip text={help} />}
  </span>
);

type ToggleOption<T extends string> = { value: T; label: string };

function Toggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 h-[52px] rounded-md font-semibold text-body cursor-pointer transition-[background-color,border-color,color,scale] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
            value === option.value
              ? "bg-primary text-content-on-primary border-2 border-primary"
              : "bg-surface-raised text-content-primary border-2 border-default hover:border-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "h-[52px] rounded-md border border-default px-5 text-body-lg text-content-primary outline-none transition-colors focus:border-primary";
const selectClass = `${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`;

export const IndicatorModal = ({ onClose, onSave, indicator }: Props) => {
  const isEditMode = !!indicator;

  const [title, setTitle] = useState(indicator?.label || "");
  const [subtitle, setSubtitle] = useState(indicator?.subtitle || "");
  const [source, setSource] = useState(indicator?.source || "");
  const [table, setTable] = useState(indicator?.table || "");
  const [column, setColumn] = useState(indicator?.column || "");
  const [indicatorType, setIndicatorType] = useState<IndicatorType>(indicator?.indicatorType || "percentage");
  const [operation, setOperation] = useState<IndicatorOperation>(indicator?.operation || "sum");
  const [relationType, setRelationType] = useState<RelationType>(indicator?.relationType || "direct");
  const [startDate, setStartDate] = useState(
    indicator?.startDate ? new Date(indicator.startDate).toISOString().split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    indicator?.endDate ? new Date(indicator.endDate).toISOString().split("T")[0] : ""
  );

  const availableTables = source ? tablesBySource[source] || [] : [];
  const availableColumns = table ? columnsByTable[table] || [] : [];

  // Percentage figures render with a "%" suffix; absolute counts carry no unit here.
  const unit = indicatorType === "percentage" ? "%" : undefined;

  // Required to save: identity (title + subtitle) and the data origin
  // (source, table, column). The backend rejects an indicator without them.
  const canSave = Boolean(title.trim() && subtitle.trim() && source && table && column);

  const handleSave = () => {
    // `value`/`deltaData` are computed by the backend from the query; we keep any
    // existing values when editing and otherwise leave them for the backend to fill.
    const newIndicator: IndicatorWidget = {
      id: indicator?.id || crypto.randomUUID(),
      type: "indicator",
      value: indicator?.value ?? 0,
      label: title,
      subtitle: subtitle || undefined,
      relationType,
      deltaData: indicator?.deltaData,
      unit,
      indicatorType,
      operation,
      source,
      table,
      column,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
            disabled={!canSave}
          />
        </>
      }
    >
      <div className="flex flex-col gap-6 pt-2">
        {/* Identity — title and subtitle lead the form. */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <FieldLabel>Título</FieldLabel>
            <input
              type="text"
              maxLength={40}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del indicador"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FieldLabel>Subtítulo</FieldLabel>
            <input
              type="text"
              maxLength={60}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Contexto (ej. Febrero 2026 vs enero 2026)"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-start gap-10">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <FieldLabel>Fuente</FieldLabel>
              <select
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setTable("");
                  setColumn("");
                }}
                className={selectClass}
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
              <FieldLabel>Tabla</FieldLabel>
              <select
                value={table}
                onChange={(e) => {
                  setTable(e.target.value);
                  setColumn("");
                }}
                disabled={!source}
                className={selectClass}
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
              <FieldLabel>Columna</FieldLabel>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                disabled={!table}
                className={selectClass}
              >
                <option value="">Selecciona una columna</option>
                {availableColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <FieldLabel help="Formato del número mostrado: un porcentaje (48%) o un conteo absoluto (100,000).">
                Tipo
              </FieldLabel>
              <Toggle
                value={indicatorType}
                onChange={setIndicatorType}
                options={[
                  { value: "percentage", label: "Porcentaje" },
                  { value: "number", label: "Número" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-3">
              <FieldLabel help="Cómo se agregan los valores del periodo: sumándolos o promediándolos.">
                Operación
              </FieldLabel>
              <Toggle
                value={operation}
                onChange={setOperation}
                options={[
                  { value: "sum", label: "Suma" },
                  { value: "average", label: "Promedio" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-3">
              <FieldLabel help="Directa: subir es positivo (verde al subir). Inversa: subir es negativo (rojo al subir).">
                Relación
              </FieldLabel>
              <Toggle
                value={relationType}
                onChange={setRelationType}
                options={[
                  { value: "direct", label: "Directa" },
                  { value: "inverse", label: "Inversa" },
                ]}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-3">
                <FieldLabel>Fecha de inicio</FieldLabel>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <FieldLabel>Fecha de fin</FieldLabel>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start gap-3 min-w-[320px] pt-7">
            <span className="text-body-sm font-semibold text-content-secondary">Vista previa</span>
            <IndicatorPreview
              label={title}
              subtitle={subtitle || undefined}
              relationType={relationType}
              unit={unit}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
