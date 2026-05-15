import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface ChartItem {
  name?: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface SeriesItem {
  key: string;
  color: string;
  label?: string;
}

export interface ChartProps {
  type: "donut" | "line" | "bar";
  title?: string;
  metricLabel?: string;
  data: ChartItem[];
  size?: "sm" | "md" | "lg";
  series?: SeriesItem[];
}

const COLORS = [
  "#0b4d94",
  "#ef2b2d",
  "#78d7fd",
  "#9cc52b",
  "#ff7f18",
  "#7e3e7d",
  "#00a676",
  "#f2c94c",
  "#6f4bd8",
  "#8a5a44",
];

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 2_147_483_647;
  }
  return hash || 1;
};

const shuffleColors = (seed: number) => {
  const colors = [...COLORS];
  let state = seed;

  for (let index = colors.length - 1; index > 0; index -= 1) {
    state = (state * 48_271) % 2_147_483_647;
    const swapIndex = state % (index + 1);
    [colors[index], colors[swapIndex]] = [colors[swapIndex], colors[index]];
  }

  return colors;
};

const getChartColors = (title: string, data: ChartItem[]) => {
  const categories = data.map((item, index) => item.name ?? `item-${index}`).join("|");
  return shuffleColors(hashString(`${title}|${categories}`));
};

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullNumberFormatter = new Intl.NumberFormat("en-US");

const formatCompactNumber = (value: string | number) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? compactNumberFormatter.format(numericValue) : String(value);
};

const formatTooltipValue = (
  value: string | number | ReadonlyArray<string | number> | undefined,
): string => {
  if (value === undefined) return "";
  if (Array.isArray(value)) return value.map(formatTooltipValue).join(" - ");

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? fullNumberFormatter.format(numericValue) : String(value);
};

const cardSizes: Record<string, string> = {
  sm: "w-[380px] h-[380px]",
  md: "w-[580px] h-[380px]",
  lg: "w-[1180px] h-[380px]",
};

export const Chart = ({ type, title = "Chart", metricLabel = "Valor", data, size = "md", series }: ChartProps) => {
  const chartColors = getChartColors(title, data);

  const renderDonut = () => (
    <div className="grid grid-cols-[minmax(0,1fr)_150px] items-center gap-4 w-full h-[calc(100%-50px)] overflow-hidden">
      <div className="min-w-0 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={size === "sm" ? 38 : 75}
              outerRadius={size === "sm" ? 70 : 120}
              paddingAngle={4}
            >
              {data.map((item, index) => (
                <Cell
                  key={`slice-${item.name ?? index}`}
                  fill={chartColors[index % chartColors.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="min-w-0 flex flex-col gap-2 font-[Inter,sans-serif]">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-2 text-[#885f8a] text-sm leading-tight"
          >
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: chartColors[index % chartColors.length] }}
            />
            <span className="truncate">{item.name}</span>
            <span className="tabular-nums">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLine = () => (
    <ResponsiveContainer width="100%" height="85%">
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatCompactNumber} />
        <Tooltip formatter={formatTooltipValue} />
        <Legend />
        {series?.length ? (
          series.map((item) => (
            <Line key={item.key} type="monotone" dataKey={item.key} stroke={item.color} strokeWidth={3} name={item.label} />
          ))
        ) : (
          <Line type="monotone" dataKey="value" stroke="#940b92" strokeWidth={3} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBar = () => (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatCompactNumber} />
        <Tooltip formatter={formatTooltipValue} />
        <Legend />
        {series?.length ? (
          series.map((item) => (
            <Bar key={item.key} dataKey={item.key} fill={item.color} name={item.label} />
          ))
        ) : (
          <Bar dataKey="value" name={metricLabel}>
            {data.map((item, index) => (
              <Cell key={`bar-${item.name ?? index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`bg-white border border-black rounded-3xl p-6 ${cardSizes[size]}`}>
      <h2 className="font-[Inter,sans-serif] text-2xl font-bold text-[#5f6f8a] mb-5">{title}</h2>

      {type === "donut" && renderDonut()}
      {type === "line" && renderLine()}
      {type === "bar" && renderBar()}
    </div>
  );
};
