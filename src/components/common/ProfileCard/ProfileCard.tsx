export interface ProfileCardProps {
  name: string;
  role?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  /** Additive: "compact" renders a dense chip suited for the header. */
  variant?: "default" | "compact";
}

const AVATAR_PALETTE = [
  "bg-primary text-content-on-primary",
  "bg-accent text-content-on-primary",
  "bg-success text-content-on-primary",
  "bg-info text-content-on-primary",
  "bg-danger text-content-on-primary",
  "bg-surface-inverse text-content-on-inverse",
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
  isLoading = false,
  variant = "default",
}: ProfileCardProps) => {
  const hasRole = Boolean(role?.trim());
  const compact = variant === "compact";

  const container = [
    "inline-flex items-center box-border font-sans bg-surface-raised ring-1 ring-inset ring-border-strong shadow-sm",
    compact
      ? "h-14 min-w-[148px] max-w-[260px] gap-3 rounded-xl px-3 py-2 shadow-xs"
      : "min-h-20 justify-center gap-3 rounded-xl px-4 py-3 shadow-xs",
    onClick
      ? "cursor-pointer transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-primary-subtle hover:shadow-sm active:scale-[0.96]"
      : "",
    className,
  ].filter(Boolean).join(" ");

  const avatar = [
    "flex shrink-0 items-center justify-center rounded-full shadow-xs",
    compact ? "h-9 w-9" : "h-12 w-12",
    getAvatarClass(name),
  ].join(" ");

  if (isLoading) {
    return (
      <div className={container} aria-busy="true" aria-label="Cargando perfil">
        <div
          className={`shrink-0 rounded-full bg-surface-sunken animate-pulse ${
            compact ? "h-9 w-9" : "h-12 w-12"
          }`}
        />
        <div
          className={`flex min-w-0 flex-col items-start justify-center leading-tight ${
            compact ? "" : "gap-1"
          }`}
        >
          <span className="h-4 w-20 rounded-sm bg-surface-sunken animate-pulse" />
          <span className="h-3 w-28 rounded-sm bg-surface-sunken animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={container} onClick={onClick}>
      <div className={avatar}>
        <span
          className={`font-semibold whitespace-nowrap ${compact ? "text-caption" : "text-body-sm"}`}
        >
          {getInitials(name)}
        </span>
      </div>
      <div
        className={`flex min-w-0 flex-col items-start justify-center whitespace-nowrap leading-tight ${
          compact ? "" : "gap-1"
        }`}
      >
        <p
          className={`m-0 w-full overflow-hidden text-ellipsis font-semibold text-content-primary ${
            compact ? "text-body-sm" : "text-body"
          }`}
          title={name}
        >
          {name}
        </p>
        <p
          className={`m-0 w-full overflow-hidden text-ellipsis font-medium text-content-muted ${
            compact ? "text-caption" : "text-body-sm"
          } ${hasRole ? "" : "invisible"}`}
          title={hasRole ? role : undefined}
        >
          {hasRole ? role : "Rol"}
        </p>
      </div>
    </div>
  );
};
