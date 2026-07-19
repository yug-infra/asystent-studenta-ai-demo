// /asystent-studenta-ai-demo/src/application/schedule/schedule-service.js
(function attachScheduleService(global) {
  "use strict";

  function createScheduleService(rawRows, scheduleDomain) {
    function createView(lang) {
      return scheduleDomain.createScheduleView(rawRows, lang);
    }

    function createDefaultFilters() {
      return {
        zjazdId: "all",
        dayId: "all",
        groupId: "all",
        teacherId: "all",
        subjectCode: "all",
        activityType: "all",
        query: ""
      };
    }

    function getFilterOptions(lang) {
      const view = createView(lang);
      const sessionLabel = lang === "en" ? "Session" : "Zjazd";

      return {
        zjazdy: toOptions(view, "zjazdId", (item) => `${sessionLabel} ${item.zjazdNumber}`),
        days: toOptions(view, "dayId", (item) => item.dayLabel),
        groups: toCollectionOptions(view, "groupIds", "groupLabels"),
        teachers: toOptions(view, "teacherId", (item) => item.teacherLabel),
        subjects: toOptions(view, "subjectCode", (item) => `${item.subjectCode} · ${item.subjectRaw}`),
        activityTypes: toOptions(view, "activityType", (item) => item.typeLabel)
      };
    }

    function getScheduleViewModel(filters, lang) {
      const safeFilters = { ...createDefaultFilters(), ...(filters || {}) };
      const view = createView(lang);
      const items = scheduleDomain.filterSchedule(view, safeFilters);

      return {
        filters: safeFilters,
        items,
        stats: {
          shown: items.length,
          total: view.length,
          rawRecords: rawRows.length
        }
      };
    }

    return {
      createDefaultFilters,
      getFilterOptions,
      getScheduleViewModel
    };
  }

  function toOptions(items, idKey, labelFactory) {
    const map = new Map();

    items.forEach((item) => {
      const id = item[idKey];
      if (!id || map.has(id)) return;
      map.set(id, labelFactory(item));
    });

    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label), "pl"));
  }

  function toCollectionOptions(items, idsKey, labelsKey) {
    const map = new Map();

    items.forEach((item) => {
      (item[idsKey] || []).forEach((id, index) => {
        if (!id || map.has(id)) return;
        map.set(id, (item[labelsKey] || [])[index] || id);
      });
    });

    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label), "pl"));
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    scheduleApplication: {
      createScheduleService
    }
  };
})(window);
