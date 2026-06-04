import type { DashboardItem } from "../components/dashboard/types";

const PERIOD_SUBTITLE = "Febrero 2026 vs enero 2026";
const MONTH_SUBTITLE = "Febrero 2026";

type RidershipDatum = {
  name: string;
  value: number;
};

export const metroLineRidershipData: RidershipDatum[] = [
  { name: "Línea 2", value: 15_358_070 },
  { name: "Línea 3", value: 13_835_470 },
  { name: "Línea 1", value: 12_394_876 },
  { name: "Línea B", value: 9_629_126 },
  { name: "Línea 12", value: 9_533_153 },
  { name: "Línea 8", value: 9_105_617 },
  { name: "Línea 9", value: 6_781_452 },
  { name: "Línea 7", value: 6_407_752 },
  { name: "Línea A", value: 6_215_447 },
  { name: "Línea 5", value: 4_450_687 },
  { name: "Línea 6", value: 3_005_330 },
  { name: "Línea 4", value: 1_910_618 },
];

export const metrobusLineRidershipData: RidershipDatum[] = [
  { name: "Línea 1", value: 12_176_103 },
  { name: "Línea 5", value: 6_829_647 },
  { name: "Línea 2", value: 5_380_975 },
  { name: "Línea 6", value: 5_140_020 },
  { name: "Línea 3", value: 4_818_568 },
  { name: "Línea 7", value: 3_266_981 },
  { name: "Línea 4", value: 2_364_580 },
];

export const serviceRidershipData: RidershipDatum[] = [
  { name: "Metro", value: 98_627_598 },
  { name: "Metrobús", value: 39_976_874 },
  { name: "RTP", value: 9_604_043 },
  { name: "Trolebús", value: 9_499_852 },
  { name: "Cablebús", value: 3_524_583 },
  { name: "Tren Ligero", value: 2_437_777 },
];

export const monthlyData: RidershipDatum[] = [
  { name: "Ene", value: 164_089_265 },
  { name: "Feb", value: 163_670_727 },
];

export const systemData = serviceRidershipData;

export const paymentData: RidershipDatum[] = [
  { name: "Prepago", value: 88.6 },
  { name: "Gratuidad", value: 11.4 },
];

export const rankingData = metroLineRidershipData.slice(0, 10);

export const HOME_DASHBOARD_ITEMS: DashboardItem[] = [
  {
    id: "kpi-metro-incidents",
    type: "indicator",
    row: 0,
    col: 5,
    config: {
      data: 6,
      deltaData: 3,
      relationship: "INVERSE",
      title: "Incidencias Metro",
      subtitle: PERIOD_SUBTITLE,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      isMenuOpen: false,
    },
  },
  {
    id: "kpi-metro-passengers",
    type: "indicator",
    row: 1,
    col: 3,
    config: {
      data: 98.6,
      deltaData: -2.2,
      unit: "M",
      relationship: "DIRECT",
      title: "Pasajeros Metro",
      subtitle: PERIOD_SUBTITLE,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      isMenuOpen: false,
    },
  },
  {
    id: "kpi-metrobus-passenger-trend",
    type: "indicator",
    row: 0,
    col: 4,
    config: {
      data: -1.5,
      deltaData: -1.5,
      unit: "%",
      relationship: "DIRECT",
      title: "Tendencia pasajeros Metrobús",
      subtitle: PERIOD_SUBTITLE,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      isMenuOpen: false,
    },
  },
  {
    id: "kpi-metro-passenger-trend",
    type: "indicator",
    row: 1,
    col: 4,
    config: {
      data: -2.1,
      deltaData: -2.1,
      unit: "%",
      relationship: "DIRECT",
      title: "Tendencia pasajeros Metro",
      subtitle: PERIOD_SUBTITLE,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      isMenuOpen: false,
    },
  },
  {
    id: "kpi-metrobus-passengers",
    type: "indicator",
    row: 0,
    col: 3,
    config: {
      data: 40.0,
      deltaData: -0.6,
      unit: "M",
      relationship: "DIRECT",
      title: "Pasajeros Metrobús",
      subtitle: PERIOD_SUBTITLE,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      isMenuOpen: false,
    },
  },
  {
    id: "kpi-top-metro-line-share",
    type: "indicator",
    row: 1,
    col: 5,
    config: {
      data: 15.6,
      deltaData: -0.6,
      unit: "%",
      relationship: "INVERSE",
      title: "Concentración top línea Metro",
      subtitle: "Línea 2 · 15.4M de 98.6M pasajeros",
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      isMenuOpen: false,
    },
  },
  {
    id: "chart-metro-lines",
    type: "chartMd",
    row: 2,
    col: 0,
    config: {
      config: {
        chartType: "ranking",
        sourceId: 0,
        tableId: 0,
        dimensionColumn: "name",
        metricColumns: ["value"],
        operation: "SUM",
        compareEnabled: true,
        compareTableId: null,
        startMonth: "2026-02",
        endMonth: "2026-02",
        sourceName: "SEMOVI",
        tableName: "Afluencia Metro por línea",
      },
      subtitle: `${MONTH_SUBTITLE} · delta total ${PERIOD_SUBTITLE.toLowerCase()}`,
      delta: -2.1,
      data: metroLineRidershipData,
      series: [],
    },
  },
  {
    id: "chart-metrobus-lines",
    type: "chartMd",
    row: 2,
    col: 3,
    config: {
      config: {
        chartType: "ranking",
        sourceId: 0,
        tableId: 0,
        dimensionColumn: "name",
        metricColumns: ["value"],
        operation: "SUM",
        compareEnabled: true,
        compareTableId: null,
        startMonth: "2026-02",
        endMonth: "2026-02",
        sourceName: "SEMOVI",
        tableName: "Afluencia Metrobús por línea",
      },
      subtitle: `${MONTH_SUBTITLE} · delta total ${PERIOD_SUBTITLE.toLowerCase()}`,
      delta: -1.5,
      data: metrobusLineRidershipData,
      series: [],
    },
  },
  {
    id: "chart-service-ridership",
    type: "chartMd",
    row: 0,
    col: 0,
    config: {
      config: {
        chartType: "bar",
        sourceId: 0,
        tableId: 0,
        dimensionColumn: "name",
        metricColumns: ["value"],
        operation: "SUM",
        compareEnabled: true,
        compareTableId: null,
        startMonth: "2026-02",
        endMonth: "2026-02",
        sourceName: "SEMOVI",
        tableName: "Afluencia por servicio de transporte",
      },
      subtitle: `${MONTH_SUBTITLE} · Metro, Metrobús, RTP, Trolebús, Cablebús y Tren Ligero`,
      delta: -0.3,
      data: serviceRidershipData,
      series: [],
    },
  },
];
