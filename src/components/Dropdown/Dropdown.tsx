import styles from "./Dropdown.module.css";
import { icons } from "../../icons";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const SelectField = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className = "",
}: SelectFieldProps) => {
  const ChevronDown = icons.chevronDown;

  const classes = [styles.wrapper, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <label className={styles.label}>{label}</label>

      <div className={styles.container}>
        <select
          className={styles.select}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className={styles.icon}>
          <ChevronDown size={32} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
};