// Showcase — shared throwaway building blocks (Phase 1 prototype).
// These consume the scoped --sc-* identity tokens, so the SAME parts render with
// each variant's palette / radius / shadow / density. NOT the real components.

import type { CSSProperties, ReactNode } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { icons, type IconName } from "../../icons";
import { formatCompact, formatFull } from "./showcaseData";

const SERIES = ["var(--sc-c1)", "var(--sc-c2)", "var(--sc-c3)", "var(--sc-c4)", "var(--sc-c5)"];

/* ── Card shell ───────────────────────────────────────────────────────────── */
export function ScCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
  style,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={`flex flex-col h-full min-h-0 bg-[var(--sc-surface)] border border-[var(--sc-border)] ${className}`}
      style={{
        borderRadius: "var(--sc-radius)",
        boxShadow: "var(--sc-shadow)",
        padding: "var(--sc-pad)",
        gap: "calc(var(--sc-pad) * 0.6)",
        ...style,
      }}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3
                className="text-[15px] font-semibold text-[var(--sc-ink)] leading-tight"
                style={{ textWrap: "balance" }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[12px] text-[var(--sc-ink-3)] leading-tight">{subtitle}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function ScChartFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`sc-chart-frame ${className}`}>{children}</div>;
}

/* ── KPI tile ─────────────────────────────────────────────────────────────── */
export function ScKpi({
  label,
  value,
  unit,
  delta,
  className = "",
  style,
}: {
  label: string;
  value: string;
  unit?: string;
  delta: number;
  className?: string;
  style?: CSSProperties;
}) {
  const up = delta >= 0;
  const classes = [
    "flex flex-col justify-between h-full min-h-0 bg-[var(--sc-surface)] border border-[var(--sc-border)]",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      style={{
        borderRadius: "var(--sc-radius)",
        boxShadow: "var(--sc-shadow)",
        padding: "var(--sc-pad)",
        ...style,
      }}
    >
      <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--sc-ink-3)]">
        {label}
      </span>
      <div className="mt-2 flex items-end gap-1.5">
        <span className="sc-num text-[30px] font-bold leading-none text-[var(--sc-ink)]">
          {value}
        </span>
        {unit && <span className="text-[14px] font-semibold text-[var(--sc-ink-2)] pb-0.5">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-1">
        <span
          className="sc-num text-[12px] font-semibold"
          style={{ color: up ? "var(--sc-pos)" : "var(--sc-neg)" }}
        >
          {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)} pp
        </span>
        <span className="text-[11px] text-[var(--sc-ink-3)]">vs. periodo previo</span>
      </div>
    </div>
  );
}

/* ── Tooltip ──────────────────────────────────────────────────────────────── */
interface TipPayload {
  name?: string;
  value?: number;
  color?: string;
  payload?: { name?: string };
}
function ScTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-[var(--sc-surface)] border border-[var(--sc-border)] px-3 py-2"
      style={{ borderRadius: "var(--sc-radius-sm)", boxShadow: "var(--sc-shadow)" }}
    >
      <p className="text-[11px] font-semibold text-[var(--sc-ink-2)] mb-1">
        {label ?? payload[0]?.payload?.name}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="sc-num text-[12px] text-[var(--sc-ink)] flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          {formatFull(p.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

const axisTick = { fill: "var(--sc-ink-3)", fontSize: 11 };

/* ── Line chart ───────────────────────────────────────────────────────────── */
export function ScLineChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--sc-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--sc-border)" }} />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={formatCompact}
        />
        <Tooltip content={<ScTooltip />} cursor={{ stroke: "var(--sc-border)" }} />
        <Line
          type="linear"
          dataKey="value"
          stroke="var(--sc-c1)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--sc-c1)", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "var(--sc-c1)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Bar chart ────────────────────────────────────────────────────────────── */
export function ScBarChart({
  data,
  layout = "horizontal",
}: {
  data: { name: string; value: number }[];
  layout?: "horizontal" | "vertical";
}) {
  const vertical = layout === "vertical";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 16, right: 12, bottom: 0, left: vertical ? 8 : 0 }}
      >
        <CartesianGrid
          stroke="var(--sc-border)"
          strokeDasharray="3 3"
          horizontal={!vertical}
          vertical={vertical}
        />
        {vertical ? (
          <>
            <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
            <YAxis
              type="category"
              dataKey="name"
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: "var(--sc-border)" }}
              width={92}
            />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--sc-border)" }} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={56} tickFormatter={formatCompact} />
          </>
        )}
        <Tooltip content={<ScTooltip />} cursor={{ fill: "var(--sc-surface-2)" }} />
        <Bar dataKey="value" radius={vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={vertical ? 18 : 42}>
          {data.map((_, i) => (
            <Cell key={i} fill={SERIES[i % SERIES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Donut chart ──────────────────────────────────────────────────────────── */
export function ScDonutChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="flex items-center gap-4 h-full">
      <div className="flex-1 h-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="86%"
              paddingAngle={3}
              stroke="var(--sc-surface)"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={SERIES[i % SERIES.length]} />
              ))}
            </Pie>
            <Tooltip content={<ScTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-2 shrink-0">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: SERIES[i % SERIES.length] }}
            />
            <span className="text-[var(--sc-ink-2)]">{d.name}</span>
            <span className="sc-num font-semibold text-[var(--sc-ink)]">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Ranking row ──────────────────────────────────────────────────────────── */
export function ScRankRow({
  rank,
  name,
  value,
  max,
}: {
  rank: number;
  name: string;
  value: number;
  max: number;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="sc-num w-5 text-[12px] font-semibold text-[var(--sc-ink-3)]">{rank}</span>
      <span className="w-28 shrink-0 text-[13px] font-medium text-[var(--sc-ink)]">{name}</span>
      <span className="flex-1 h-2 rounded-full bg-[var(--sc-surface-2)] overflow-hidden">
        <span
          className="block h-full rounded-full"
          style={{ width: `${(value / max) * 100}%`, background: "var(--sc-c1)" }}
        />
      </span>
      <span className="sc-num w-20 text-right text-[12px] font-semibold text-[var(--sc-ink-2)]">
        {formatCompact(value)}
      </span>
    </li>
  );
}

/* ── Nav item (used by sidebar / topbar / rail) ───────────────────────────── */
export function ScNavIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const Icon = icons[name];
  return <Icon size={size} />;
}

/* ── Pill button ──────────────────────────────────────────────────────────── */
export function ScButton({
  children,
  variant = "primary",
  icon,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: IconName;
}) {
  const primary = variant === "primary";
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 px-3.5 h-10 text-[13px] font-semibold cursor-pointer transition-[transform,background-color] duration-150 active:scale-[0.96]"
      style={{
        borderRadius: "var(--sc-radius-sm)",
        background: primary ? "var(--sc-primary)" : "transparent",
        color: primary ? "var(--sc-primary-ink)" : "var(--sc-ink-2)",
        border: primary ? "none" : "1px solid var(--sc-border)",
      }}
    >
      {icon && <ScNavIcon name={icon} size={16} />}
      {children}
    </button>
  );
}
