// Showcase Variant B · "Consola" — sharp analyst console, compact, top bar.
// Throwaway prototype (Phase 1). Identity comes from [data-sc-variant="console"].

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

const TABS = ["Inicio", "Dashboards", "Explorar", "Reportes"];

export default function VariantConsole() {
  const rankMax = Math.max(...rankingData.map((r) => r.value));

  return (
    <div
      data-sc-variant="console"
      className="flex flex-col min-h-full bg-[var(--sc-bg)] text-[var(--sc-ink)]"
      style={{ fontFamily: "var(--sc-font)" }}
    >
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center gap-6 h-14 px-5 bg-[var(--sc-surface)] border-b border-[var(--sc-border)]">
        <img src="/move360.png" alt="Move360" className="h-6 w-auto" />
        <nav className="flex items-center gap-1">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              className="h-9 px-3 text-[13px] font-semibold cursor-pointer transition-colors duration-150"
              style={{
                borderRadius: "var(--sc-radius-sm)",
                background: i === 0 ? "var(--sc-primary)" : "transparent",
                color: i === 0 ? "var(--sc-primary-ink)" : "var(--sc-ink-2)",
              }}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="grid place-items-center w-9 h-9 text-[var(--sc-ink-2)] cursor-pointer"
            style={{ borderRadius: "var(--sc-radius-sm)", border: "1px solid var(--sc-border)" }}
          >
            <ScNavIcon name="search" size={16} />
          </button>
          <button
            type="button"
            className="grid place-items-center w-9 h-9 text-[var(--sc-ink-2)] cursor-pointer"
            style={{ borderRadius: "var(--sc-radius-sm)", border: "1px solid var(--sc-border)" }}
          >
            <ScNavIcon name="settings" size={16} />
          </button>
          <span
            className="grid place-items-center w-9 h-9 rounded-full text-[12px] font-bold text-[var(--sc-primary-ink)]"
            style={{ background: "var(--sc-primary)" }}
          >
            AG
          </span>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col" style={{ padding: "var(--sc-gap)", gap: "var(--sc-gap)" }}>
        {/* Sub-header / filter strip */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] text-[var(--sc-ink-3)]">Dashboards /</span>
            <h1 className="text-[19px] font-bold leading-tight">Panorama de movilidad</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center h-9 px-3 text-[12px] font-medium text-[var(--sc-ink-2)]"
              style={{ borderRadius: "var(--sc-radius-sm)", border: "1px solid var(--sc-border)" }}
            >
              Mar 2025 – Feb 2026
            </span>
            <span
              className="inline-flex items-center h-9 px-3 text-[12px] font-medium text-[var(--sc-ink-2)]"
              style={{ borderRadius: "var(--sc-radius-sm)", border: "1px solid var(--sc-border)" }}
            >
              SEMOVI
            </span>
            <ScButton icon="plus">Indicador</ScButton>
          </div>
        </div>

        {/* KPI row — compact, 6 across */}
        <div className="sc-grid-scroll">
          <div className="sc-dashboard-grid">
            {kpis.map((k) => (
              <ScKpi key={k.label} className="sc-span-indicator" {...k} />
            ))}

            <ScCard
              className="sc-span-chart-lg"
              title="Afluencia mensual del sistema"
              subtitle="Validaciones totales por mes"
            >
              <ScChartFrame>
                <ScLineChart data={monthlyData} />
              </ScChartFrame>
            </ScCard>

            <ScCard className="sc-span-chart-sm" title="Afluencia por sistema">
              <ScChartFrame>
                <ScBarChart data={systemData} />
              </ScChartFrame>
            </ScCard>
            <ScCard className="sc-span-chart-sm" title="Tipo de pago">
              <ScChartFrame>
                <ScDonutChart data={paymentData} />
              </ScChartFrame>
            </ScCard>
            <ScCard className="sc-span-chart-sm" title="Top líneas por afluencia">
              <ul className="flex flex-col gap-2 pt-0.5">
                {rankingData.slice(0, 6).map((r, i) => (
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
