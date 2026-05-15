import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

// Loose tooltip payload row — recharts 3 doesn't export a stable TooltipProps shape.
interface TooltipRow {
  name?: string | number;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
}
interface ScTooltipProps {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
}

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
  type: "donut" | "line" | "bar" | "ranking";
  title?: string;
  /** Additive: secondary line rendered under the title (e.g. "Marzo 2025 – Febrero 2026"). */
  subtitle?: string;
  metricLabel?: string;
  data: ChartItem[];
  size?: "sm" | "md" | "lg";
  series?: SeriesItem[];
  /** Additive: render a loading skeleton instead of the chart. */
  isLoading?: boolean;
}

// Categorical series palette — sourced from design tokens (--chart-1..8).
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
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

const formatRankingNumber = (value: string | number | undefined) => {
  if (value === undefined) return "";
  return formatCompactNumber(value).replace(/([A-Za-z]+)$/, " $1");
};

const formatScalar = (value: string | number | undefined): string => {
  if (value === undefined) return "";
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? fullNumberFormatter.format(numericValue) : String(value);
};

const cardSizes: Record<string, string> = {
  sm: "w-[380px] h-[380px]",
  md: "w-[580px] h-[380px]",
  lg: "w-[980px] h-[380px]",
};

// Shared recharts styling derived from tokens.
const axisTick = { fill: "var(--chart-axis)", fontSize: 12 } as const;
const legendWrapperStyle = { fontSize: 13, color: "var(--text-secondary)" } as const;

// ScTooltip-style: colored dot + name header, then value rows.
const ScTooltip = ({ active, payload, label }: ScTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const headerColor = (payload[0]?.color as string) || "var(--chart-1)";
  return (
    <div
      style={{
        background: "var(--surface-overlay)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        padding: "10px 12px",
        fontSize: 12,
        color: "var(--text-primary)",
        minWidth: 140,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span
          aria-hidden="true"
          style={{ width: 8, height: 8, borderRadius: 9999, background: headerColor, display: "inline-block" }}
        />
        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {payload.map((row, index) => (
          <div
            key={`${row.dataKey ?? index}`}
            style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--text-secondary)" }}
          >
            <span>{row.name}</span>
            <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", fontWeight: 600 }}>
              {formatScalar(row.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Chart = ({
  type,
  title = "Chart",
  subtitle,
  metricLabel = "Valor",
  data,
  size = "md",
  series,
  isLoading = false,
}: ChartProps) => {
  const chartColors = getChartColors(title, data);
  const isEmpty = !data || data.length === 0;
  const headerHeight = subtitle ? 64 : 44;
  const bodyHeightStyle = { height: `calc(100% - ${headerHeight}px)` };

  const renderDonut = () => (
    <div
      className="grid grid-cols-[minmax(0,1fr)_150px] items-center gap-4 w-full overflow-hidden"
      style={bodyHeightStyle}
    >
      <div className="min-w-0 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="58%"
              outerRadius="86%"
              paddingAngle={4}
            >
              {data.map((item, index) => (
                <Cell
                  key={`slice-${item.name ?? index}`}
                  fill={chartColors[index % chartColors.length]}
                  stroke="var(--surface-raised)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<ScTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="min-w-0 flex flex-col gap-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="grid grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-2 text-content-secondary text-body-sm leading-tight"
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
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={axisTick} tickLine={false} stroke="var(--chart-grid)" />
        <YAxis tickFormatter={formatCompactNumber} tick={axisTick} tickLine={false} stroke="var(--chart-grid)" />
        <Tooltip content={<ScTooltip />} />
        <Legend wrapperStyle={legendWrapperStyle} />
        {series?.length ? (
          series.map((item) => (
            <Line
              key={item.key}
              type="linear"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={2}
              name={item.label}
              dot={{ r: 3, fill: item.color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))
        ) : (
          <Line
            type="linear"
            dataKey="value"
            stroke="var(--chart-1)"
            strokeWidth={2}
            name={metricLabel}
            dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBar = () => (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}>
        <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={axisTick} tickLine={false} stroke="var(--chart-grid)" />
        <YAxis tickFormatter={formatCompactNumber} tick={axisTick} tickLine={false} stroke="var(--chart-grid)" />
        <Tooltip content={<ScTooltip />} cursor={{ fill: "var(--surface-sunken)" }} />
        <Legend wrapperStyle={legendWrapperStyle} />
        {series?.length ? (
          series.map((item) => (
            <Bar key={item.key} dataKey={item.key} fill={item.color} name={item.label} radius={[4, 4, 0, 0]} />
          ))
        ) : (
          <Bar dataKey="value" name={metricLabel} radius={[4, 4, 0, 0]}>
            {data.map((item, index) => (
              <Cell key={`bar-${item.name ?? index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderRanking = () => {
    const maxValue = Math.max(...data.map((item) => Number(item.value) || 0), 0);

    return (
      <ol
        className="m-0 p-0 list-none flex flex-col justify-between gap-2 overflow-hidden"
        style={bodyHeightStyle}
      >
        {data.map((item, index) => {
          const value = Number(item.value) || 0;
          const width = maxValue > 0 ? `${Math.max((value / maxValue) * 100, 2)}%` : "0%";

          return (
            <li
              key={`${item.name ?? "ranking"}-${index}`}
              className="grid grid-cols-[28px_minmax(92px,140px)_minmax(120px,1fr)_86px] items-center gap-3 min-h-0"
            >
              <span className="tabular-nums text-[13px] font-semibold leading-none text-content-muted">
                {index + 1}
              </span>
              <span className="min-w-0 truncate text-[15px] font-semibold leading-tight text-content-primary">
                {item.name}
              </span>
              <span
                aria-hidden="true"
                className="block h-2.5 rounded-full bg-surface-sunken overflow-hidden"
              >
                <span
                  className="block h-full rounded-full bg-chart-1"
                  style={{ width }}
                />
              </span>
              <span className="tabular-nums text-right text-[13px] font-semibold leading-none text-content-secondary">
                {formatRankingNumber(item.value)}
              </span>
            </li>
          );
        })}
      </ol>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full" style={bodyHeightStyle}>
          <div className="w-full h-full rounded-md bg-surface-sunken animate-pulse" />
        </div>
      );
    }
    if (isEmpty) {
      return (
        <div
          className="flex flex-col items-center justify-center gap-1 w-full text-center"
          style={bodyHeightStyle}
        >
          <p className="m-0 text-body font-semibold text-content-secondary">Sin datos</p>
          <p className="m-0 text-body-sm text-content-muted">No hay información para mostrar.</p>
        </div>
      );
    }
    if (type === "donut") return renderDonut();
    if (type === "line") return renderLine();
    if (type === "ranking") return renderRanking();
    return renderBar();
  };

  return (
    <div className={`box-border overflow-hidden bg-surface-raised border border-subtle rounded-md shadow-sm p-5 ${cardSizes[size]}`}>
      <div className="mb-4">
        <h2 className="m-0 text-h3 font-bold text-content-primary leading-tight [text-wrap:balance]">{title}</h2>
        {subtitle && (
          <p className="m-0 mt-0.5 text-body-sm text-content-secondary leading-tight">{subtitle}</p>
        )}
      </div>
      {renderBody()}
    </div>
  );
};
