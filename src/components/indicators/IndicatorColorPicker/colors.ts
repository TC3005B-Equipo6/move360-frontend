// Aligned to semantic state tokens (success / danger / warning).
export const colorOptions = {
  green: {
    background: "var(--success-subtle)",
    text: "var(--success)",
  },
  red: {
    background: "var(--danger-subtle)",
    text: "var(--danger)",
  },
  yellow: {
    background: "var(--warning-subtle)",
    text: "var(--warning)",
  },
};

export type ColorKey = keyof typeof colorOptions;
