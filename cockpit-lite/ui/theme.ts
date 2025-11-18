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
    border: "#dddddd",
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "2rem",
    xl: "3rem",
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "12px",
  },
  fontFamily: "sans-serif",
  headings: {
    h1: {
      fontSize: "1.75rem",
      fontWeight: 600,
      marginBottom: "1.5rem",
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "0.75rem",
    },
  },
  inputs: {
    text: {
      padding: "0.5rem",
      border: "1px solid #ccc",
      borderRadius: "6px",
    },
    select: {
      padding: "0.5rem",
      border: "1px solid #ccc",
      borderRadius: "6px",
      minWidth: "200px",
    },
  },
  buttons: {
    primary: {
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      background: "#000",
      color: "#fff",
      cursor: "pointer",
      border: "none",
    },
  },
  navLink: {
    textDecoration: "none",
    color: "#222222",
    fontWeight: 500,
    padding: "0.5rem",
  },
};

