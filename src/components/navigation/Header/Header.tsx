import type { ReactNode } from "react";
import { IconButton } from "../../common/IconButton/IconButton";

export type HeaderProps = {
  title: string;
  /** Additive: secondary line rendered under the title. */
  subtitle?: string;
  /** Additive: action controls rendered on the right (e.g. buttons). */
  actions?: ReactNode;
  /** Additive: profile chip rendered on the far right. */
  profile?: ReactNode;
  showReport?: boolean;
  showSettings?: boolean;
};

export function Header({
  title = "Hola",
  subtitle,
  actions,
  profile,
  showReport = false,
  showSettings = false,
}: HeaderProps) {
  const hasRight = Boolean(actions || profile || showReport || showSettings);

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="min-w-0">
        <h1 className="m-0 text-h2 font-bold leading-tight text-content-primary [text-wrap:balance]">
          {title}
        </h1>
        {subtitle && (
          <p className="m-0 mt-0.5 text-body-sm text-content-secondary leading-tight">{subtitle}</p>
        )}
      </div>

      {hasRight && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
          {(showReport || showSettings) && (
            <div className="flex gap-[25px]">
              {showReport && <IconButton size="large" iconName="report" label="Reporte" color="secondary" />}
              {showSettings && <IconButton size="small" iconName="settings" label="" color="secondary" />}
            </div>
          )}
          {profile}
        </div>
      )}
    </div>
  );
}
