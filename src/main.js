// /asystent-studenta-ai-demo/src/main.js
(function bootstrapApp(global) {
  "use strict";

  const app = global.AsystentStudentAiDemo;
  const rootElement = document.getElementById("app");

  if (!rootElement) {
    return;
  }

  const scheduleService = app.scheduleApplication.createScheduleService(
    global.AsystentStudentScheduleData || [],
    app.scheduleDomain
  );

  const state = {
    activeTab: "schedule",
    language: app.i18n.DEFAULT_LANGUAGE,
    theme: app.theme.createThemeState(app.theme.DEFAULT_THEME),
    scheduleFilters: scheduleService.createDefaultFilters()
  };

  let shellRenderer;

  const scheduleWidget = app.uiAdapters.createScheduleWidgetRenderer({
    state,
    scheduleService,
    translate,
    requestRender() {
      shellRenderer.render();
    }
  });

  shellRenderer = app.uiAdapters.createShellRenderer(rootElement, {
    state,
    scheduleWidget,
    translate,
    applyTheme: app.theme.applyThemeToElement
  });

  shellRenderer.render();

  function translate(key) {
    return app.i18n.translate(state.language, key);
  }
})(window);
