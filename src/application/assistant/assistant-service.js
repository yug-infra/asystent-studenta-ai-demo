// /asystent-studenta-ai-demo/src/application/assistant/assistant-service.js
(function attachAssistantService(global) {
  "use strict";

  function createAssistantService(catalog) {
    function createDefaultState() {
      return {
        activeSceneId: "",
        input: "",
        messageSeq: 0,
        messages: [],
        selectedQuestionId: ""
      };
    }

    function getViewModel(state, lang) {
      const safeState = state || createDefaultState();
      const questionsUsed = countStudentMessages(safeState);
      const maxQuestions = catalog.MAX_DEMO_QUESTIONS;
      const activeScene = getScene(safeState.activeSceneId);

      return {
        activeScene,
        input: safeState.input || "",
        isLimitReached: questionsUsed >= maxQuestions,
        maxQuestions,
        messages: (safeState.messages || []).map((message) => ({
          ...message,
          text: localize(message.text, lang)
        })),
        questions: catalog.QUESTIONS.map((question) => ({
          id: question.id,
          label: localize(question.label, lang)
        })),
        questionsLeft: Math.max(0, maxQuestions - questionsUsed),
        selectedQuestionId: safeState.selectedQuestionId || "",
        stats: {
          questionsUsed,
          maxQuestions
        }
      };
    }

    function setInput(state, value) {
      state.input = String(value || "");
    }

    function setSelectedQuestion(state, questionId) {
      state.selectedQuestionId = String(questionId || "");
      const question = findQuestion(state.selectedQuestionId);
      state.input = question ? localize(question.label, "pl") : state.input;
    }

    function submit(state) {
      if (countStudentMessages(state) >= catalog.MAX_DEMO_QUESTIONS) {
        return { ok: false, reason: "limit" };
      }

      const question = findQuestion(state.selectedQuestionId);
      const inputText = String(state.input || "").trim();
      const questionText = question ? question.label : { pl: inputText, en: inputText };

      if (!question && !inputText) {
        return { ok: false, reason: "empty" };
      }

      const answer = question ? question.answer : {
        pl: "To pytanie nie ma jeszcze gotowej odpowiedzi w publicznym demo. Kliknij odpowiedź, aby zobaczyć scenę sugestii.",
        en: "This question does not have a prepared answer in the public demo yet. Click the answer to open the suggestion scene."
      };
      const sceneId = question ? question.sceneId : "feedback";

      state.messageSeq += 1;
      state.messages.push({
        id: `assistant_message_${state.messageSeq}`,
        role: "student",
        text: questionText
      });

      state.messageSeq += 1;
      state.messages.push({
        id: `assistant_message_${state.messageSeq}`,
        role: "assistant",
        sceneId,
        text: answer
      });

      state.activeSceneId = sceneId;
      state.input = "";
      state.selectedQuestionId = "";

      return { ok: true, sceneId };
    }

    function openScene(state, sceneId) {
      state.activeSceneId = getScene(sceneId) ? sceneId : "";
    }

    function clear(state) {
      state.activeSceneId = "";
      state.input = "";
      state.messages = [];
      state.selectedQuestionId = "";
    }

    function getScene(sceneId) {
      if (!sceneId) return null;
      return catalog.SCENES[sceneId] || null;
    }

    function findQuestion(questionId) {
      return catalog.QUESTIONS.find((question) => question.id === questionId) || null;
    }

    function countStudentMessages(state) {
      return (state.messages || []).filter((message) => message.role === "student").length;
    }

    function localize(value, lang) {
      if (!value) return "";
      if (typeof value === "string") return value;
      return value[lang] || value.pl || value.en || "";
    }

    return {
      catalog,
      clear,
      createDefaultState,
      getViewModel,
      localize,
      openScene,
      setInput,
      setSelectedQuestion,
      submit
    };
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    assistantApplication: {
      createAssistantService
    }
  };
})(window);
