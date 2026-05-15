// Showcase — Phase 1 of the redesign.
// A non-destructive /showcase route presenting 3 switchable variants. Each pairs
// an IDENTITY (palette / type / radius / shadow / density) with a LAYOUT
// (nav pattern + density) so the official visual language can be chosen.
//
// The variants are throwaway prototypes — they do NOT use the real component
// library. This route is kept permanently as a living style reference.

import { useState } from "react";
import "./showcase.css";
import VariantCivic from "./variants/VariantCivic";
import VariantConsole from "./variants/VariantConsole";
import VariantFocus from "./variants/VariantFocus";

type VariantId = "civic" | "console" | "focus";

const VARIANTS: {
  id: VariantId;
  name: string;
  identity: string;
  layout: string;
  render: () => React.ReactElement;
}[] = [
  {
    id: "civic",
    name: "Cívico",
    identity: "Azul institucional · acento ámbar · radios suaves · sombras difusas",
    layout: "Sidebar izquierdo · densidad aireada",
    render: () => <VariantCivic />,
  },
  {
    id: "console",
    name: "Consola",
    identity: "Índigo + cian · radios mínimos · bordes nítidos · poca sombra",
    layout: "Barra superior · densidad compacta",
    render: () => <VariantConsole />,
  },
  {
    id: "focus",
    name: "Enfoque ✦",
    identity: "Paleta Cívico (azul institucional + ámbar) · radios medios · sombra en capas",
    layout: "Rail de iconos colapsable · densidad media · perfil con nombre y rol",
    render: () => <VariantFocus />,
  },
];

export default function Showcase() {
  const [active, setActive] = useState<VariantId>("focus");
  const current = VARIANTS.find((v) => v.id === active)!;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      {/* ── Meta toolbar (neutral chrome — not part of any variant) ───────── */}
      <header className="shrink-0 flex items-center gap-5 h-14 px-5 bg-white border-b border-slate-200">
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold text-slate-800">Showcase de identidad</span>
          <span className="text-[11px] text-slate-500">Elige el lenguaje visual oficial · Fase 1</span>
        </div>

        {/* Segmented toggle (prototyped — not the real SegmentedControl) */}
        <div className="flex p-1 rounded-xl bg-slate-100">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className={`px-3.5 h-9 rounded-lg text-[13px] font-semibold cursor-pointer transition-[background-color,color] duration-150 ${
                active === v.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-col items-end leading-tight text-right">
          <span className="text-[12px] font-semibold text-slate-700">{current.identity}</span>
          <span className="text-[11px] text-slate-500">{current.layout}</span>
        </div>
      </header>

      {/* ── Active variant ───────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-auto">{current.render()}</div>
    </div>
  );
}
