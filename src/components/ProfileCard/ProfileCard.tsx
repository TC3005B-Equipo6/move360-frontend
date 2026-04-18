import styles from "./ProfileCard.module.css";

export interface ProfileCardProps {
  name: string;
  role: string;
  className?: string;
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

export const ProfileCard = ({ name, role, className = "" }: ProfileCardProps) => {
  const classes = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className={styles.avatar} style={{ backgroundColor: getAvatarColor(name) }}>
        <span className={styles.initials}>{getInitials(name)}</span>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.role}>{role}</p>
      </div>
    </div>
  );
};
