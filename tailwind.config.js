/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'], // prepared for future; not used now
  theme: {
    extend: {
      colors: {
        surface: {
          base: "var(--surface-base)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
          overlay: "var(--surface-overlay)",
          inverse: "var(--surface-inverse)",
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          "on-primary": "var(--text-on-primary)",
          "on-inverse": "var(--text-on-inverse)",
        },
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          subtle: "var(--primary-subtle)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
        },
        success: { DEFAULT: "var(--success)", subtle: "var(--success-subtle)" },
        danger: { DEFAULT: "var(--danger)", subtle: "var(--danger-subtle)" },
        warning: { DEFAULT: "var(--warning)", subtle: "var(--warning-subtle)" },
        info: { DEFAULT: "var(--info)", subtle: "var(--info-subtle)" },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
          6: "var(--chart-6)",
          7: "var(--chart-7)",
          8: "var(--chart-8)",
          grid: "var(--chart-grid)",
          axis: "var(--chart-axis)",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
      },
      fontSize: {
        // semantic type scale, finalized from Phase 1 identity
        "display-lg": ["3.5rem", { lineHeight: "1.05", letterSpacing: "0" }],
        display: ["2.75rem", { lineHeight: "1.1", letterSpacing: "0" }],
        h1: ["2rem", { lineHeight: "1.2", letterSpacing: "0" }],
        h2: ["1.5rem", { lineHeight: "1.25", letterSpacing: "0" }],
        h3: ["1.25rem", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.5" }],
        "body-sm": ["0.875rem", { lineHeight: "1.45" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
}
