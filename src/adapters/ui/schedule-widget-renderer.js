// /asystent-studenta-ai-demo/src/adapters/ui/schedule-widget-renderer.js
(function attachScheduleWidgetRenderer(global) {
  "use strict";

  function createScheduleWidgetRenderer(dependencies) {
    const state = dependencies.state;
    const t = dependencies.translate;
    const scheduleService = dependencies.scheduleService;
    const requestRender = dependencies.requestRender;
    const toastNotifications = dependencies.toastNotifications;

    function render() {
      const model = scheduleService.getScheduleViewModel(state.scheduleFilters, state.language);
      const options = scheduleService.getFilterOptions(state.language);
      const selectedItem = selectActiveItem(model.items);

      return `
        <div class="schedule-widget">
          <div class="schedule-toolbar">
            <div>
              <p class="panel__kicker">${t("schedulePeriodLabel")}</p>
              <strong>${t("schedulePeriodValue")}</strong>
            </div>
            <div class="schedule-stats" aria-label="${t("results")}">
              <span><strong>${model.stats.shown}</strong> ${t("shown")}</span>
              <span><strong>${model.stats.total}</strong> ${t("aggregates")}</span>
              <span><strong>${model.stats.rawRecords}</strong> ${t("rawRecords")}</span>
            </div>
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
          <div class="schedule-workspace">
            <section class="widget-panel" aria-label="${t("schedule")}">
              <div class="widget-panel__header">
                <strong>${t("schedule")}</strong>
                <span>${t("rendered")}: ${Math.min(model.items.length, 60)} ${t("rows")}</span>
              </div>
              <div class="schedule-table" role="table">
                ${renderTableHeader()}
                <div class="schedule-table__body">
                  ${model.items.length ? model.items.slice(0, 60).map((item) => renderRow(item, selectedItem)).join("") : `<p class="empty-state">${t("noCards")}</p>`}
                </div>
              </div>
            </section>
            <section class="widget-panel" aria-label="${t("details")}">
              <div class="widget-panel__header">
                <strong>${t("details")}</strong>
                <span>${t("teamTransition")}</span>
              </div>
              ${selectedItem ? renderDetails(selectedItem, model) : `<p class="empty-state">${t("noCards")}</p>`}
            </section>
          </div>
        </div>`;
    }

    function selectActiveItem(items) {
      if (!items.length) return null;

      const selected = items.find((item) => item.id === state.selectedScheduleItemId);
      return selected || items[0];
    }

    function renderTableHeader() {
      return `
        <div class="schedule-table__header" role="row">
          <span>${t("zjazd")}</span>
          <span>${t("day")}</span>
          <span>${t("time")}</span>
          <span>${t("groups")}</span>
          <span>${t("teacher")}</span>
          <span>${t("type")}</span>
          <span>${t("subjectName")}</span>
        </div>`;
    }

    function renderRow(item, selectedItem) {
      const selected = selectedItem && item.id === selectedItem.id ? " is-selected" : "";
      return `
        <button class="schedule-row${selected}" data-schedule-select="${escapeAttribute(item.id)}" type="button" role="row">
          <span>${t("zjazd")} ${escapeHtml(String(item.zjazdNumber))}</span>
          <span>${escapeHtml(item.dayLabel)}</span>
          <span>${escapeHtml(item.timeFrom)}-${escapeHtml(item.timeTo)}</span>
          <span><strong>${escapeHtml(item.groupSummary)}</strong><small>${escapeHtml(item.subjectCode)}</small></span>
          <span>${escapeHtml(item.teacherLabel)}</span>
          <span>${escapeHtml(item.typeLabel)}</span>
          <span>${escapeHtml(item.subjectRaw)}</span>
        </button>`;
    }

    function renderDetails(item, model) {
      return `
        <div class="schedule-details">
          <p class="details-hint">${t("detailsHint")} ${model.stats.shown}/${model.stats.total}.</p>
          <article class="details-card">
            <p class="panel__kicker">${escapeHtml(item.subjectCode)} · ${escapeHtml(item.typeLabel)}</p>
            <h3>${escapeHtml(item.subjectRaw)}</h3>
            <p>${escapeHtml(item.dayLabel)} · ${escapeHtml(item.timeFrom)}-${escapeHtml(item.timeTo)} · ${t("zjazd")} ${escapeHtml(String(item.zjazdNumber))}</p>
            <div class="details-tags">
              <span>${escapeHtml(item.teacherLabel)}</span>
              <span>${escapeHtml(item.groupSummary)}</span>
              <span>${escapeHtml(item.activityType)}</span>
            </div>
            <code>${escapeHtml(item.teamName)}</code>
            <button class="teams-button" data-teams-transition type="button">${t("openTeams")}</button>
          </article>
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

    function bind(rootElement) {
      rootElement.querySelectorAll("[data-schedule-filter]").forEach((field) => {
        field.addEventListener("change", () => updateFilter(field));

        if (field.tagName === "INPUT") {
          field.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              updateFilter(field);
            }
          });
        }
      });

      rootElement.querySelectorAll("[data-schedule-select]").forEach((button) => {
        button.addEventListener("click", () => {
          state.selectedScheduleItemId = button.dataset.scheduleSelect;
          requestRender();
        });
      });

      rootElement.querySelectorAll("[data-teams-transition]").forEach((button) => {
        button.addEventListener("click", () => {
          toastNotifications.show({
            title: t("toastTitle"),
            message: t("toastMessage"),
            badge: t("demoBadge")
          });
        });
      });
    }

    function updateFilter(field) {
      state.scheduleFilters = {
        ...state.scheduleFilters,
        [field.dataset.scheduleFilter]: field.value
      };
      state.selectedScheduleItemId = "";
      requestRender();
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