import type { Widget } from "./types";
import { IndicatorPreview } from "./IndicatorPreview";
import { Chart } from "../Chart/Chart";

interface Props {
  widgets: Widget[];
}

export const HomeGrid = ({
  widgets,
}: Props) => {
  return (
    <div className="grid grid-cols-4 gap-6 w-full">
      {widgets.map((widget) => {
        if (widget.type === "indicator") {
          return (
            <IndicatorPreview
              key={widget.id}
              value={widget.value}
              label={widget.label}
              isPositive={widget.isPositive}
              backgroundColor={
                widget.backgroundColor
              }
              textColor={widget.textColor}
            />
          );
        }
        if (widget.type === "chart") {
        return (
          <Chart
            type={widget.config.chartType}
            title={widget.config.datasetId}
            data={widget.data}
            series={widget.series}
            size="md"
          />
        );
      }
        return null;
      })}
    </div>
  );
};