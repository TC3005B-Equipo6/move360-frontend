import type { ChartItem } from "../Chart/Chart";
import type { IndicatorTone } from "../IndicatorCard/IndicatorCard";

export const MOCK_INDICATOR: { value: string; label: string; tone: IndicatorTone } = {
  value: "+12%",
  label: "Ventas",
  tone: "positive",
};

export const MOCK_DONUT: ChartItem[] = [
  { name: "Norte", value: 32 },
  { name: "Sur", value: 28 },
  { name: "Este", value: 22 },
  { name: "Oeste", value: 18 },
];
