// /asystent-studenta-ai-demo/src/shared/theme/theme-service.js
(function attachThemeService(global) {
  "use strict";

  const tokens = global.AsystentStudentAiDemo.themeTokens;
  const DEFAULT_THEME = tokens.THEME_NAMES.DAY;

  function normalizeTheme(themeName) {
    return Object.values(tokens.THEME_NAMES).includes(themeName)
      ? themeName
      : DEFAULT_THEME;
  }

  function getThemePalette(themeName) {
    return tokens.THEME_PALETTES[normalizeTheme(themeName)];
  }

  function createThemeState(initialTheme) {
    let currentTheme = normalizeTheme(initialTheme);

    return {
      getTheme() {
        return currentTheme;
      },
      setTheme(nextTheme) {
        currentTheme = normalizeTheme(nextTheme);
        return currentTheme;
      },
      toggleTheme() {
        currentTheme = currentTheme === tokens.THEME_NAMES.DAY
          ? tokens.THEME_NAMES.NIGHT
          : tokens.THEME_NAMES.DAY;
        return currentTheme;
      },
      getPalette() {
        return getThemePalette(currentTheme);
      }
    };
  }

  function applyThemeToElement(element, themeName) {
    if (!element || !element.style) {
      return normalizeTheme(themeName);
    }

    const normalizedTheme = normalizeTheme(themeName);
    const palette = getThemePalette(normalizedTheme);

    Object.entries(palette).forEach(([tokenName, tokenValue]) => {
      element.style.setProperty(tokenName, tokenValue);
    });

    element.dataset.theme = normalizedTheme;
    return normalizedTheme;
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    themeService: {
      DEFAULT_THEME,
      applyThemeToElement,
      createThemeState,
      getThemePalette,
      normalizeTheme
    }
  };
})(window);
