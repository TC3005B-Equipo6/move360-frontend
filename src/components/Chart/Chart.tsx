import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend} from "recharts";
import styles from "./Chart.module.css";

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
];

export const Chart = ({
  type,
  title = "Chart",
  data,
  size = "md",
  series,
}: ChartProps) => {
  const renderDonut = () => (
    <div className={styles.donutLayout}>
      <div className={styles.chartArea}>
        <ResponsiveContainer width="130%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={size === "sm" ? 38 : 75}
              outerRadius={size === "sm" ? 70 : 120}
              paddingAngle={4}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={item.name} className={styles.row}>
            <span
              className={styles.dot}
              style={{
                backgroundColor:
                  COLORS[index % COLORS.length],
              }}
            />
            <span>{item.name}</span>
            <span>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLine = () => (
    <ResponsiveContainer width="100%" height="85%">
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {series?.length ? (
          series.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={3}
              name={item.label}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey="value"
            stroke="#940b92"
            strokeWidth={3}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBar = () => (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {series?.length ? (
          series.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={item.color}
              name={item.label}
            />
          ))
        ) : (
          <Bar
            dataKey="value"
            fill="#72c8f3"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`${styles.card} ${styles[size]}`}>
      <h2 className={styles.title}>{title}</h2>

      {type === "donut" && renderDonut()}
      {type === "line" && renderLine()}
      {type === "bar" && renderBar()}
    </div>
  );
};