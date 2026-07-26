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
  const assistantService = app.assistantApplication.createAssistantService(app.aiDemoCatalog);

  const state = {
    activeTab: "schedule",
    assistant: assistantService.createDefaultState(),
    language: app.i18n.DEFAULT_LANGUAGE,
    theme: app.theme.createThemeState(app.theme.DEFAULT_THEME),
    scheduleFilters: scheduleService.createDefaultFilters()
  };

  const toastNotifications = app.uiAdapters.createToastNotificationRenderer(rootElement);
  const teamsTransition = app.teamsAdapters.createTeamsTransitionAdapter({
    notifications: toastNotifications,
    translate
  });
  let shellRenderer;

  const scheduleWidget = app.uiAdapters.createScheduleWidgetRenderer({
    state,
    scheduleService,
    teamsTransition,
    translate,
    requestRender() {
      shellRenderer.render();
    }
  });

  const assistantWidget = app.uiAdapters.createAssistantWidgetRenderer({
    state,
    assistantService,
    notifications: toastNotifications,
    translate,
    requestRender() {
      shellRenderer.render();
    }
  });

  shellRenderer = app.uiAdapters.createShellRenderer(rootElement, {
    state,
    assistantWidget,
    scheduleWidget,
    translate,
    applyTheme: app.theme.applyThemeToElement
  });

  shellRenderer.render();

  function translate(key) {
    return app.i18n.translate(state.language, key);
  }
})(window);
