// Showcase Variant A · "Cívico" — institutional, airy, left sidebar.
// Throwaway prototype (Phase 1). Identity comes from [data-sc-variant="civic"].

import {
  ScCard,
  ScKpi,
  ScChartFrame,
  ScLineChart,
  ScBarChart,
  ScDonutChart,
  ScRankRow,
  ScNavIcon,
  ScButton,
} from "../parts";
import {
  kpis,
  monthlyData,
  systemData,
  paymentData,
  rankingData,
} from "../showcaseData";
import type { IconName } from "../../../icons";

const NAV: { icon: IconName; label: string; active?: boolean }[] = [
  { icon: "home", label: "Inicio", active: true },
  { icon: "piechart", label: "Dashboards" },
  { icon: "explore", label: "Explorar" },
  { icon: "file", label: "Reportes" },
  { icon: "star", label: "Favoritos" },
];

export default function VariantCivic() {
  const rankMax = Math.max(...rankingData.map((r) => r.value));

  return (
    <div
      data-sc-variant="civic"
      className="flex min-h-full bg-[var(--sc-bg)] text-[var(--sc-ink)]"
      style={{ fontFamily: "var(--sc-font)" }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className="shrink-0 flex flex-col bg-[var(--sc-surface)] border-r border-[var(--sc-border)]"
        style={{ width: 248, padding: "var(--sc-pad)" }}
      >
        <img src="/move360.png" alt="Move360" className="h-7 w-auto self-start mb-8" />
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-3 h-11 px-3 text-[14px] font-medium cursor-pointer transition-colors duration-150"
              style={{
                borderRadius: "var(--sc-radius-sm)",
                background: item.active ? "var(--sc-primary)" : "transparent",
                color: item.active ? "var(--sc-primary-ink)" : "var(--sc-ink-2)",
              }}
            >
              <ScNavIcon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pt-6">
          <button
            type="button"
            className="flex items-center gap-3 h-11 px-3 text-[14px] font-medium text-[var(--sc-ink-2)] cursor-pointer"
            style={{ borderRadius: "var(--sc-radius-sm)" }}
          >
            <ScNavIcon name="help" />
            Ayuda
          </button>
          <div
            className="flex items-center gap-3 mt-2 p-2"
            style={{ borderRadius: "var(--sc-radius-sm)", background: "var(--sc-surface-2)" }}
          >
            <span
              className="grid place-items-center w-9 h-9 rounded-full text-[13px] font-bold text-[var(--sc-primary-ink)]"
              style={{ background: "var(--sc-primary)" }}
            >
              AG
            </span>
            <span className="text-[13px] font-semibold leading-tight">Andrés García</span>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col" style={{ padding: "var(--sc-gap)", gap: "var(--sc-gap)" }}>
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold leading-tight" style={{ textWrap: "balance" }}>
              Panorama de movilidad
            </h1>
            <p className="mt-1 text-[14px] text-[var(--sc-ink-2)]">
              Afluencia consolidada · Marzo 2025 – Febrero 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ScButton variant="ghost" icon="calendar">
              Periodo
            </ScButton>
            <ScButton icon="plus">Nuevo dashboard</ScButton>
          </div>
        </header>

        <div className="sc-grid-scroll">
          <div className="sc-dashboard-grid">
            {kpis.map((k) => (
              <ScKpi key={k.label} className="sc-span-indicator" {...k} />
            ))}

            <ScCard
              className="sc-span-chart-md"
              title="Afluencia mensual del sistema"
              subtitle="Validaciones totales por mes"
              actions={<ScButton variant="ghost">Exportar</ScButton>}
            >
              <ScChartFrame>
                <ScLineChart data={monthlyData} />
              </ScChartFrame>
            </ScCard>

            <ScCard className="sc-span-chart-md" title="Afluencia por sistema" subtitle="Acumulado del periodo">
              <ScChartFrame>
                <ScBarChart data={systemData} />
              </ScChartFrame>
            </ScCard>
            <ScCard className="sc-span-chart-md" title="Tipo de pago" subtitle="Distribución de validaciones">
              <ScChartFrame>
                <ScDonutChart data={paymentData} />
              </ScChartFrame>
            </ScCard>

            <ScCard className="sc-span-chart-md" title="Top 10 líneas por afluencia" subtitle="Periodo completo">
              <ul className="flex flex-col gap-3 pt-1">
                {rankingData.map((r, i) => (
                  <ScRankRow key={r.name} rank={i + 1} name={r.name} value={r.value} max={rankMax} />
                ))}
              </ul>
            </ScCard>
          </div>
        </div>
      </main>
    </div>
  );
}
