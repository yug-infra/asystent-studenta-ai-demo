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
  const storedUiState = readStoredUiState();

  const state = {
    activeTab: normalizeActiveTab(storedUiState.activeTab),
    assistant: assistantService.hydrateState
      ? assistantService.hydrateState(storedUiState.assistant)
      : assistantService.createDefaultState(),
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
      persistUiState();
      shellRenderer.render();
    }
  });

  const assistantWidget = app.uiAdapters.createAssistantWidgetRenderer({
    state,
    assistantService,
    notifications: toastNotifications,
    translate,
    requestRender() {
      persistUiState();
      shellRenderer.render();
    }
  });

  shellRenderer = app.uiAdapters.createShellRenderer(rootElement, {
    state,
    assistantWidget,
    scheduleWidget,
    translate,
    persistUiState,
    applyTheme: app.theme.applyThemeToElement
  });

  shellRenderer.render();

  function translate(key) {
    return app.i18n.translate(state.language, key);
  }

  function normalizeActiveTab(value) {
    return value === "assistant" ? "assistant" : "schedule";
  }

  function readStoredUiState() {
    try {
      return JSON.parse(global.localStorage?.getItem("asystent-studenta-ai-demo.ui-state.v1") || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function persistUiState() {
    writeStoredUiState({
      activeAssistantSceneId: state.assistant.activeSceneId || "",
      assistant: assistantService.serializeState
        ? assistantService.serializeState(state.assistant)
        : state.assistant,
      activeTab: state.activeTab
    });
  }

  function writeStoredUiState(value) {
    try {
      global.localStorage?.setItem("asystent-studenta-ai-demo.ui-state.v1", JSON.stringify(value));
    } catch (error) {
      // localStorage may be unavailable in private or embedded browser contexts.
    }
  }
})(window);
