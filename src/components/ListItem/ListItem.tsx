import { icons, type IconName } from "../../icons";

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
    "flex items-center justify-between w-full px-[25px] py-[10px] bg-[#f0f4fa] border-0 rounded-lg cursor-pointer font-[Inter,sans-serif] transition-colors duration-150 text-left hover:bg-[#dde6f2] active:bg-[#a8bcd8]",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button type="button" onClick={onPress} className={classes}>
      <span className="inline-flex items-center gap-3 min-w-0 flex-1">
        <Icon size={32} className="text-[#0f3460] shrink-0" />
        <span className="text-[#0f3460] text-[30px] font-medium capitalize overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </span>
      </span>
      <span className="inline-flex items-center gap-5 shrink-0">
        <span className="text-[#0f3460] text-[30px] font-medium capitalize whitespace-nowrap">{date}</span>
        <span className="text-[#64748b] text-[25px] font-medium capitalize whitespace-nowrap">{author}</span>
      </span>
    </button>
  );
};
