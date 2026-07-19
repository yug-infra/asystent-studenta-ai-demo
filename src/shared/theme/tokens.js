// /asystent-studenta-ai-demo/src/shared/theme/tokens.js
(function attachThemeTokens(global) {
  "use strict";

  const THEME_NAMES = Object.freeze({
    DAY: "day",
    NIGHT: "night"
  });

  const SEMANTIC_TOKENS = Object.freeze({
    radius: {
      small: "8px",
      medium: "12px",
      large: "16px"
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px"
    },
    shadow: {
      panel: "0 18px 45px rgba(31, 41, 80, 0.12)",
      floating: "0 10px 28px rgba(31, 41, 80, 0.18)"
    }
  });

  const THEME_PALETTES = Object.freeze({
    [THEME_NAMES.DAY]: Object.freeze({
      "--app-bg": "#eef3ff",
      "--app-surface": "#ffffff",
      "--app-surface-muted": "#f5f7ff",
      "--app-panel": "#f8faff",
      "--app-border": "#d4defa",
      "--app-border-strong": "#aebdf1",
      "--app-text": "#101936",
      "--app-text-muted": "#5a6388",
      "--app-primary": "#5a60d1",
      "--app-primary-strong": "#464dc1",
      "--app-primary-soft": "#e8ebff",
      "--app-success": "#35a764",
      "--app-success-soft": "#e6f7ed",
      "--app-warning": "#d08a18",
      "--app-danger": "#c93c4c"
    }),
    [THEME_NAMES.NIGHT]: Object.freeze({
      "--app-bg": "#11182a",
      "--app-surface": "#18223a",
      "--app-surface-muted": "#202b46",
      "--app-panel": "#141d32",
      "--app-border": "#33405f",
      "--app-border-strong": "#53618c",
      "--app-text": "#f4f7ff",
      "--app-text-muted": "#bac3df",
      "--app-primary": "#8e95ff",
      "--app-primary-strong": "#b4b8ff",
      "--app-primary-soft": "#252b5c",
      "--app-success": "#65d58d",
      "--app-success-soft": "#203f31",
      "--app-warning": "#f0ba56",
      "--app-danger": "#ff7a88"
    })
  });

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    themeTokens: {
      THEME_NAMES,
      SEMANTIC_TOKENS,
      THEME_PALETTES
    }
  };
})(window);
