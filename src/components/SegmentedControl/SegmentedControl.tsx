import { useState } from "react";
import styles from "./SegmentedControl.module.css";

type Option = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

interface Props {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

const SegmentedControl: React.FC<Props> = ({
  options,
  value,
  onChange,
}) => {
  const [selected, setSelected] = useState(value || options[0]?.value);

  const selectedIndex = options.findIndex((o) => o.value === selected);

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>TIPO</span>

      <div className={styles.segmented}>
        <div
          className={styles.slider}
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />

        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.segment} ${
              selected === option.value ? styles.active : ""
            }`}
            onClick={() => handleSelect(option.value)}
          >
            {option.icon && (
              <span className={styles.icon}>{option.icon}</span>
            )}
            <span className={styles.label}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;