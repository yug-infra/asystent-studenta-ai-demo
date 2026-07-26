// /asystent-studenta-ai-demo/src/domain/schedule/schedule-domain.js
(function attachScheduleDomain(global) {
  "use strict";

  const TEACHERS = global.AsystentStudentAiDemo.teachers.MANUAL_TEACHERS;

  const DAY_LABELS = {
    pl: {
      friday: "Piątek",
      saturday: "Sobota",
      sunday: "Niedziela"
    },
    en: {
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    }
  };

  const TYPE_LABELS = {
    pl: {
      lecture: "Wykład",
      laboratory: "Laboratorium",
      lab: "Laboratorium",
      exercise: "Ćwiczenia",
      exercises: "Ćwiczenia",
      classes: "Ćwiczenia",
      project: "Projekt",
      test: "Test",
      task: "Zadanie",
      assignment: "Zadanie"
    },
    en: {
      lecture: "Lecture",
      laboratory: "Laboratory",
      lab: "Laboratory",
      exercise: "Exercises",
      project: "Project",
      test: "Test",
      task: "Task"
    }
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function normalizeActivityType(value) {
    const raw = String(value || "").toLowerCase();

    if (raw === "laboratory") return "lab";
    if (raw === "exercises" || raw === "classes") return "exercise";
    if (raw === "assignment") return "task";

    return raw;
  }

  function hasLetters(value) {
    return /[a-ząćęłńóśźż]/i.test(String(value || ""));
  }

  function isUsableTeacherText(value) {
    const text = String(value || "").trim();

    if (!text || text === "—") return false;
    if (text.length < 5) return false;
    if (!hasLetters(text)) return false;
    if (/^\d+$/.test(text)) return false;

    return true;
  }

  function getTeacherSource(row) {
    if (isUsableTeacherText(row.teacherRaw)) return row.teacherRaw;
    if (isUsableTeacherText(row.roomRaw)) return row.roomRaw;

    return row.teacherRaw || row.teacherId || "—";
  }

  function resolveTeacher(raw) {
    const text = String(raw || "").trim();
    const key = normalize(text);

    const found = TEACHERS.find((teacher) => {
      const keys = [teacher.label, teacher.id, ...(teacher.aliases || [])].map(normalize);
      return keys.some((candidate) => key.includes(candidate) || candidate.includes(key));
    });

    if (found) return found;

    return {
      id: key || "unknown",
      label: isUsableTeacherText(text) ? text : "Nie rozpoznano"
    };
  }

  function dayLabel(dayId, lang) {
    return DAY_LABELS[lang]?.[dayId] || DAY_LABELS.pl[dayId] || dayId;
  }

  function typeLabel(activityType, lang) {
    const normalized = normalizeActivityType(activityType);
    return TYPE_LABELS[lang]?.[normalized] || TYPE_LABELS.pl[normalized] || normalized;
  }

  function activityMatchesFilter(itemActivityType, filterActivityType) {
    if (filterActivityType === "all") return true;
    return normalizeActivityType(itemActivityType) === normalizeActivityType(filterActivityType);
  }

  function makeTeamName(item) {
    const typeCode = {
      lecture: "W",
      laboratory: "L",
      lab: "L",
      exercise: "C",
      project: "P",
      test: "T",
      task: "Z"
    }[normalizeActivityType(item.activityType)] || "X";

    return [
      item.termId,
      item.subjectCode,
      typeCode,
      item.teacherId,
      item.groupLabel || item.groupId
    ].filter(Boolean).join("_").replace(/\s+/g, "");
  }

  function prepareRows(rawRows, lang) {
    return rawRows.map((row) => {
      const teacher = resolveTeacher(getTeacherSource(row));
      const activityType = normalizeActivityType(row.activityType);
      const prepared = {
        ...row,
        activityType,
        sourceActivityType: row.activityType,
        teacherId: teacher.id,
        teacherLabel: teacher.label,
        dayLabel: dayLabel(row.dayId, lang),
        typeLabel: typeLabel(activityType, lang),
        teamName: ""
      };

      prepared.teamName = makeTeamName(prepared);
      prepared.searchText = buildSearchText(prepared);

      return prepared;
    });
  }

  function buildSearchText(item) {
    return normalize([
      item.zjazdNumber,
      item.dayLabel,
      item.timeFrom,
      item.timeTo,
      item.groupSummary || item.groupLabel,
      item.subjectCode,
      item.subjectRaw,
      item.typeLabel,
      item.teacherLabel,
      item.teamName
    ].join(" "));
  }

  function aggregateRows(rows, lang) {
    const map = new Map();

    rows.forEach((row) => {
      const key = [
        row.termId,
        row.zjazdId,
        row.dayId,
        row.timeSlotId,
        row.subjectCode,
        row.activityType,
        row.teacherId
      ].join("|");

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          termId: row.termId,
          zjazdId: row.zjazdId,
          zjazdNumber: row.zjazdNumber,
          dayId: row.dayId,
          dayLabel: dayLabel(row.dayId, lang),
          lessonNo: row.lessonNo,
          timeFrom: row.timeFrom,
          timeTo: row.timeTo,
          subjectCode: row.subjectCode,
          subjectRaw: row.subjectRaw,
          activityType: row.activityType,
          typeLabel: typeLabel(row.activityType, lang),
          teacherId: row.teacherId,
          teacherLabel: row.teacherLabel,
          groupLabels: [],
          groupIds: [],
          teamName: "",
          searchText: ""
        });
      }

      const item = map.get(key);
      if (!item.groupIds.includes(row.groupId)) {
        item.groupIds.push(row.groupId);
        item.groupLabels.push(row.groupLabel || row.groupId);
      }
    });

    return Array.from(map.values()).map((item) => {
      item.groupSummary = item.groupLabels.join(", ");
      item.teamName = [
        item.termId,
        item.subjectCode,
        item.typeLabel,
        item.teacherId,
        item.groupLabels.join("_")
      ].filter(Boolean).join("_").replace(/\s+/g, "");
      item.searchText = buildSearchText(item);
      return item;
    }).sort((a, b) => {
      return (a.zjazdNumber - b.zjazdNumber) ||
        String(a.dayId).localeCompare(String(b.dayId)) ||
        (a.lessonNo - b.lessonNo) ||
        String(a.subjectCode).localeCompare(String(b.subjectCode));
    });
  }

  function createScheduleView(rawRows, lang) {
    return aggregateRows(prepareRows(rawRows, lang), lang);
  }

  function relocalizeView(view, lang) {
    view.forEach((item) => {
      item.dayLabel = dayLabel(item.dayId, lang);
      item.typeLabel = typeLabel(item.activityType, lang);
      item.searchText = buildSearchText(item);
    });

    return view;
  }

  function filterSchedule(view, filters) {
    const query = normalize(filters.query);

    return view.filter((item) => {
      const groupMatch = filters.groupId === "all" || item.groupIds.includes(filters.groupId);

      return (
        (filters.zjazdId === "all" || item.zjazdId === filters.zjazdId) &&
        (filters.dayId === "all" || item.dayId === filters.dayId) &&
        groupMatch &&
        (filters.teacherId === "all" || item.teacherId === filters.teacherId) &&
        (filters.subjectCode === "all" || item.subjectCode === filters.subjectCode) &&
        activityMatchesFilter(item.activityType, filters.activityType) &&
        (!query || item.searchText.includes(query))
      );
    });
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    scheduleDomain: {
      createScheduleView,
      filterSchedule,
      normalize,
      normalizeActivityType,
      relocalizeView
    }
  };
})(window);
