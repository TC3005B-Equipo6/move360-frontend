// Showcase Variant C · "Enfoque ✦" — RECOMENDADO: layout Enfoque + paleta Cívico.
// Throwaway prototype (Phase 1). Identity comes from [data-sc-variant="focus"].

import { useState } from "react";
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

export default function VariantFocus() {
  const rankMax = Math.max(...rankingData.map((r) => r.value));
  const [railOpen, setRailOpen] = useState(true);

  return (
    <div
      data-sc-variant="focus"
      className="flex h-full overflow-hidden bg-[var(--sc-bg)] text-[var(--sc-ink)]"
      style={{ fontFamily: "var(--sc-font)" }}
    >
      {/* ── Icon rail — click-toggle, independent of the dashboard scroll ──── */}
      <aside
        className={`sc-rail ${
          railOpen ? "sc-rail--open" : ""
        } shrink-0 flex flex-col h-full bg-[var(--sc-surface)] border-r border-[var(--sc-border)] overflow-hidden py-4`}
      >
        {/* Toggle + wordmark — wordmark only shows when expanded */}
        <div className="flex items-center gap-2 h-10 px-3 mb-6">
          <button
            type="button"
            onClick={() => setRailOpen((v) => !v)}
            aria-label={railOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid place-items-center w-10 h-10 shrink-0 text-[var(--sc-ink-2)] cursor-pointer transition-[transform,background-color] duration-150 active:scale-[0.96] hover:bg-[var(--sc-surface-2)]"
            style={{ borderRadius: "var(--sc-radius-sm)" }}
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block w-[18px] h-[2px] rounded-full bg-current" />
              <span className="block w-[18px] h-[2px] rounded-full bg-current" />
              <span className="block w-[18px] h-[2px] rounded-full bg-current" />
            </span>
          </button>
          <img
            src="/move360.png"
            alt="Move360"
            className="sc-rail-label sc-rail-wordmark h-5 w-auto shrink-0"
          />
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-3 h-11 px-2.5 cursor-pointer transition-colors duration-150"
              style={{
                borderRadius: "var(--sc-radius-sm)",
                background: item.active ? "var(--sc-primary)" : "transparent",
                color: item.active ? "var(--sc-primary-ink)" : "var(--sc-ink-2)",
              }}
            >
              <span className="grid place-items-center w-6 shrink-0">
                <ScNavIcon name={item.icon} />
              </span>
              <span className="sc-rail-label text-[14px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 px-3 pt-3">
          {/* Profile lives in the header; the rail only carries navigation + logout */}
          <button
            type="button"
            className="flex items-center gap-3 h-11 px-2.5 text-[var(--sc-ink-2)] cursor-pointer"
            style={{ borderRadius: "var(--sc-radius-sm)" }}
          >
            <span className="grid place-items-center w-6 shrink-0">
              <ScNavIcon name="logout" />
            </span>
            <span className="sc-rail-label text-[14px] font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Main — scrolls independently from the rail ───────────────────── */}
      <main
        className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col"
        style={{
          padding: "var(--sc-gap) 6px",
          gap: "var(--sc-gap)",
        }}
      >
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold leading-tight" style={{ textWrap: "balance" }}>
              Panorama de movilidad
            </h1>
            <p className="mt-0.5 text-[13px] text-[var(--sc-ink-2)]">
              Marzo 2025 – Febrero 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ScButton icon="plus">Nuevo dashboard</ScButton>
            <span
              className="grid place-items-center w-10 h-10 text-[var(--sc-ink-2)] cursor-pointer"
              style={{ borderRadius: "var(--sc-radius-sm)", border: "1px solid var(--sc-border)" }}
            >
              <ScNavIcon name="settings" size={18} />
            </span>
            {/* User profile — name + role always visible */}
            <div
              className="flex items-center gap-2.5 h-10 pl-1.5 pr-3"
              style={{ borderRadius: "var(--sc-radius-sm)", border: "1px solid var(--sc-border)" }}
            >
              <span
                className="grid place-items-center w-7 h-7 shrink-0 rounded-full text-[11px] font-bold text-[var(--sc-primary-ink)]"
                style={{ background: "var(--sc-primary)" }}
              >
                AG
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[12px] font-semibold text-[var(--sc-ink)]">
                  Andrés García
                </span>
                <span className="text-[11px] text-[var(--sc-ink-3)]">
                  Analista de movilidad
                </span>
              </span>
            </div>
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
            >
              <ScChartFrame>
                <ScLineChart data={monthlyData} />
              </ScChartFrame>
            </ScCard>

            <ScCard className="sc-span-chart-md" title="Tipo de pago" subtitle="Distribución">
              <ScChartFrame>
                <ScDonutChart data={paymentData} />
              </ScChartFrame>
            </ScCard>

            <ScCard className="sc-span-chart-md" title="Afluencia por sistema" subtitle="Acumulado del periodo">
              <ScChartFrame>
                <ScBarChart data={systemData} />
              </ScChartFrame>
            </ScCard>

            <ScCard className="sc-span-chart-md" title="Top 10 líneas" subtitle="Periodo completo">
              <ul className="flex flex-col gap-2.5 pt-1">
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
