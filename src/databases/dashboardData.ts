import type { DashboardItem } from '../components/dashboard/types';

// ── Datos del periodo Marzo 2025 – Febrero 2026 ──────────────────────────────

// Gráfica 1 — tendencia mensual
export const monthlyData = [
  { name: 'Mar', value: 151_800_000 },
  { name: 'Abr', value: 148_200_000 },
  { name: 'May', value: 149_600_000 },
  { name: 'Jun', value: 145_100_000 },
  { name: 'Jul', value: 139_700_000 },
  { name: 'Ago', value: 142_900_000 },
  { name: 'Sep', value: 154_800_000 },
  { name: 'Oct', value: 160_500_000 },
  { name: 'Nov', value: 165_616_699 },
  { name: 'Dic', value: 134_600_000 },
  { name: 'Ene', value: 148_100_000 },
  { name: 'Feb', value: 159_911_963 },
];

// Gráfica 2 — totales por sistema
export const systemData = [
  { name: 'Metro',       value: 1_263_959_562 },
  { name: 'Metrobús',    value:   506_007_414 },
  { name: 'Tren Ligero', value:    30_861_686 },
];

// Gráfica 3 — tipo de pago (donut, en %)
export const paymentData = [
  { name: 'Prepago',   value: 88.6 },
  { name: 'Gratuidad', value: 11.4 },
];

// Gráfica 4 — ranking top 10 líneas
export const rankingData = [
  { name: 'Metro L2',    value: 214_251_551 },
  { name: 'Metro L3',    value: 174_541_303 },
  { name: 'Metrobús L1', value: 150_873_348 },
  { name: 'Metro L1',    value: 132_638_596 },
  { name: 'Metro LB',    value: 124_955_025 },
  { name: 'Metro L12',   value: 119_912_616 },
  { name: 'Metro L8',    value: 118_200_792 },
  { name: 'Metro L9',    value:  93_362_377 },
  { name: 'Metro L7',    value:  87_910_841 },
  { name: 'Metrobús L5', value:  86_233_112 },
];

// ── Layout estático del home (readonly, no se persiste en localStorage) ──────
//
// Grid: 6 columnas × CELL_SIZE:180px + GUTTER:20px
//
// Fila 0: 6 indicadores de participación (cols 0-5)
// Fila 1-2: gráfica de línea mensual (chartLg, cols 0-4)
// Fila 3-4: gráfica de barras por sistema (chartMd, cols 0-2)
//           + donut tipo de pago (chartMd, cols 3-5)
// Fila 5-6: ranking top 10 líneas (chartLg, cols 0-4)

export const HOME_DASHBOARD_ITEMS: DashboardItem[] = [
  // ── Indicadores ─────────────────────────────────────────────────────────────
  {
    id: 'kpi-metro',
    type: 'indicator',
    row: 0,
    col: 0,
    config: {
      value: 70.2,
      tone: 'direct',
      label: 'Metro',
      name: 'Metro',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      isMenuOpen: false,
    },
  },
  {
    id: 'kpi-metrobus',
    type: 'indicator',
    row: 0,
    col: 1,
    config: {
      value: 28.1,
      tone: 'direct',
      label: 'Metrobús',
      name: 'Metrobús',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      isMenuOpen: false,
    },
  },
  {
    id: 'kpi-tren-ligero',
    type: 'indicator',
    row: 0,
    col: 2,
    config: {
      value: 1.7,
      tone: 'inverse',
      label: 'Tren Ligero',
      name: 'Tren Ligero',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      isMenuOpen: false,
    },
  },
  {
    id: 'kpi-prepago',
    type: 'indicator',
    row: 0,
    col: 3,
    config: {
      value: 88.6,
      tone: 'direct',
      label: 'Prepago',
      name: 'Prepago',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      isMenuOpen: false,
    },
  },
  {
    id: 'kpi-gratuidad',
    type: 'indicator',
    row: 0,
    col: 4,
    config: {
      value: 11.4,
      tone: 'inverse',
      label: 'Gratuidad',
      name: 'Gratuidad',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      isMenuOpen: false,
    },
  },
  {
    id: 'kpi-total-anual',
    type: 'indicator',
    row: 0,
    col: 5,
    config: {
      value: 1800.8,
      tone: 'direct',
      label: 'Total anual M',
      name: 'Total anual',
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      isMenuOpen: false,
    },
  },
  // ── Gráfica 1: tendencia mensual ─────────────────────────────────────────────
  {
    id: 'chart-monthly',
    type: 'chartLg',
    row: 1,
    col: 0,
    config: {
      config: {
        chartType: 'line',
        source: 'SEMOVI',
        datasetId: 'Afluencia mensual',
        columns: ['value'],
        compareEnabled: false,
        compareTable: '',
        startDate: '2025-03',
        endDate: '2026-02',
      },
      data: monthlyData,
      series: [],
    },
  },
  // ── Gráfica 2: totales por sistema ───────────────────────────────────────────
  {
    id: 'chart-system',
    type: 'chartMd',
    row: 3,
    col: 0,
    config: {
      config: {
        chartType: 'bar',
        source: 'SEMOVI',
        datasetId: 'Por sistema',
        columns: ['value'],
        compareEnabled: false,
        compareTable: '',
        startDate: '2025-03',
        endDate: '2026-02',
      },
      data: systemData,
      series: [],
    },
  },
  // ── Gráfica 3: tipo de pago (donut) ─────────────────────────────────────────
  {
    id: 'chart-payment',
    type: 'chartMd',
    row: 3,
    col: 3,
    config: {
      config: {
        chartType: 'donut',
        source: 'SEMOVI',
        datasetId: 'Tipo de pago',
        columns: ['value'],
        compareEnabled: false,
        compareTable: '',
        startDate: '2025-03',
        endDate: '2026-02',
      },
      data: paymentData,
      series: [],
    },
  },
  // ── Gráfica 4: ranking top 10 líneas ────────────────────────────────────────
  {
    id: 'chart-ranking',
    type: 'chartLg',
    row: 5,
    col: 0,
    config: {
      config: {
        chartType: 'ranking',
        source: 'SEMOVI',
        datasetId: 'Top 10 líneas',
        columns: ['value'],
        compareEnabled: false,
        compareTable: '',
        startDate: '2025-03',
        endDate: '2026-02',
      },
      data: rankingData,
      series: [],
    },
  },
];
