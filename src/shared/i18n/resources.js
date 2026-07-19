// /asystent-studenta-ai-demo/src/shared/i18n/resources.js
(function attachI18nResources(global) {
  "use strict";

  const SUPPORTED_LANGUAGES = ["pl", "en"];
  const DEFAULT_LANGUAGE = "pl";

  const RESOURCES = {
    pl: {
      appTitle: "Asystent studenta AI",
      appSubtitle: "Demo prototypu: działający moduł planu zajęć oraz symulacja przejścia do zespołu w Microsoft Teams.",
      schedule: "Plan zajęć",
      assistant: "Asystent AI",
      details: "Szczegóły / Teams",
      zjazd: "Zjazd",
      day: "Dzień",
      time: "Godzina",
      groups: "Grupy",
      group: "Grupa",
      teacher: "Prowadzący",
      type: "Typ",
      subjectName: "Nazwa przedmiotu",
      subject: "Przedmiot",
      search: "Szukaj",
      all: "Wszystkie",
      rendered: "Render",
      rows: "wierszy",
      results: "Wyniki",
      aggregates: "agregatów",
      rawRecords: "Surowe rekordy",
      shown: "Pokazuję",
      narrowFilters: "Zawęź filtry, jeśli trzeba.",
      noCards: "Brak kart dla wybranych filtrów.",
      teamTransition: "Pokaż przejście do Teams",
      toastTitle: "Teams",
      toastMessage: "Symulacja: przejście do grupy Teams",
      demoBadge: "demo",
      dragTitle: "Przeciągnij, aby zmienić szerokość",
      language: "Język",
      theme: "Motyw",
      dayTheme: "Dzień",
      nightTheme: "Noc",
      newChat: "Nowy czat",
      readyQuestions: "Gotowe pytania",
      selectQuestion: "Wybierz gotowe pytanie",
      messagePlaceholder: "Napisz lub wybierz gotowe pytanie",
      send: "Wyślij",
      visualAnswer: "Wizualna odpowiedź",
      detailsLink: "Szczegóły"
    },
    en: {
      appTitle: "AI Student Assistant",
      appSubtitle: "Prototype demo: working schedule module and simulated transition to a Microsoft Teams group.",
      schedule: "Schedule",
      assistant: "AI Assistant",
      details: "Details / Teams",
      zjazd: "Session",
      day: "Day",
      time: "Time",
      groups: "Groups",
      group: "Group",
      teacher: "Teacher",
      type: "Type",
      subjectName: "Subject name",
      subject: "Subject",
      search: "Search",
      all: "All",
      rendered: "Render",
      rows: "rows",
      results: "Results",
      aggregates: "aggregates",
      rawRecords: "Raw records",
      shown: "Showing",
      narrowFilters: "Narrow filters if needed.",
      noCards: "No cards for selected filters.",
      teamTransition: "Show Teams transition",
      toastTitle: "Teams",
      toastMessage: "Simulation: opening Teams group",
      demoBadge: "demo",
      dragTitle: "Drag to resize",
      language: "Language",
      theme: "Theme",
      dayTheme: "Day",
      nightTheme: "Night",
      newChat: "New chat",
      readyQuestions: "Ready questions",
      selectQuestion: "Select a ready question",
      messagePlaceholder: "Type or select a ready question",
      send: "Send",
      visualAnswer: "Visual answer",
      detailsLink: "Details"
    }
  };

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    i18nResources: {
      DEFAULT_LANGUAGE,
      RESOURCES,
      SUPPORTED_LANGUAGES
    }
  };
})(window);
