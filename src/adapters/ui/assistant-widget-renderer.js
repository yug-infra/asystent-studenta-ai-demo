// /asystent-studenta-ai-demo/src/adapters/ui/assistant-widget-renderer.js
(function attachAssistantWidgetRenderer(global) {
  "use strict";

  function createAssistantWidgetRenderer(dependencies) {
    const state = dependencies.state;
    const t = dependencies.translate;
    const assistantService = dependencies.assistantService;
    const notifications = dependencies.notifications;
    const requestRender = dependencies.requestRender;

    function render() {
      const model = assistantService.getViewModel(state.assistant, state.language);

      return `
        <div class="assistant-widget">
          <div class="assistant-workspace">
            <section class="widget-panel assistant-chat-panel" aria-label="${t("assistantChat")}">
              <div class="widget-panel__header">
                <strong>${t("assistantChat")}</strong>
                <button class="details-link" data-assistant-clear type="button">${t("newChat")}</button>
              </div>
              <div class="assistant-ready-questions">
                <label class="filter-field assistant-question-field">
                  <span>${t("readyQuestions")}</span>
                  <select class="assistant-question-select" data-assistant-question ${model.isLimitReached ? "disabled" : ""}>
                    <option value="" disabled${model.selectedQuestionId ? "" : " selected"}>${t("selectQuestion")}</option>
                    ${model.questions.map((question) => renderQuestionOption(question, model.selectedQuestionId)).join("")}
                  </select>
                </label>
              </div>
              <div class="assistant-message-list" data-assistant-message-list aria-label="${t("assistantChat")}">
                ${model.messages.length ? model.messages.map(renderMessage).join("") : `<p class="empty-state">${t("assistantEmpty")}</p>`}
              </div>
              <form class="assistant-composer" data-assistant-submit>
                <input data-assistant-input type="text" value="${escapeAttribute(model.input)}" placeholder="${t("messagePlaceholder")}" ${model.isLimitReached ? "disabled" : ""}>
                <button class="teams-button" type="submit" ${model.isLimitReached || !model.input.trim() ? "disabled" : ""}>${t("send")}</button>
              </form>
            </section>
            <section class="widget-panel assistant-scene-panel" aria-label="${t("visualAnswer")}">
              <div class="widget-panel__header">
                <strong>${t("visualAnswer")}</strong>
                <span>${t("demoBadge")}</span>
              </div>
              <div class="assistant-scene">
                ${renderScene(model.activeScene)}
              </div>
            </section>
          </div>
        </div>`;
    }

    function renderQuestionOption(question, selectedQuestionId) {
      const selected = question.id === selectedQuestionId ? " selected" : "";
      return `<option value="${escapeAttribute(question.id)}"${selected}>${escapeHtml(question.label)}</option>`;
    }

    function renderMessage(message) {
      const action = message.role === "assistant" && message.sceneId
        ? ` data-assistant-open-scene="${escapeAttribute(message.sceneId)}"`
        : "";
      const hint = message.role === "assistant" && message.sceneId
        ? `<div class="assistant-message__hint"><span>${t("clickableHint")}</span><strong>${t("detailsLink")}</strong></div>`
        : "";

      return `
        <article class="assistant-message assistant-message--${escapeAttribute(message.role)}"${action}>
          <div class="assistant-message__bubble">
            <p>${escapeHtml(message.text)}</p>
            ${hint}
          </div>
        </article>`;
    }

    function renderScene(scene) {
      if (!scene) {
        return `
          <article class="assistant-scene-card assistant-scene-card--empty">
            <p class="panel__kicker">Prototype</p>
            <h3>${t("visualAnswer")}</h3>
            <p>${t("assistantSceneEmpty")}</p>
          </article>`;
      }

      if (scene.resourceColumns) return renderResourceScene(scene);
      if (scene.priorities) return renderPriorityScene(scene);
      if (scene.formRows) return renderMeetingScene(scene);
      if (scene.id === "aws-progress") return renderAwsProgressScene(scene);

      return renderMetricScene(scene);
    }

    function renderMetricScene(scene) {
      return `
        <article class="assistant-scene-card">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(assistantService.localize(scene.copy, state.language))}</p>
          <div class="assistant-metrics">
            ${(scene.metrics || []).map((metric) => `
              <div class="assistant-metric">
                <strong>${escapeHtml(metric.value)}</strong>
                <span>${escapeHtml(assistantService.localize(metric.label, state.language))}</span>
              </div>`).join("")}
          </div>
          ${scene.actionLabel ? `<button class="teams-button" data-assistant-demo-action type="button">${escapeHtml(assistantService.localize(scene.actionLabel, state.language))}</button>` : ""}
        </article>`;
    }

    function renderAwsProgressScene(scene) {
      const labs = assistantService.catalog.AWS_LABS;
      const done = labs.filter((lab) => lab.status === "done").length;
      const progress = Math.round((done / labs.length) * 100);

      return `
        <article class="assistant-scene-card">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(state.language === "en" ? `Completed ${done} of ${labs.length} labs - ${labs.length - done} remaining` : `Wykonano ${done} z ${labs.length} laboratoriów - Pozostało ${labs.length - done}`)}</p>
          <div class="assistant-progress" aria-hidden="true"><span style="width: ${progress}%"></span></div>
          <div class="assistant-lab-list">
            ${labs.map((lab) => renderLab(lab)).join("")}
          </div>
        </article>`;
    }

    function renderLab(lab) {
      const done = lab.status === "done";
      const actions = Array.isArray(lab.actions) && lab.actions.length ? lab.actions : [done ? "tests" : "task"];
      const actionLabels = {
        task: t("assistantAwsTask"),
        tests: t("assistantAwsTests"),
        theory: t("assistantAwsTheory")
      };
      const scoreMeta = done && lab.score
        ? `<p class="assistant-lab__meta">${escapeHtml(t("assistantAwsTestResult"))}: ${escapeHtml(lab.score)}. ${escapeHtml(t("assistantAwsTestsRepeat"))}</p>`
        : "";

      return `
        <article class="assistant-lab" data-status="${escapeAttribute(lab.status)}">
          <div class="assistant-lab__main">
            <span class="assistant-lab__mark" aria-hidden="true">${done ? "✓" : "○"}</span>
            <div class="assistant-lab__copy">
              <strong>${escapeHtml(assistantService.localize(lab.title, state.language))}</strong>
              <span>${escapeHtml(done ? t("assistantDone") : t("assistantTodo"))}</span>
            </div>
          </div>
          <div class="assistant-lab__actions">
            <div class="assistant-lab__action-row">
              ${actions.map((action) => `<button class="teams-button assistant-lab__action" data-assistant-demo-action="${escapeAttribute(action)}" type="button">${escapeHtml(actionLabels[action] || t("open"))}</button>`).join("")}
            </div>
            ${scoreMeta}
          </div>
        </article>`;
    }

    function renderResourceScene(scene) {
      return `
        <article class="assistant-scene-card">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(assistantService.localize(scene.copy, state.language))}</p>
          <div class="assistant-resource-grid">
            ${scene.resourceColumns.map((column) => `
              <section class="assistant-resource-column">
                <h4>${escapeHtml(assistantService.localize(column.title, state.language))}</h4>
                ${column.items.map((item) => {
                  const itemLabel = typeof item === "string" ? item : assistantService.localize(item.label, state.language);
                  const actionLabel = typeof item === "string" || !item.actionLabel ? t("open") : assistantService.localize(item.actionLabel, state.language);
                  const resource = typeof item === "string" ? "default" : (item.resource || "default");
                  return `
                    <article class="assistant-resource-item">
                      <span>${escapeHtml(itemLabel)}</span>
                      <button class="details-link" data-assistant-demo-action="${escapeAttribute(resource)}" type="button">${escapeHtml(actionLabel)}</button>
                    </article>`;
                }).join("")}
              </section>`).join("")}
          </div>
        </article>`;
    }

    function renderPriorityScene(scene) {
      return `
        <article class="assistant-scene-card">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(assistantService.localize(scene.copy, state.language))}</p>
          <div class="assistant-priority-list">
            ${scene.priorities.map((item) => `
              <article class="assistant-priority">
                <div>
                  <strong>${escapeHtml(assistantService.localize(item.title, state.language))}</strong>
                  <span>${escapeHtml(assistantService.localize(item.text, state.language))}</span>
                </div>
                ${assistantService.catalog.SCENES[item.sceneId] ? `<button class="details-link" data-assistant-scene-link="${escapeAttribute(item.sceneId)}" type="button">${t("open")}</button>` : `<button class="details-link" data-assistant-demo-action="default" type="button">${t("open")}</button>`}
              </article>`).join("")}
          </div>
        </article>`;
    }

    function renderMeetingScene(scene) {
      if (scene.meetingForm) return renderTeacherMeetingScene(scene);

      return `
        <article class="assistant-scene-card">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(assistantService.localize(scene.copy, state.language))}</p>
          <button class="teams-button" data-assistant-demo-action="${escapeAttribute(scene.actionResource || "default")}" type="button">${escapeHtml(assistantService.localize(scene.actionLabel, state.language))}</button>
        </article>`;
    }

    function renderTeacherMeetingScene(scene) {
      const form = scene.meetingForm;
      return `
        <article class="assistant-scene-card assistant-scene-card--meeting">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p class="assistant-meeting-note">${escapeHtml(assistantService.localize(scene.copy, state.language))}</p>
          <div class="assistant-meeting-fields">
            ${form.fields.map((field) => `
              <label>
                <span>${escapeHtml(assistantService.localize(field.label, state.language))}</span>
                <input value="${escapeAttribute(assistantService.localize(field.value, state.language) || field.value)}" readonly>
              </label>`).join("")}
          </div>
          <fieldset class="assistant-meeting-group">
            <legend>${escapeHtml(state.language === "en" ? "Profiles / full streams" : "Profile / całe strumienie")}</legend>
            <p>${escapeHtml(state.language === "en" ? "Selecting a profile selects all groups assigned to it." : "Zaznaczenie profilu podciąga wszystkie przypisane do niego grupy.")}</p>
            <div>${form.profiles.map((profile) => `<span class="assistant-chip is-selected">✓ ${escapeHtml(profile)}</span>`).join("")}</div>
          </fieldset>
          <fieldset class="assistant-meeting-group">
            <legend>${escapeHtml(state.language === "en" ? "Groups" : "Grupy")}</legend>
            <div>${form.groups.map((group) => `<span class="assistant-chip is-selected">✓ ${escapeHtml(group)}</span>`).join("")}</div>
          </fieldset>
          <div class="assistant-meeting-fields assistant-meeting-fields--schedule">
            ${form.schedule.map((field) => `
              <label>
                <span>${escapeHtml(assistantService.localize(field.label, state.language))}</span>
                <input value="${escapeAttribute(field.value)}" readonly>
              </label>`).join("")}
          </div>
          <label class="assistant-meeting-topic">
            <span>${escapeHtml(assistantService.localize(form.topic.label, state.language))}</span>
            <input value="${escapeAttribute(assistantService.localize(form.topic.value, state.language))}" readonly>
          </label>
          <button class="teams-button assistant-meeting-submit" data-assistant-demo-action="${escapeAttribute(scene.actionResource || "teacher-meeting")}" type="button">${escapeHtml(assistantService.localize(scene.actionLabel, state.language))}</button>
        </article>`;
    }

    function bind(rootElement) {
      const questionSelect = rootElement.querySelector("[data-assistant-question]");
      if (questionSelect) {
        questionSelect.addEventListener("change", () => {
          const selectedQuestionId = questionSelect.value;
          if (!selectedQuestionId) {
            assistantService.setSelectedQuestion(state.assistant, "");
            requestRender();
            return;
          }

          assistantService.setSelectedQuestion(state.assistant, selectedQuestionId);
          const result = assistantService.submit(state.assistant);
          if (!result.ok && result.reason === "limit") {
            showDemoNotice();
          }
          requestRender();
        });
      }

      const input = rootElement.querySelector("[data-assistant-input]");
      if (input) {
        const submitButton = rootElement.querySelector("[data-assistant-submit] button[type='submit']");
        const syncComposer = () => {
          assistantService.setInput(state.assistant, input.value);
          if (submitButton) {
            submitButton.disabled = countStudentMessages() >= assistantService.catalog.MAX_DEMO_QUESTIONS || !input.value.trim();
          }
        };

        input.addEventListener("input", syncComposer);
        input.addEventListener("change", syncComposer);
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            syncComposer();
          }
        });
      }

      const form = rootElement.querySelector("[data-assistant-submit]");
      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const currentInput = rootElement.querySelector("[data-assistant-input]");
          assistantService.setInput(state.assistant, currentInput ? currentInput.value : "");
          const result = assistantService.submit(state.assistant);
          if (!result.ok && result.reason === "limit") {
            showDemoNotice();
          }
          requestRender();
        });
      }

      rootElement.querySelectorAll("[data-assistant-open-scene]").forEach((button) => {
        button.addEventListener("click", () => {
          assistantService.openScene(state.assistant, button.dataset.assistantOpenScene);
          requestRender();
        });
      });

      rootElement.querySelectorAll("[data-assistant-scene-link]").forEach((button) => {
        button.addEventListener("click", () => {
          assistantService.openScene(state.assistant, button.dataset.assistantSceneLink);
          requestRender();
        });
      });

      rootElement.querySelectorAll("[data-assistant-demo-action]").forEach((button) => {
        button.addEventListener("click", () => showDemoNotice(button.dataset.assistantDemoAction || "default"));
      });

      queueChatScroll(rootElement);

      const clearButton = rootElement.querySelector("[data-assistant-clear]");
      if (clearButton) {
        clearButton.addEventListener("click", () => {
          assistantService.clear(state.assistant);
          requestRender();
        });
      }
    }

    function queueChatScroll(rootElement) {
      const list = rootElement.querySelector("[data-assistant-message-list]");
      if (!list || !(state.assistant.messages || []).length) return;

      requestAnimationFrame(() => {
        list.scrollTop = list.scrollHeight;
      });
    }

    function countStudentMessages() {
      return (state.assistant.messages || []).filter((message) => message.role === "student").length;
    }

    function showDemoNotice(action) {
      const messageKey = {
        default: "assistantDemoToastMessage",
        lab: "assistantAwsLabToast",
        lecture: "assistantAwsLectureToast",
        moodle: "assistantAwsMoodleToast",
        ondemand: "assistantAwsOnDemandToast",
        task: "assistantAwsTaskToast",
        teams: "assistantAwsTeamsToast",
        tests: "assistantAwsTestsToast",
        theory: "assistantAwsTheoryToast",
        "teacher-meeting": "assistantTeacherToastMessage"
      }[action || "default"] || "assistantDemoToastMessage";

      notifications.show({
        badge: t("demoBadge"),
        message: t(messageKey),
        title: t("assistantDemoToastTitle")
      });
    }

    return { bind, render };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    uiAdapters: {
      ...(global.AsystentStudentAiDemo.uiAdapters || {}),
      createAssistantWidgetRenderer
    }
  };
})(window);
