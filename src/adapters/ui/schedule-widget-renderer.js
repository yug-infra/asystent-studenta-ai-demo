// /asystent-studenta-ai-demo/src/adapters/ui/schedule-widget-renderer.js
(function attachScheduleWidgetRenderer(global) {
  "use strict";

  function createScheduleWidgetRenderer(dependencies) {
    const state = dependencies.state;
    const t = dependencies.translate;
    const scheduleService = dependencies.scheduleService;
    const requestRender = dependencies.requestRender;

    function render() {
      const model = scheduleService.getScheduleViewModel(state.scheduleFilters, state.language);
      const options = scheduleService.getFilterOptions(state.language);

      return `
        <div class="schedule-widget">
          <div class="schedule-stats" aria-label="${t("results")}">
            <span><strong>${model.stats.shown}</strong> ${t("shown")}</span>
            <span><strong>${model.stats.total}</strong> ${t("aggregates")}</span>
            <span><strong>${model.stats.rawRecords}</strong> ${t("rawRecords")}</span>
          </div>
          <div class="schedule-filters">
            ${renderSelect("zjazdId", t("zjazd"), options.zjazdy, model.filters.zjazdId)}
            ${renderSelect("dayId", t("day"), options.days, model.filters.dayId)}
            ${renderSelect("groupId", t("group"), options.groups, model.filters.groupId)}
            ${renderSelect("teacherId", t("teacher"), options.teachers, model.filters.teacherId)}
            ${renderSelect("subjectCode", t("subject"), options.subjects, model.filters.subjectCode)}
            ${renderSelect("activityType", t("type"), options.activityTypes, model.filters.activityType)}
            <label class="filter-field filter-field--search">
              <span>${t("search")}</span>
              <input data-schedule-filter="query" type="search" value="${escapeAttribute(model.filters.query)}" placeholder="${t("searchPlaceholder")}">
            </label>
          </div>
          <div class="schedule-list">
            ${model.items.length ? model.items.map(renderCard).join("") : `<p class="empty-state">${t("noCards")}</p>`}
          </div>
        </div>`;
    }

    function renderSelect(name, label, options, selectedValue) {
      const allOption = `<option value="all">${t("all")}</option>`;
      const optionMarkup = options.map((option) => {
        const selected = option.value === selectedValue ? " selected" : "";
        return `<option value="${escapeAttribute(option.value)}"${selected}>${escapeHtml(option.label)}</option>`;
      }).join("");

      return `
        <label class="filter-field">
          <span>${label}</span>
          <select data-schedule-filter="${name}">${allOption}${optionMarkup}</select>
        </label>`;
    }

    function renderCard(item) {
      return `
        <article class="schedule-card">
          <div class="schedule-card__time">
            <span>${escapeHtml(item.dayLabel)}</span>
            <strong>${escapeHtml(item.timeFrom)}-${escapeHtml(item.timeTo)}</strong>
          </div>
          <div class="schedule-card__body">
            <div class="schedule-card__title-row">
              <h3>${escapeHtml(item.subjectRaw)}</h3>
              <span class="status-pill status-pill--demo">${escapeHtml(item.typeLabel)}</span>
            </div>
            <dl class="schedule-meta">
              <div><dt>${t("zjazd")}</dt><dd>${escapeHtml(String(item.zjazdNumber))}</dd></div>
              <div><dt>${t("groups")}</dt><dd>${escapeHtml(item.groupSummary)}</dd></div>
              <div><dt>${t("teacher")}</dt><dd>${escapeHtml(item.teacherLabel)}</dd></div>
              <div><dt>${t("details")}</dt><dd>${escapeHtml(item.teamName)}</dd></div>
            </dl>
          </div>
        </article>`;
    }

    function bind(rootElement) {
      rootElement.querySelectorAll("[data-schedule-filter]").forEach((field) => {
        const eventName = field.tagName === "INPUT" ? "input" : "change";
        field.addEventListener(eventName, () => {
          state.scheduleFilters = {
            ...state.scheduleFilters,
            [field.dataset.scheduleFilter]: field.value
          };
          requestRender();
        });
      });
    }

    return { bind, render };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    uiAdapters: {
      ...(global.AsystentStudentAiDemo.uiAdapters || {}),
      createScheduleWidgetRenderer
    }
  };
})(window);
