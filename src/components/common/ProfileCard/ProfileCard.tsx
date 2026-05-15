export interface ProfileCardProps {
  name: string;
  role?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** Additive: "compact" renders a dense chip suited for the header. */
  variant?: "default" | "compact";
}

const AVATAR_PALETTE = [
  "bg-primary",
  "bg-accent",
  "bg-success",
  "bg-info",
  "bg-danger",
  "bg-surface-inverse",
];

const getInitials = (name: string): string => {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "";
  if (tokens.length === 1) return tokens[0][0].toUpperCase();
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
};

const getAvatarClass = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
};

export const ProfileCard = ({
  name,
  role,
  className = "",
  onClick,
  variant = "default",
}: ProfileCardProps) => {
  const hasRole = Boolean(role?.trim());
  const compact = variant === "compact";

  const container = [
    "inline-flex items-center font-sans ring-1 ring-inset ring-border-subtle bg-surface-raised",
    compact
      ? "min-h-10 gap-2.5 rounded-md pl-1.5 pr-3 py-1"
      : "min-h-16 justify-center gap-3 rounded-lg px-4 py-3 shadow-xs",
    onClick
      ? "cursor-pointer transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-primary-subtle hover:shadow-sm active:scale-[0.96]"
      : "",
    className,
  ].filter(Boolean).join(" ");

  const avatar = [
    "flex shrink-0 items-center justify-center rounded-full",
    compact ? "h-7 w-7" : "h-11 w-11",
    getAvatarClass(name),
  ].join(" ");

  return (
    <div className={container} onClick={onClick}>
      <div className={avatar}>
        <span
          className={`text-white font-semibold whitespace-nowrap ${compact ? "text-[11px]" : "text-xs"}`}
        >
          {getInitials(name)}
        </span>
      </div>
      <div className="flex min-w-0 flex-col items-start gap-0.5 whitespace-nowrap leading-tight">
        <p
          className={`m-0 max-w-[180px] overflow-hidden text-ellipsis font-semibold text-content-primary ${
            compact ? "text-caption" : "text-body-sm"
          }`}
        >
          {name}
        </p>
        {hasRole && (
          <p
            className={`m-0 max-w-[180px] overflow-hidden text-ellipsis font-medium text-content-muted ${
              compact ? "text-[11px]" : "text-caption"
            }`}
          >
            {role}
          </p>
        )}
      </div>
    </div>
  );
};
