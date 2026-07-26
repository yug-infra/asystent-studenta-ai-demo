// /asystent-studenta-ai-demo/src/application/assistant/assistant-service.js
(function attachAssistantService(global) {
  "use strict";

  function createAssistantService(catalog) {
    const meetingDictionary = catalog.MEETING_DICTIONARY || { subjects: [], teachers: [] };

    function createTeacherMeetingDefaultState() {
      const base = catalog.MEETING_DEFAULT_STATE || {};
      return { date: base.date || "2026-06-15", duration: base.duration || "90", groupIds: [...(base.groupIds || [])], profileIds: [...(base.profileIds || [])], subjectId: base.subjectId || "", teacherId: base.teacherId || "", time: base.time || "18:00", topic: base.topic || "" };
    }

    function createDefaultState() {
      return {
        activeSceneId: "",
        input: "",
        isThinking: false,
        messageSeq: 0,
        messages: [],
        pendingResponse: null,
        selectedQuestionId: "",
        teacherMeeting: createTeacherMeetingDefaultState()
      };
    }

    function hydrateState(value) {
      const defaults = createDefaultState();
      const source = value && typeof value === "object" ? value : {};
      const messages = Array.isArray(source.messages)
        ? source.messages.map(normalizeMessage).filter(Boolean).slice(-20)
        : [];
      const teacherMeeting = normalizeTeacherMeeting(source.teacherMeeting, defaults.teacherMeeting);

      return {
        ...defaults,
        activeSceneId: getScene(source.activeSceneId) ? source.activeSceneId : "",
        input: typeof source.input === "string" ? source.input : "",
        messageSeq: messages.reduce((max, message) => Math.max(max, extractMessageSeq(message.id)), 0),
        messages,
        selectedQuestionId: findQuestion(source.selectedQuestionId) ? source.selectedQuestionId : "",
        teacherMeeting
      };
    }

    function serializeState(state) {
      const safeState = state || createDefaultState();
      return {
        activeSceneId: getScene(safeState.activeSceneId) ? safeState.activeSceneId : "",
        input: String(safeState.input || ""),
        messages: (safeState.messages || []).map(normalizeMessage).filter(Boolean).slice(-20),
        selectedQuestionId: findQuestion(safeState.selectedQuestionId) ? safeState.selectedQuestionId : "",
        teacherMeeting: normalizeTeacherMeeting(safeState.teacherMeeting, createTeacherMeetingDefaultState())
      };
    }

    function getViewModel(state, lang) {
      const safeState = state || createDefaultState();
      const questionsUsed = countStudentMessages(safeState);
      const maxQuestions = catalog.MAX_DEMO_QUESTIONS;
      const hasQuestionLimit = Number.isFinite(maxQuestions);
      const activeScene = getScene(safeState.activeSceneId);
      const messages = (safeState.messages || []).map((message) => ({
        ...message,
        text: localize(message.text, lang)
      }));

      if (safeState.isThinking) {
        messages.push({
          id: "assistant_thinking",
          isThinking: true,
          role: "assistant",
          text: ""
        });
      }

      return {
        activeScene: activeScene ? { ...activeScene, id: safeState.activeSceneId } : null,
        input: safeState.input || "",
        isLimitReached: hasQuestionLimit && questionsUsed >= maxQuestions,
        isThinking: Boolean(safeState.isThinking),
        maxQuestions,
        messages,
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

    function beginSubmit(state) {
      if (state.isThinking) {
        return { ok: false, reason: "thinking" };
      }

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

      state.activeSceneId = "";
      state.input = "";
      state.isThinking = true;
      state.pendingResponse = { answer, sceneId };
      state.selectedQuestionId = "";

      return { ok: true, sceneId };
    }

    function completePendingResponse(state) {
      if (!state.isThinking || !state.pendingResponse) {
        return { ok: false, reason: "empty" };
      }

      const pendingResponse = state.pendingResponse;
      state.messageSeq += 1;
      state.messages.push({
        id: `assistant_message_${state.messageSeq}`,
        role: "assistant",
        sceneId: pendingResponse.sceneId,
        text: pendingResponse.answer
      });

      state.isThinking = false;
      state.pendingResponse = null;

      return { ok: true, sceneId: pendingResponse.sceneId };
    }

    function submit(state) {
      const result = beginSubmit(state);
      if (!result.ok) return result;
      completePendingResponse(state);
      return result;
    }

    function openScene(state, sceneId) {
      state.activeSceneId = getScene(sceneId) ? sceneId : "";
    }

    function clear(state) {
      state.activeSceneId = "";
      state.input = "";
      state.isThinking = false;
      state.messages = [];
      state.pendingResponse = null;
      state.selectedQuestionId = "";
    }

    function normalizeMessage(message) {
      if (!message || typeof message !== "object") return null;
      const role = message.role === "assistant" ? "assistant" : message.role === "student" ? "student" : "";
      if (!role) return null;
      const text = typeof message.text === "string" || (message.text && typeof message.text === "object")
        ? message.text
        : "";
      if (!text) return null;
      const normalized = {
        id: typeof message.id === "string" ? message.id : `assistant_message_${Date.now()}`,
        role,
        text
      };
      if (role === "assistant" && getScene(message.sceneId)) {
        normalized.sceneId = message.sceneId;
      }
      return normalized;
    }

    function normalizeTeacherMeeting(value, fallback) {
      const source = value && typeof value === "object" ? value : {};
      return {
        date: typeof source.date === "string" ? source.date : fallback.date,
        duration: typeof source.duration === "string" ? source.duration : String(fallback.duration || "90"),
        groupIds: Array.isArray(source.groupIds) ? source.groupIds.map(String) : [...(fallback.groupIds || [])],
        profileIds: Array.isArray(source.profileIds) ? source.profileIds.map(String) : [...(fallback.profileIds || [])],
        subjectId: typeof source.subjectId === "string" ? source.subjectId : fallback.subjectId,
        teacherId: typeof source.teacherId === "string" ? source.teacherId : fallback.teacherId,
        time: typeof source.time === "string" ? source.time : fallback.time,
        topic: typeof source.topic === "string" ? source.topic : fallback.topic
      };
    }

    function extractMessageSeq(messageId) {
      const match = String(messageId || "").match(/_(\d+)$/);
      return match ? Number(match[1]) || 0 : 0;
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


    function ensureTeacherMeeting(state) {
      if (!state.teacherMeeting) state.teacherMeeting = createTeacherMeetingDefaultState();
      return state.teacherMeeting;
    }

    function getTeacherMeetingSubject(state) {
      const meeting = ensureTeacherMeeting(state);
      return meetingDictionary.subjects.find((subject) => subject.id === meeting.subjectId) || meetingDictionary.subjects[0] || { id: "", label: { pl: "", en: "" }, profiles: [], teacherIds: [] };
    }

    function getTeacherMeetingViewModel(state, lang) {
      const meeting = ensureTeacherMeeting(state);
      const subject = getTeacherMeetingSubject(state);
      const selectedProfiles = new Set(meeting.profileIds || []);
      const availableGroups = (subject.profiles || []).filter((profile) => selectedProfiles.has(profile.id)).flatMap((profile) => profile.groups || []);
      meeting.groupIds = (meeting.groupIds || []).filter((groupId) => availableGroups.includes(groupId));
      const subjectTeacherIds = new Set(subject.teacherIds || []);
      const teachers = (meetingDictionary.teachers || []).map((teacher) => ({ ...teacher, isSubjectTeacher: subjectTeacherIds.has(teacher.id) })).sort((a, b) => Number(b.isSubjectTeacher) - Number(a.isSubjectTeacher) || a.label.localeCompare(b.label, "pl"));
      return { availableGroups, date: meeting.date || "", duration: meeting.duration || "90", groupIds: meeting.groupIds || [], profileIds: meeting.profileIds || [], profiles: subject.profiles || [], subject, subjectId: subject.id, subjects: meetingDictionary.subjects || [], teacherId: meeting.teacherId || "", teachers, time: meeting.time || "", topic: meeting.topic || (localize(subject.label, lang) + " - wykład") };
    }

    function setTeacherMeetingSubject(state, subjectId) {
      const meeting = ensureTeacherMeeting(state);
      const subject = (meetingDictionary.subjects || []).find((item) => item.id === subjectId) || getTeacherMeetingSubject(state);
      meeting.subjectId = subject.id;
      meeting.profileIds = (subject.profiles || []).map((profile) => profile.id);
      meeting.groupIds = (subject.profiles || []).flatMap((profile) => profile.groups || []);
      const teacherIds = subject.teacherIds || [];
      if (!teacherIds.includes(meeting.teacherId)) meeting.teacherId = teacherIds[0] || meetingDictionary.defaultTeacherId || ((meetingDictionary.teachers || [])[0] || {}).id || "";
      const title = localize(subject.label, "pl");
      meeting.topic = title ? title + " - wykład" : meeting.topic;
    }

    function setTeacherMeetingTeacher(state, teacherId) { ensureTeacherMeeting(state).teacherId = String(teacherId || ""); }
    function setTeacherMeetingProfile(state, profileId, checked) {
      const meeting = ensureTeacherMeeting(state);
      const subject = getTeacherMeetingSubject(state);
      const profile = (subject.profiles || []).find((item) => item.id === profileId);
      meeting.profileIds = checked ? [...new Set([...(meeting.profileIds || []), profileId])] : (meeting.profileIds || []).filter((item) => item !== profileId);
      if (!profile) return;
      meeting.groupIds = checked ? [...new Set([...(meeting.groupIds || []), ...(profile.groups || [])])] : (meeting.groupIds || []).filter((groupId) => !(profile.groups || []).includes(groupId));
    }
    function setTeacherMeetingGroup(state, groupId, checked) {
      const meeting = ensureTeacherMeeting(state);
      meeting.groupIds = checked ? [...new Set([...(meeting.groupIds || []), groupId])] : (meeting.groupIds || []).filter((item) => item !== groupId);
    }
    function setTeacherMeetingField(state, field, value) {
      if (["date", "duration", "time", "topic"].includes(field)) ensureTeacherMeeting(state)[field] = String(value || "");
    }

    return {
      catalog,
      beginSubmit,
      clear,
      completePendingResponse,
      createDefaultState,
      getTeacherMeetingViewModel,
      getViewModel,
      hydrateState,
      localize,
      openScene,
      serializeState,
      setTeacherMeetingField,
      setTeacherMeetingGroup,
      setTeacherMeetingProfile,
      setTeacherMeetingSubject,
      setTeacherMeetingTeacher,
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
