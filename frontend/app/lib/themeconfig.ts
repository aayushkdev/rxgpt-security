// lib/themeConfig.ts

export type ThemeVariant = {
  leftFrom: string;
  leftTo: string;
  rightFrom: string;
  rightTo: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
};

export type RoleTheme = {
  light: ThemeVariant;
  dark: ThemeVariant;
  title: string;
  sub: string;
};

export const roles: Record<string, RoleTheme> = {
  Admin: {
    light: {
      leftFrom: "#eff1f5",
      leftTo: "#ccd0da",
      rightFrom: "#f2f3f7",
      rightTo: "#e6e9ef",
      accent: "#7287fd",
      textPrimary: "#2e3440",
      textSecondary: "#4c566a",
    },
    dark: {
      leftFrom: "#1e1e2e",
      leftTo: "#181825",
      rightFrom: "#181825",
      rightTo: "#11111b",
      accent: "#89b4fa",
      textPrimary: "#e2e8f0",
      textSecondary: "#a6adc8",
    },
    title: "Administration Portal",
    sub: "System oversight and operational control.",
  },

  Doctor: {
    light: {
      leftFrom: "#f3ead3",
      leftTo: "#e6e2cc",
      rightFrom: "#f8f5e4",
      rightTo: "#e6dcc6",
      accent: "#7fbbb3",
      textPrimary: "#2f3e46",
      textSecondary: "#556b6e",
    },
    dark: {
      leftFrom: "#2d353b",
      leftTo: "#232a2e",
      rightFrom: "#232a2e",
      rightTo: "#1f2428",
      accent: "#83c092",
      textPrimary: "#d3c6aa",
      textSecondary: "#a7c080",
    },
    title: "Doctor Workspace",
    sub: "Clinical access and patient records.",
  },

  Nurse: {
    light: {
      leftFrom: "#fbf1c7",
      leftTo: "#ebdbb2",
      rightFrom: "#f2e5bc",
      rightTo: "#e0d2a8",
      accent: "#b16286",
      textPrimary: "#3c3836",
      textSecondary: "#665c54",
    },
    dark: {
      leftFrom: "#282828",
      leftTo: "#1d2021",
      rightFrom: "#1d2021",
      rightTo: "#141617",
      accent: "#d3869b",
      textPrimary: "#ebdbb2",
      textSecondary: "#bdae93",
    },
    title: "Nursing Station",
    sub: "Care coordination and monitoring.",
  },

  Patient: {
    light: {
      leftFrom: "#faf4ed",
      leftTo: "#f2e9e1",
      rightFrom: "#f4ede8",
      rightTo: "#e8dcd3",
      accent: "#907aa9",
      textPrimary: "#403d52",
      textSecondary: "#6e6a86",
    },
    dark: {
      leftFrom: "#191724",
      leftTo: "#1f1d2e",
      rightFrom: "#1f1d2e",
      rightTo: "#16141f",
      accent: "#c4a7e7",
      textPrimary: "#e0def4",
      textSecondary: "#908caa",
    },
    title: "Patient Access",
    sub: "Appointments and health history.",
  },

  Staff: {
    light: {
      leftFrom: "#e1e2e7",
      leftTo: "#d5d6db",
      rightFrom: "#e5e6ea",
      rightTo: "#d8d9df",
      accent: "#7aa2f7",
      textPrimary: "#1f2937",
      textSecondary: "#4b5563",
    },
    dark: {
      leftFrom: "#1a1b26",
      leftTo: "#16161e",
      rightFrom: "#16161e",
      rightTo: "#0f0f17",
      accent: "#7aa2f7",
      textPrimary: "#c0caf5",
      textSecondary: "#9aa5ce",
    },
    title: "Staff Operations",
    sub: "Logistics and internal coordination.",
  },
};