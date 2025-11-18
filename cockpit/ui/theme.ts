

/**
 * Cockpit Theme
 *
 * Simple, extendable design tokens for the Lite Cockpit.
 * Not a full design system — just centralised UI constants.
 */

export const theme = {
  colors: {
    primary: "#1a73e8",
    secondary: "#e8710a",
    background: "#ffffff",
    surface: "#f7f7f7",
    text: "#222222",
    subtleText: "#666666",
    border: "#dddddd"
  },
  spacing: (value: number) => `${value * 8}px`,
  radius: {
    small: "4px",
    medium: "8px",
    large: "12px"
  },
  font: {
    family: "sans-serif",
    size: {
      small: "0.85rem",
      normal: "1rem",
      large: "1.25rem",
      title: "1.75rem"
    }
  }
};