import { icons, type IconName } from "../../../icons";

export interface ListItemProps {
  title: string;
  // TODO: date comes pre-formatted from the caller for now. When the backend
  // contract is defined, change to Date/ISO string and format inside the component.
  date: string;
  author: string;
  iconName: IconName;
  onPress?: () => void;
  className?: string;
}

export const ListItem = ({
  title,
  date,
  author,
  iconName,
  onPress,
  className = "",
}: ListItemProps) => {
  const Icon = icons[iconName];
  const classes = [
    "flex min-h-16 w-full items-center justify-between gap-4 rounded-lg border-0 bg-surface-raised px-5 py-3 text-left font-sans shadow-xs ring-1 ring-inset ring-border-subtle",
    "transition-[background-color,box-shadow,color,transform] duration-200 ease-out hover:bg-primary-subtle hover:shadow-sm",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button type="button" onClick={onPress} className={classes}>
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
        <span className="whitespace-nowrap text-body-sm font-medium capitalize text-content-muted">{author}</span>
      </span>
    </button>
  );
};
