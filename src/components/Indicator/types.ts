export interface IndicatorWidget {
  id: string;
  type: "indicator";
  value: number;
  label: string;
  isPositive: boolean;
  backgroundColor: string;
  textColor: string;
}
export interface ChartWidget {
  id: string;
  type: "chart";
  config: {
    chartType: "bar" | "line";
    source: string;
    datasetId: string;
    columns: string[];
    compareEnabled: boolean;
    compareTable: string;
    startDate: string;
    endDate: string;
  };
  data: any[];
  series: {
    key: string;
    color: string;
    label?: string;
  }[];
}

export type Widget =
  | IndicatorWidget
  | ChartWidget;