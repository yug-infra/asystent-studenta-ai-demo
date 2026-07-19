// /asystent-studenta-ai-demo/src/main.js
(function bootstrapApp(global) {
  "use strict";

  const app = global.AsystentStudentAiDemo;
  const rootElement = document.getElementById("app");

  if (!rootElement) {
    return;
  }

  const state = {
    activeTab: "schedule",
    language: app.i18n.DEFAULT_LANGUAGE,
    theme: app.theme.createThemeState(app.theme.DEFAULT_THEME)
  };

  const shellRenderer = app.uiAdapters.createShellRenderer(rootElement, {
    state,
    translate(key) {
      return app.i18n.translate(state.language, key);
    },
    applyTheme: app.theme.applyThemeToElement
  });

  shellRenderer.render();
})(window);
