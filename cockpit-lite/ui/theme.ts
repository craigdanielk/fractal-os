export const theme = {
  mode: "light",

  palettes: {
    light: {
      surface: "rgba(255,255,255,0.55)",
      glass: "rgba(255,255,255,0.35)",
      text: "#111",
      subtleText: "#444",
      border: "rgba(0,0,0,0.08)",
      shadow: "0 4px 30px rgba(0,0,0,0.07)",
      blur: "blur(18px)",
      bg: "linear-gradient(135deg, #f8f8f8 0%, #eaeaea 100%)",
    },
    dark: {
      surface: "rgba(10,10,10,0.55)",
      glass: "rgba(22,22,22,0.35)",
      text: "#fafafa",
      subtleText: "#bbb",
      border: "rgba(255,255,255,0.08)",
      shadow: "0 4px 30px rgba(0,0,0,0.65)",
      blur: "blur(18px)",
      bg: "linear-gradient(135deg, #000 0%, #111 100%)",
    },
    blue: {
      surface: "rgba(255,255,255,0.25)",
      glass: "rgba(180,210,255,0.25)",
      text: "#002245",
      subtleText: "#335b88",
      border: "rgba(255,255,255,0.45)",
      shadow: "0 4px 40px rgba(0,80,180,0.25)",
      blur: "blur(20px)",
      bg: "linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)",
    },
  },

  spacing: {
    xs: "0.35rem",
    sm: "0.65rem",
    md: "1rem",
    lg: "2rem",
    xl: "3rem",
  },

  radius: {
    sm: "8px",
    md: "16px",
    lg: "22px",
    glass: "26px",
  },

  card: (pal) => ({
    background: pal.surface,
    backdropFilter: pal.blur,
    border: `1px solid ${pal.border}`,
    borderRadius: "22px",
    boxShadow: pal.shadow,
    padding: "1.75rem",
  }),

  navButton: (pal, active=false) => ({
    padding: "0.6rem 1rem",
    borderRadius: "16px",
    background: active ? pal.glass : "transparent",
    backdropFilter: pal.blur,
    border: active ? `1px solid ${pal.border}` : "transparent",
    color: pal.text,
    cursor: "pointer",
  }),
};
