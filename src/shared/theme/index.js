// /asystent-studenta-ai-demo/src/shared/theme/index.js
(function attachThemeModule(global) {
  "use strict";

  const tokens = global.AsystentStudentAiDemo.themeTokens;
  const service = global.AsystentStudentAiDemo.themeService;

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    theme: {
      DEFAULT_THEME: service.DEFAULT_THEME,
      SEMANTIC_TOKENS: tokens.SEMANTIC_TOKENS,
      THEME_NAMES: tokens.THEME_NAMES,
      THEME_PALETTES: tokens.THEME_PALETTES,
      applyThemeToElement: service.applyThemeToElement,
      createThemeState: service.createThemeState,
      getThemePalette: service.getThemePalette,
      normalizeTheme: service.normalizeTheme
    }
  };
})(window);
