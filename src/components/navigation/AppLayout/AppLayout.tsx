import { useState, type ReactNode } from "react";
import { Sidebar } from "../SideBar/SideBar";

export interface AppLayoutProps {
  /** Optional header slot — composed per screen (e.g. <Header .../>). */
  header?: ReactNode;
  children: ReactNode;
  className?: string;
}

// Rail collapsed state persists across navigation and reloads.
const STORAGE_KEY = "move360:rail-collapsed";

const readCollapsed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const AppLayout = ({ header, children, className = "" }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);

  const toggleRail = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // localStorage unavailable — keep in-memory state only.
      }
      return next;
    });
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-surface-base ${className}`}>
      <Sidebar collapsed={collapsed} onToggle={toggleRail} />
      <main className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col gap-[22px] py-[22px] px-[6px]">
        {header && <header className="shrink-0">{header}</header>}
        <div className="flex-1 min-h-0">{children}</div>
      </main>
    </div>
  );
};
