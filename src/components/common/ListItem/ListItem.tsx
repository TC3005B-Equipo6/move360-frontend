import type { ReactNode } from "react";
import { icons, type IconName } from "../../../icons";

export interface ListItemProps {
  title: string;
  // TODO: date comes pre-formatted from the caller for now. When the backend
  // contract is defined, change to Date/ISO string and format inside the component.
  date: string;
  author?: string;
  iconName: IconName;
  onPress?: () => void;
  // Optional trailing slot (e.g. an overflow menu). Rendered outside the main
  // clickable button so it can host its own interactive controls.
  actions?: ReactNode;
  className?: string;
}

export const ListItem = ({
  title,
  date,
  author,
  iconName,
  onPress,
  actions,
  className = "",
}: ListItemProps) => {
  const Icon = icons[iconName];
  const containerClasses = [
    "relative flex min-h-16 w-full items-center gap-3 rounded-lg border-0 bg-surface-raised px-5 py-3 font-sans shadow-xs ring-1 ring-inset ring-border-subtle",
    "transition-[background-color,box-shadow,color] duration-200 ease-out hover:bg-primary-subtle hover:shadow-sm",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      <button
        type="button"
        onClick={onPress}
        className="flex min-w-0 flex-1 items-center justify-between gap-4 border-0 bg-transparent p-0 text-left transition-transform duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99]"
      >
        <span className="inline-flex items-center gap-3 min-w-0 flex-1">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary">
            <Icon size={22} aria-hidden="true" />
          </span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-body-lg font-semibold capitalize text-content-primary">
            {title}
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-5">
          <span className="whitespace-nowrap text-body-sm font-semibold capitalize tabular-nums text-content-secondary">{date}</span>
          {author && (
            <span className="whitespace-nowrap text-body-sm font-medium capitalize text-content-muted">{author}</span>
          )}
        </span>
      </button>
      {actions && <span className="shrink-0">{actions}</span>}
    </div>
  );
};
