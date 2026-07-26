// /asystent-studenta-ai-demo/data/ai-demo-catalog.js
(function attachAiDemoCatalog(global) {
  "use strict";

  const MAX_DEMO_QUESTIONS = null;

  const QUESTIONS = [
    {
      id: "next-class",
      sceneId: "next-class",
      label: {
        pl: "Jakie mam teraz zajęcia?",
        en: "What class do I have now?"
      },
      answer: {
        pl: "Znalazłem najbliższe zajęcia i przygotowałem kartę z godziną, grupą oraz demonstracyjnym przejściem do Teams. Kliknij tę odpowiedź, aby zobaczyć szczegóły po prawej.",
        en: "I found the nearest class and prepared a card with time, group and a demo Teams transition. Click this answer to see the details on the right."
      }
    },
    {
      id: "aws-progress",
      sceneId: "aws-progress",
      label: {
        pl: "Co zostało mi jeszcze z AWS?",
        en: "What do I still need to complete in AWS?"
      },
      answer: {
        pl: "W demo ukończone są 3 z 8 laboratoriów AWS. Po prawej mogę pokazać pasek postępu i listę zadań do domknięcia.",
        en: "In the demo, 3 of 8 AWS labs are complete. On the right, I can show a progress bar and the remaining task list."
      }
    },
    {
      id: "aws-resources",
      sceneId: "aws-resources",
      label: {
        pl: "Pokaż wszystkie zasoby do AWS",
        en: "Show all AWS resources"
      },
      answer: {
        pl: "Asystent może zebrać wykłady, laboratoria i dodatkowe materiały AWS w jednym ekranie. Przyciski są demonstracyjne i wymagają późniejszego API.",
        en: "The assistant can collect AWS lectures, labs and extra materials in one screen. The buttons are demo-only and need a future API."
      }
    },
    {
      id: "learning-priority",
      sceneId: "learning-priority",
      label: {
        pl: "Od czego powinienem zacząć naukę?",
        en: "Where should I start learning?"
      },
      answer: {
        pl: "Demo rekomendacji wskazuje najpierw AWS, potem bazy danych i krótką pracę seminaryjną. Kliknij, aby zobaczyć priorytety.",
        en: "The demo recommendation points first to AWS, then databases and a short seminar note. Click to see priorities."
      }
    },
    {
      id: "teacher-meeting",
      sceneId: "teacher-meeting",
      label: {
        pl: "Dodaj spotkanie do kalendarza Teams",
        en: "Add a meeting to the Teams calendar"
      },
      answer: {
        pl: "Dla prowadzącego można przygotować spotkanie i dobrać grupy. Dodanie wydarzenia do Teams Calendar pozostaje demonstracją do czasu podłączenia API.",
        en: "For a teacher, the assistant can prepare a meeting and select groups. Adding it to Teams Calendar remains demo-only until an API is connected."
      }
    }
  ];

  const AWS_LABS = [
    { id: "lab-1", title: { pl: "Laboratorium 1 - Wprowadzenie do AWS", en: "Lab 1 - Introduction to AWS" }, status: "done", actions: ["tests"], score: "8/10" },
    { id: "lab-2", title: { pl: "Laboratorium 2 - EC2 i maszyny wirtualne", en: "Lab 2 - EC2 and virtual machines" }, status: "done", actions: ["tests"], score: "9/10" },
    { id: "lab-3", title: { pl: "Laboratorium 3 - Sieci VPC", en: "Lab 3 - VPC networking" }, status: "done", actions: ["tests"], score: "10/10" },
    { id: "lab-4", title: { pl: "Laboratorium 4 - IAM i polityki dostępu", en: "Lab 4 - IAM and access policies" }, status: "todo", actions: ["theory", "task"] },
    { id: "lab-5", title: { pl: "Laboratorium 5 - Amazon S3", en: "Lab 5 - Amazon S3" }, status: "todo", actions: ["theory", "task"] },
    { id: "lab-6", title: { pl: "Laboratorium 6 - Bazy danych RDS", en: "Lab 6 - RDS databases" }, status: "todo", actions: ["task"] },
    { id: "lab-7", title: { pl: "Laboratorium 7 - AWS Lambda", en: "Lab 7 - AWS Lambda" }, status: "todo", actions: ["theory", "task"] },
    { id: "lab-8", title: { pl: "Laboratorium 8 - Monitoring i CloudWatch", en: "Lab 8 - Monitoring and CloudWatch" }, status: "todo", actions: ["theory"] }
  ];

  const SCENES = {
    "next-class": {
      kicker: "Teams / Plan zajęć",
      title: { pl: "Najbliższe zajęcia", en: "Nearest class" },
      copy: { pl: "Bazy danych · 18:00 · grupa MZ201", en: "Databases · 18:00 · group MZ201" },
      metrics: [
        { value: "18:00", label: { pl: "Godzina", en: "Time" } },
        { value: "MZ201", label: { pl: "Grupa", en: "Group" } },
        { value: "Teams", label: { pl: "Kontekst", en: "Context" } }
      ],
      actionLabel: { pl: "Pokaż przejście Teams", en: "Show Teams transition" }
    },
    "aws-progress": {
      kicker: "Demo / dane uczelniane",
      title: { pl: "AWS - laboratoria do wykonania", en: "AWS labs to complete" },
      copy: { pl: "Wykonano 3 z 8 laboratoriów - Pozostało 5", en: "Completed 3 of 8 labs - 5 remaining" }
    },
    "aws-resources": {
      kicker: "Demo / centrum zasobów",
      title: { pl: "Wszystkie zasoby AWS", en: "All AWS resources" },
      copy: { pl: "W jednym miejscu możesz przejść do nagrań, laboratoriów oraz materiałów dodatkowych.", en: "Open recordings, labs and extra materials from one place." },
      resourceColumns: [
        {
          title: { pl: "Wykłady i nagrania", en: "Lectures and recordings" },
          items: [
            { label: { pl: "Wykład 1 - Wprowadzenie do chmury AWS", en: "Lecture 1 - Introduction to AWS cloud" }, resource: "lecture" },
            { label: { pl: "Wykład 2 - EC2 i sieci VPC", en: "Lecture 2 - EC2 and VPC networking" }, resource: "lecture" },
            { label: { pl: "Wykład 3 - S3, RDS i Lambda", en: "Lecture 3 - S3, RDS and Lambda" }, resource: "lecture" },
            { label: { pl: "Wykład 4 - Bezpieczeństwo i monitoring", en: "Lecture 4 - Security and monitoring" }, resource: "lecture" }
          ]
        },
        {
          title: { pl: "Laboratoria", en: "Laboratories" },
          items: AWS_LABS.map((lab) => ({ label: lab.title, resource: "lab" }))
        },
        {
          title: { pl: "Literatura i platformy", en: "Literature and platforms" },
          items: [
            { label: { pl: "Dokumentacja i materiały prowadzącego", en: "Documentation and lecturer materials" }, resource: "teams", actionLabel: { pl: "Otwórz Teams", en: "Open Teams" } },
            { label: { pl: "Materiały, zadania i ogłoszenia", en: "Materials, assignments and announcements" }, resource: "moodle", actionLabel: { pl: "Otwórz Moodle", en: "Open Moodle" } },
            { label: { pl: "Materiały praktyczne i testy AWS", en: "AWS practical materials and tests" }, resource: "ondemand", actionLabel: { pl: "Otwórz OnDemand", en: "Open OnDemand" } }
          ]
        }
      ]
    },
    "learning-priority": {
      kicker: "Demo / AI mentor",
      title: { pl: "Rekomendacja mentora", en: "Mentor recommendation" },
      copy: { pl: "Priorytety są przygotowane jako fixture i później mogą pochodzić z realnych integracji.", en: "Priorities are prepared as fixtures and can later come from real integrations." },
      priorities: [
        { title: "AWS", text: { pl: "5 laboratoriów do wykonania", en: "5 labs to complete" }, sceneId: "aws-progress" },
        { title: { pl: "Bazy danych", en: "Databases" }, text: { pl: "2 zadania do oddania", en: "2 assignments to submit" }, toastAction: "mentor-databases" },
        { title: { pl: "Seminarium", en: "Seminar" }, text: { pl: "1 krótka notatka", en: "1 short note" }, toastAction: "mentor-seminar" }
      ]
    },
    "teacher-meeting": {
      kicker: "Demo / prowadzący",
      title: { pl: "Dodaj spotkanie do kalendarza Teams", en: "Add a meeting to Teams calendar" },
      copy: { pl: "To jest wersja demonstracyjna. W systemie docelowym prowadzący zobaczy tylko przedmioty, profile, grupy i innych prowadzących dostępnych zgodnie z uprawnieniami konta.", en: "This is a demo version. In the target system, the teacher will only see subjects, profiles, groups and other teachers available according to account permissions." },
      meetingForm: {
        fields: [
          { label: { pl: "Przedmiot", en: "Subject" }, value: "Eksploracja danych" },
          { label: { pl: "Prowadzący / inicjator spotkania", en: "Teacher / meeting initiator" }, value: "dr hab. inż. Z. Gniazdowski" },
          { label: { pl: "Tryb i semestr", en: "Mode and semester" }, value: { pl: "Studia niestacjonarne - 2 semestr", en: "Part-time studies - semester 2" } }
        ],
        profiles: ["UMiSI", "BSiST", "BD&AB", "IO FullDev", "TIZCO", "ID DatabaseDev", "ZP"],
        groups: ["MZ201 (UMiSI)", "MZ201 L (UMiSI)", "MZ202 (BSiST)", "MZ202 L (BSiST)", "MZ203 (BD&AB)", "MZ203 L (BD&AB)", "MZ204 (IO FullDev)", "MZ204 L (IO FullDev)", "MZ205 (TIZCO)", "MZ205 L (TIZCO)", "MZ206 (ID DatabaseDev)", "MZ206 L (ID DatabaseDev)", "MZ207 (ZP)", "MZ207 L (ZP)"],
        schedule: [
          { label: { pl: "Data", en: "Date" }, value: "15.06.2026" },
          { label: { pl: "Godzina", en: "Time" }, value: "18:00" },
          { label: { pl: "Czas trwania", en: "Duration" }, value: "90 min" }
        ],
        topic: { label: { pl: "Temat spotkania", en: "Meeting topic" }, value: { pl: "Eksploracja danych - wykład", en: "Data mining - lecture" } }
      },
      actionLabel: { pl: "Dodaj spotkanie do Teams", en: "Add meeting to Teams" },
      actionResource: "teacher-meeting"
    },
    feedback: {
      kicker: "Prototype / demo",
      title: { pl: "Sugestia dla twórców", en: "Suggestion for creators" },
      copy: { pl: "To pytanie nie ma jeszcze gotowej odpowiedzi. W pełnej wersji może trafić do backlogu lub zostać obsłużone przez prawdziwy model AI.", en: "This question has no prepared answer yet. In the full version, it could go to the backlog or be handled by a real AI model." }
    }
  };

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    aiDemoCatalog: {
      AWS_LABS,
      MAX_DEMO_QUESTIONS,
      QUESTIONS,
      SCENES
    }
  };
})(window);
