import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

const COLORS = ["#0b4d94", "#ef2b2d", "#78d7fd", "#9cc52b", "#ff7f18"];

const cardSizes: Record<string, string> = {
  sm: "w-[380px] h-[380px]",
  md: "w-[580px] h-[380px]",
  lg: "w-[980px] h-[380px]",
};

export const Chart = ({ type, title = "Chart", data, size = "md", series }: ChartProps) => {
  const renderDonut = () => (
    <div className="flex items-center justify-between w-full h-[calc(100%-50px)] gap-2.5">
      <div className="w-[52%] h-full">
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

      <div className="w-[44%] flex flex-col gap-2.5 font-[Inter,sans-serif]">
        {data.map((item, index) => (
          <div key={item.name} className="flex justify-between items-center text-[#885f8a] text-base">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
        <YAxis />
        <Tooltip />
        <Legend />
        {series?.length ? (
          series.map((item) => (
            <Bar key={item.key} dataKey={item.key} fill={item.color} name={item.label} />
          ))
        ) : (
          <Bar dataKey="value" fill="#72c8f3" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className={`bg-[#eef2f7] rounded-3xl p-6 ${cardSizes[size]}`}>
      <h2 className="font-[Inter,sans-serif] text-2xl font-bold text-[#5f6f8a] mb-5">{title}</h2>

      {type === "donut" && renderDonut()}
      {type === "line" && renderLine()}
      {type === "bar" && renderBar()}
    </div>
  );
};
