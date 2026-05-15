export interface ProfileCardProps {
  name: string;
  role?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
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

export const ProfileCard = ({ name, role, className = "", onClick }: ProfileCardProps) => {
  const hasRole = Boolean(role?.trim());
  const classes = [
    "inline-flex min-h-16 items-center justify-center gap-3 rounded-lg bg-surface-raised px-4 py-3 font-sans shadow-xs ring-1 ring-inset ring-border-subtle",
    onClick ? "cursor-pointer transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-primary-subtle hover:shadow-sm active:scale-[0.96]" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getAvatarClass(name)}`}>
        <span className="text-white text-xs font-semibold whitespace-nowrap">{getInitials(name)}</span>
      </div>
      <div className="flex min-w-0 flex-col items-start gap-0.5 whitespace-nowrap">
        <p className="m-0 max-w-[180px] overflow-hidden text-ellipsis text-body-sm font-semibold text-content-primary">{name}</p>
        {hasRole && (
          <p className="m-0 max-w-[180px] overflow-hidden text-ellipsis text-caption font-medium text-content-muted">
            {role}
          </p>
        )}
      </div>
    </div>
  );
};
