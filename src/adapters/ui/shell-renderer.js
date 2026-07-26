// /asystent-studenta-ai-demo/src/adapters/ui/shell-renderer.js
(function attachShellRenderer(global) {
  "use strict";

  function createShellRenderer(rootElement, dependencies) {
    const state = dependencies.state;
    const t = dependencies.translate;
    const applyTheme = dependencies.applyTheme;
    const assistantWidget = dependencies.assistantWidget;
    const scheduleWidget = dependencies.scheduleWidget;

    function render() {
      applyTheme(document.documentElement, state.theme.getTheme());
      rootElement.innerHTML = buildShellMarkup();
      bindEvents();
      scheduleWidget.bind(rootElement);
      assistantWidget.bind(rootElement);
    }

    function buildShellMarkup() {
      const isSchedule = state.activeTab === "schedule";
      const isAssistant = state.activeTab === "assistant";

      return `
        <div class="app-shell">
          <header class="app-header">
            <div class="app-title-block">
              <p class="app-kicker">${t("prototypeBadge")}</p>
              <h1>${t("appTitle")}</h1>
              <p>${t("appSubtitle")}</p>
            </div>
            <div class="app-controls" aria-label="${t("settings")}">
              <div class="segmented" role="tablist" aria-label="${t("section")}">
                <button class="segmented__item ${isSchedule ? "is-active" : ""}" data-tab="schedule" type="button">${t("schedule")}</button>
                <button class="segmented__item ${isAssistant ? "is-active" : ""}" data-tab="assistant" type="button">${t("assistant")}</button>
              </div>
              <div class="segmented" aria-label="${t("language")}">
                <button class="segmented__item ${state.language === "pl" ? "is-active" : ""}" data-language="pl" type="button">PL</button>
                <button class="segmented__item ${state.language === "en" ? "is-active" : ""}" data-language="en" type="button">EN</button>
              </div>
              <div class="segmented" aria-label="${t("theme")}">
                <button class="segmented__item ${state.theme.getTheme() === "day" ? "is-active" : ""}" data-theme="day" type="button">${t("dayTheme")}</button>
                <button class="segmented__item ${state.theme.getTheme() === "night" ? "is-active" : ""}" data-theme="night" type="button">${t("nightTheme")}</button>
              </div>
            </div>
          </header>

          <main class="workspace" data-active-tab="${state.activeTab}">
            <section class="panel panel--schedule" aria-labelledby="schedule-title">
              <div class="panel__header">
                <div>
                  <p class="panel__kicker">${t("schedule")}</p>
                  <h2 id="schedule-title">${t("scheduleShellTitle")}</h2>
                </div>
                <span class="status-pill">${t("workingModule")}</span>
              </div>
              ${scheduleWidget.render()}
            </section>

            <section class="panel panel--assistant" aria-labelledby="assistant-title">
              <div class="panel__header">
                <div>
                  <p class="panel__kicker">${t("assistant")}</p>
                  <h2 id="assistant-title">${t("assistantShellTitle")}</h2>
                </div>
                <span class="status-pill status-pill--demo">${t("demoBadge")}</span>
              </div>
              ${assistantWidget.render()}
            </section>
          </main>
        </div>`;
    }

    function bindEvents() {
      rootElement.querySelectorAll("[data-tab]").forEach((button) => {
        button.addEventListener("click", () => {
          state.activeTab = button.dataset.tab;
          render();
        });
      });

      rootElement.querySelectorAll("[data-language]").forEach((button) => {
        button.addEventListener("click", () => {
          state.language = button.dataset.language;
          render();
        });
      });

      rootElement.querySelectorAll("[data-theme]").forEach((button) => {
        button.addEventListener("click", () => {
          state.theme.setTheme(button.dataset.theme);
          render();
        });
      });
    }

    return { render };
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    uiAdapters: {
      ...(global.AsystentStudentAiDemo.uiAdapters || {}),
      createShellRenderer
    }
  };
})(window);
