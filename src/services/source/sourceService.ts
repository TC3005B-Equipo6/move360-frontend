import api from "../api";

// --- Source catalog (read-only) --------------------------------------------
//
// Wraps the backend `/source*` endpoints, which serve a static catalog from
// `sources.json` (no DB). The catalog feeds the IndicatorModal selectors.
//
// ⚠️ Backend contract quirks (the backend is read-only; we adapt here):
//   - `GET /source` returns a duplicated `id` (INEGI and SEMOVI are both id:1),
//     so the DTO `id` is NOT a unique key. Sources are addressed by their
//     ARRAY POSITION instead: 0 = INEGI, 1 = SEMOVI.
//   - `GET /source/{i}` reads `sources.get(i)` — the path param is the source
//     array index (0/1), not the DTO id.
//   - `GET /source/column/{i}` is hardcoded to INEGI (`getFirst()`); `i` is the
//     0-based table index. Columns only make sense for INEGI.
//   - `GET /source/filter/{i}` is hardcoded to SEMOVI (`getLast()`); `i` is the
//     0-based table index. Filters only make sense for SEMOVI.
//   - Tables come back with their 1-based JSON `id`, but column/filter expect a
//     0-based table index. Callers must use the table's POSITION in the returned
//     array (0-based), not its DTO `id`.
//
// See docs/pending-implementation.md and the backend SourceRepositoryImpl.

/** Array index of each source as the backend orders them in sources.json. */
export const SOURCE_INDEX = { INEGI: 0, SEMOVI: 1 } as const;

/** A source, table, or column entry: `{ id, name }` from `SourceItemResponseDTO`. */
export interface SourceItem {
  id: number;
  name: string;
}

/** A filter group for a SEMOVI table, from `FilterResponseDTO`. */
export interface SourceFilter {
  id: number;
  name: string;
  values: string[];
}

interface RawSourceItem {
  id: number;
  name: string;
}

interface RawFilter {
  id: number;
  name: string;
  values: string[] | null;
}

function toItem(raw: RawSourceItem): SourceItem {
  return { id: raw.id, name: raw.name };
}

function toFilter(raw: RawFilter): SourceFilter {
  // The Metro "Estación" group ships with [""] in the catalog; drop empty
  // placeholders so the UI can treat the group as "no values available".
  const values = (raw.values ?? []).filter((v) => v.trim().length > 0);
  return { id: raw.id, name: raw.name, values };
}

/** List available sources. Consume by ARRAY POSITION, not by `id` (ids collide). */
export async function listSources(): Promise<SourceItem[]> {
  const { data } = await api.get<RawSourceItem[]>("/source");
  return data.map(toItem);
}

/** Tables for a source. `sourceIndex` = array position (0 INEGI, 1 SEMOVI). */
export async function listTables(sourceIndex: number): Promise<SourceItem[]> {
  const { data } = await api.get<RawSourceItem[]>(`/source/${sourceIndex}`);
  return data.map(toItem);
}

/** Columns for an INEGI table. `tableIndex` = 0-based position in the tables list. */
export async function listColumns(tableIndex: number): Promise<SourceItem[]> {
  const { data } = await api.get<RawSourceItem[]>(`/source/column/${tableIndex}`);
  return data.map(toItem);
}

/** Filter groups for a SEMOVI table. `tableIndex` = 0-based position in the tables list. */
export async function listFilters(tableIndex: number): Promise<SourceFilter[]> {
  const { data } = await api.get<RawFilter[]>(`/source/filter/${tableIndex}`);
  return data.map(toFilter);
}
