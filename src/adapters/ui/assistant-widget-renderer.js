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
          <div class="assistant-toolbar">
            <div>
              <p class="panel__kicker">${t("assistantDemoLabel")}</p>
              <strong>${t("assistantDemoValue")}</strong>
            </div>
            <div class="assistant-stats" aria-label="${t("assistantLimit")}">
              <span><strong>${model.stats.questionsUsed}</strong> / ${model.stats.maxQuestions} ${t("assistantQuestionsUsed")}</span>
              <span>${model.isLimitReached ? t("assistantLimitReached") : `${model.questionsLeft} ${t("assistantQuestionsLeft")}`}</span>
            </div>
          </div>
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
          <p class="panel__kicker">Demo / AWS</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(state.language === "en" ? `Completed ${done} of ${labs.length} labs` : `Wykonano ${done} z ${labs.length} laboratoriów`)}</p>
          <div class="assistant-progress" aria-hidden="true"><span style="width: ${progress}%"></span></div>
          <div class="assistant-lab-list">
            ${labs.map((lab) => renderLab(lab)).join("")}
          </div>
        </article>`;
    }

    function renderLab(lab) {
      const done = lab.status === "done";
      return `
        <article class="assistant-lab" data-status="${escapeAttribute(lab.status)}">
          <div>
            <strong>${done ? "✓" : "○"} ${escapeHtml(assistantService.localize(lab.title, state.language))}</strong>
            <span>${escapeHtml(done ? t("assistantDone") : t("assistantTodo"))}</span>
          </div>
          <button class="details-link" data-assistant-demo-action type="button">${escapeHtml(done && lab.score ? lab.score : t("open"))}</button>
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
                ${column.items.map((item) => `
                  <article class="assistant-resource-item">
                    <span>${escapeHtml(item)}</span>
                    <button class="details-link" data-assistant-demo-action type="button">${t("open")}</button>
                  </article>`).join("")}
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
                <button class="details-link" data-assistant-demo-action type="button">${t("open")}</button>
              </article>`).join("")}
          </div>
        </article>`;
    }

    function renderMeetingScene(scene) {
      return `
        <article class="assistant-scene-card">
          <p class="panel__kicker">${escapeHtml(scene.kicker)}</p>
          <h3>${escapeHtml(assistantService.localize(scene.title, state.language))}</h3>
          <p>${escapeHtml(assistantService.localize(scene.copy, state.language))}</p>
          <div class="assistant-form-preview">
            ${scene.formRows.map((row) => `
              <label>
                <span>${escapeHtml(assistantService.localize(row.label, state.language))}</span>
                <input value="${escapeAttribute(row.value)}" readonly>
              </label>`).join("")}
          </div>
          <button class="teams-button" data-assistant-demo-action type="button">${escapeHtml(assistantService.localize(scene.actionLabel, state.language))}</button>
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
        button.addEventListener("click", showDemoNotice);
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

    function showDemoNotice() {
      notifications.show({
        badge: t("demoBadge"),
        message: t("assistantDemoToastMessage"),
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
