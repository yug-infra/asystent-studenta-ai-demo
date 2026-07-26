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
      const hasQuestionLimit = Number.isFinite(maxQuestions);
      const activeScene = getScene(safeState.activeSceneId);

      return {
        activeScene: activeScene ? { ...activeScene, id: safeState.activeSceneId } : null,
        input: safeState.input || "",
        isLimitReached: hasQuestionLimit && questionsUsed >= maxQuestions,
        maxQuestions,
        messages: (safeState.messages || []).map((message) => ({
          ...message,
          text: localize(message.text, lang)
        })),
        questions: catalog.QUESTIONS.map((question) => ({
          id: question.id,
          label: localize(question.label, lang)
        })),
        questionsLeft: hasQuestionLimit ? Math.max(0, maxQuestions - questionsUsed) : null,
        selectedQuestionId: safeState.selectedQuestionId || "",
        stats: {
          questionsUsed,
          maxQuestions
        }
      };
    }

    function setInput(state, value) {
      state.input = String(value || "");
      if (state.input.trim()) {
        state.selectedQuestionId = "";
      }
    }

    function setSelectedQuestion(state, questionId) {
      state.selectedQuestionId = String(questionId || "");
      state.input = "";
    }

    function submit(state) {
      const maxQuestions = catalog.MAX_DEMO_QUESTIONS;
      if (Number.isFinite(maxQuestions) && countStudentMessages(state) >= maxQuestions) {
        return { ok: false, reason: "limit" };
      }

      const question = findQuestion(state.selectedQuestionId);
      const inputText = String(state.input || "").trim();
      const questionText = question ? question.label : { pl: inputText, en: inputText };

      if (!question && !inputText) {
        return { ok: false, reason: "empty" };
      }

      const answer = question ? question.answer : {
        pl: "Czat nie jest jeszcze podłączony do realnego AI. Ten typ pytania jest zapisany jako sugestia do dalszej implementacji. Kliknij odpowiedź, aby zobaczyć scenę sugestii.",
        en: "The chat is not connected to real AI yet. This custom question is saved as a suggestion for future implementation. Click the answer to open the suggestion scene."
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

      state.activeSceneId = "";
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
