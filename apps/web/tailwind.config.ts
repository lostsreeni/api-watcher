import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--text)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
        },
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
        badge: {
          added: {
            bg: "var(--badge-added-bg)",
            text: "var(--badge-added-text)",
          },
          modified: {
            bg: "var(--badge-modified-bg)",
            text: "var(--badge-modified-text)",
          },
          removed: {
            bg: "var(--badge-removed-bg)",
            text: "var(--badge-removed-text)",
          },
          breaking: {
            bg: "var(--badge-breaking-bg)",
            text: "var(--badge-breaking-text)",
          },
          info: {
            bg: "var(--badge-info-bg)",
            text: "var(--badge-info-text)",
          },
          warning: {
            bg: "var(--badge-warning-bg)",
            text: "var(--badge-warning-text)",
          },
        },
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "page-title": ["30px", { lineHeight: "1.2", fontWeight: "700" }],
        "section-title": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "card-title": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["12px", { lineHeight: "1.5", fontWeight: "400" }],
        code: ["13px", { lineHeight: "1.5", fontWeight: "500" }],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        floating:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
