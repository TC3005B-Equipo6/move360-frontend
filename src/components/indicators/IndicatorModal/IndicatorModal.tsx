import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../../common/Modal/Modal";
import { Button } from "../../common/Button/Button";
import { IndicatorPreview } from "../IndicatorPreview/IndicatorPreview";
import { icons } from "../../../icons";
import {
  listSources,
  listTables,
  listColumns,
  listFilters,
  type SourceItem,
  type SourceFilter,
} from "../../../services/source/sourceService";
import type { IndicatorWidget, IndicatorType, IndicatorOperation } from "../../dashboard/types";
import type { RelationType } from "../Indicator/Indicator";

interface Props {
  onClose: () => void;
  onSave: (widget: IndicatorWidget) => void;
  indicator?: IndicatorWidget;
}

// Sources whose name matches these expose columns (INEGI) vs filters (SEMOVI).
// The backend hardcodes `/source/column/*` to INEGI and `/source/filter/*` to
// SEMOVI, so the branch is driven by the selected source name.
const SOURCE_INEGI = "INEGI";
const SOURCE_SEMOVI = "SEMOVI";

const HelpIcon = icons.help;

// The modal body scrolls (overflow-y-auto) and the modal root clips
// (overflow-hidden), so an in-flow popover would be cut off. We portal the
// bubble to <body> with fixed coordinates measured from the trigger on hover.
const Tip = ({ text, children }: { text: string; children: ReactNode }) => {
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
      className="inline-flex items-center outline-none focus-visible:text-primary"
    >
      {children}
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
    {help && (
      <Tip text={help}>
        <HelpIcon size={15} className="cursor-help text-content-muted" aria-label={help} />
      </Tip>
    )}
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

// A SEMOVI filter group is satisfied when it has no selectable values (e.g. the
// Metro "Estación" placeholder) or at least one value is picked.
const isFilterGroupValid = (g: SourceFilter, selected: Record<number, string[]>) =>
  g.values.length === 0 || (selected[g.id]?.length ?? 0) > 0;

const toggleValue = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

// Accordion + chips. Multiple groups open at once; each group requires >=1 value.
function FilterAccordion({
  filters,
  selected,
  onChange,
}: {
  filters: SourceFilter[];
  selected: Record<number, string[]>;
  onChange: (next: Record<number, string[]>) => void;
}) {
  // All groups start expanded. The parent remounts this via `key` when the table
  // changes, so a fresh initializer re-expands everything without an effect.
  const [open, setOpen] = useState<Set<number>>(() => new Set(filters.map((g) => g.id)));

  const toggleOpen = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-2.5">
      {filters.map((g) => {
        const chosen = selected[g.id] ?? [];
        const valid = isFilterGroupValid(g, selected);
        const isOpen = open.has(g.id);
        return (
          <div key={g.id} className="rounded-md border border-default overflow-hidden">
            <button
              type="button"
              onClick={() => toggleOpen(g.id)}
              className="w-full px-4 h-[52px] flex items-center justify-between bg-surface-raised hover:bg-surface-sunken"
            >
              <span className="flex items-center gap-2">
                <span className="text-content-muted">{isOpen ? "▾" : "▸"}</span>
                <span className="text-body-sm font-semibold text-content-primary">{g.name}</span>
                <span className="text-danger">*</span>
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`grid place-items-center min-w-6 h-6 px-1.5 rounded-full text-caption font-semibold ${
                    chosen.length ? "bg-primary text-content-on-primary" : "bg-surface-sunken text-content-muted"
                  }`}
                >
                  {chosen.length}
                </span>
                {!valid && (
                  <Tip text="Este grupo requiere al menos 1 valor seleccionado.">
                    <span className="text-danger text-body-sm cursor-help" aria-label="Requiere al menos 1 valor">
                      ⚠
                    </span>
                  </Tip>
                )}
              </span>
            </button>
            {isOpen && (
              <div className="px-4 py-3 border-t border-subtle">
                {g.values.length === 0 ? (
                  <span className="text-body-sm text-content-muted italic">Sin valores disponibles</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {g.values.map((v) => {
                      const on = chosen.includes(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => onChange({ ...selected, [g.id]: toggleValue(chosen, v) })}
                          className={`h-8 px-3 rounded-full text-body-sm font-medium border-2 transition-colors cursor-pointer ${
                            on
                              ? "bg-primary text-content-on-primary border-primary"
                              : "bg-surface-raised text-content-secondary border-default hover:border-primary"
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
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
  const [indicatorType, setIndicatorType] = useState<IndicatorType>(indicator?.indicatorType || "percentage");
  const [operation, setOperation] = useState<IndicatorOperation>(indicator?.operation || "sum");
  const [relationType, setRelationType] = useState<RelationType>(indicator?.relationType || "direct");
  const [startDate, setStartDate] = useState(
    indicator?.startDate ? new Date(indicator.startDate).toISOString().split("T")[0] : "",
  );
  const [endDate, setEndDate] = useState(
    indicator?.endDate ? new Date(indicator.endDate).toISOString().split("T")[0] : "",
  );

  // --- Catalog selection (indices are what the backend expects) ---
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [tables, setTables] = useState<SourceItem[]>([]);
  const [columns, setColumns] = useState<SourceItem[]>([]);
  const [filters, setFilters] = useState<SourceFilter[]>([]);

  const [sourceIndex, setSourceIndex] = useState<number | null>(indicator?.sourceIndex ?? null);
  const [tableIndex, setTableIndex] = useState<number | null>(indicator?.tableIndex ?? null);
  const [columnIndex, setColumnIndex] = useState<number | null>(indicator?.columnIndex ?? null);
  const [selectedFilters, setSelectedFilters] = useState<Record<number, string[]>>(indicator?.filters ?? {});

  const sourceName = sourceIndex !== null ? sources[sourceIndex]?.name : undefined;
  const isInegi = sourceName === SOURCE_INEGI;
  const isSemovi = sourceName === SOURCE_SEMOVI;

  // Load sources once on mount. (setState runs in the async callback, not the
  // effect body, to avoid synchronous cascading renders.)
  useEffect(() => {
    let active = true;
    listSources()
      .then((data) => active && setSources(data))
      .catch(() => active && setSources([]));
    return () => {
      active = false;
    };
  }, []);

  // Load tables whenever the source changes (and on edit prefill once sources arrive).
  useEffect(() => {
    if (sourceIndex === null) return;
    let active = true;
    listTables(sourceIndex)
      .then((data) => active && setTables(data))
      .catch(() => active && setTables([]));
    return () => {
      active = false;
    };
  }, [sourceIndex]);

  // Load columns (INEGI) or filters (SEMOVI) whenever the table changes.
  // `sourceName` gates the branch; depend on it so prefill resolves after sources load.
  useEffect(() => {
    if (sourceIndex === null || tableIndex === null || !sourceName) return;
    let active = true;
    if (isInegi) {
      listColumns(tableIndex)
        .then((data) => active && setColumns(data))
        .catch(() => active && setColumns([]));
    } else if (isSemovi) {
      listFilters(tableIndex)
        .then((data) => active && setFilters(data))
        .catch(() => active && setFilters([]));
    }
    return () => {
      active = false;
    };
  }, [sourceIndex, tableIndex, sourceName, isInegi, isSemovi]);

  const handleSourceChange = (value: string) => {
    setSourceIndex(value === "" ? null : Number(value));
    setTableIndex(null);
    setColumnIndex(null);
    setSelectedFilters({});
    // Clear dependent lists here (event handler) rather than in an effect body.
    setTables([]);
    setColumns([]);
    setFilters([]);
  };

  const handleTableChange = (value: string) => {
    setTableIndex(value === "" ? null : Number(value));
    setColumnIndex(null);
    setSelectedFilters({});
    setColumns([]);
    setFilters([]);
  };

  // Percentage figures render with a "%" suffix; absolute counts carry no unit here.
  const unit = indicatorType === "percentage" ? "%" : undefined;

  const filtersValid = isSemovi && filters.length > 0 && filters.every((g) => isFilterGroupValid(g, selectedFilters));
  const originValid = isInegi ? columnIndex !== null : isSemovi ? filtersValid : false;

  // Required to save: identity (title + subtitle), source + table, and the data
  // origin (INEGI column or SEMOVI filters). The backend rejects an indicator
  // without them.
  const canSave = Boolean(
    title.trim() && subtitle.trim() && sourceIndex !== null && tableIndex !== null && originValid,
  );

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
      sourceIndex: sourceIndex ?? undefined,
      sourceName,
      tableIndex: tableIndex ?? undefined,
      tableName: tableIndex !== null ? tables[tableIndex]?.name : undefined,
      columnIndex: isInegi && columnIndex !== null ? columnIndex : undefined,
      columnName: isInegi && columnIndex !== null ? columns[columnIndex]?.name : undefined,
      filters: isSemovi ? selectedFilters : undefined,
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
              <select value={sourceIndex ?? ""} onChange={(e) => handleSourceChange(e.target.value)} className={selectClass}>
                <option value="">Selecciona una fuente</option>
                {sources.map((src, i) => (
                  <option key={src.name} value={i}>
                    {src.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <FieldLabel>Tabla</FieldLabel>
              <select
                value={tableIndex ?? ""}
                onChange={(e) => handleTableChange(e.target.value)}
                disabled={sourceIndex === null}
                className={selectClass}
              >
                <option value="">Selecciona una tabla</option>
                {tables.map((tbl, i) => (
                  <option key={tbl.id} value={i}>
                    {tbl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Columna — INEGI only. Disabled for SEMOVI (it exposes filters instead). */}
            <div className="flex flex-col gap-3">
              <FieldLabel help="La columna numérica que se agrega (suma o promedio). Solo aplica para INEGI.">
                Columna
              </FieldLabel>
              <select
                value={columnIndex ?? ""}
                onChange={(e) => setColumnIndex(e.target.value === "" ? null : Number(e.target.value))}
                disabled={!isInegi}
                className={selectClass}
              >
                <option value="">{isSemovi ? "No aplica para SEMOVI" : "Selecciona una columna"}</option>
                {columns.map((col, i) => (
                  <option key={col.id} value={i}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtros — SEMOVI only. */}
            <div className="flex flex-col gap-3">
              <FieldLabel help="Acota la afluencia por líneas, tipo de pago, etc. Debes elegir al menos 1 valor en cada grupo. Solo aplica para SEMOVI.">
                Filtros
              </FieldLabel>
              {isSemovi ? (
                filters.length > 0 ? (
                  <FilterAccordion key={tableIndex} filters={filters} selected={selectedFilters} onChange={setSelectedFilters} />
                ) : (
                  <div className="rounded-md border border-dashed border-default px-5 py-6 text-body-sm text-content-muted">
                    {tableIndex === null ? "Selecciona una tabla para ver sus filtros." : "Esta tabla no tiene filtros."}
                  </div>
                )
              ) : (
                <div className="rounded-md border border-dashed border-default px-5 py-6 text-body-sm text-content-muted">
                  Los filtros solo aplican para SEMOVI.
                </div>
              )}
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
