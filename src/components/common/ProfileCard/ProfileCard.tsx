export interface ProfileCardProps {
  name: string;
  role: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const AVATAR_PALETTE = [
  "#7e3e7d",
  "#3e607e",
  "#3e7e4f",
  "#7e6b3e",
  "#7e3e3e",
  "#4f3e7e",
];

const getInitials = (name: string): string => {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "";
  if (tokens.length === 1) return tokens[0][0].toUpperCase();
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
};

export const ProfileCard = ({ name, role, className = "", onClick }: ProfileCardProps) => {
  const classes = [
    "inline-flex items-center justify-center gap-2.5 px-5 bg-white rounded-[25px] font-[Inter,sans-serif] h-[100px] cursor-pointer",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} onClick={onClick}>
      <div
        className="flex items-center justify-center w-[50px] h-[50px] rounded-full shrink-0"
        style={{ backgroundColor: getAvatarColor(name) }}
      >
        <span className="text-white text-xs font-semibold whitespace-nowrap">{getInitials(name)}</span>
      </div>
      <div className="flex flex-col items-start gap-px uppercase whitespace-nowrap">
        <p className="m-0 text-[#111827] text-lg font-semibold">{name}</p>
        <p className="m-0 text-[#9ca3af] text-[15px] font-normal">{role}</p>
      </div>
    </div>
  );
};
