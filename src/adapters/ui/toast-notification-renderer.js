// /asystent-studenta-ai-demo/src/adapters/ui/toast-notification-renderer.js
(function attachToastNotificationRenderer(global) {
  "use strict";

  function createToastNotificationRenderer(rootElement) {
    let containerElement = null;
    let dismissTimer = 0;

    function show(notification) {
      ensureContainer();
      clearTimer();

      containerElement.innerHTML = renderNotification(notification);
      containerElement.classList.add("is-visible");

      const toastElement = containerElement.querySelector(".toast-notification");
      if (toastElement) {
        toastElement.addEventListener("mouseenter", clearTimer);
        toastElement.addEventListener("mouseleave", scheduleHide);
      }

      scheduleHide();
    }

    function hide() {
      clearTimer();
      if (containerElement) {
        containerElement.classList.remove("is-visible");
      }
    }

    function ensureContainer() {
      if (!containerElement) {
        containerElement = document.createElement("div");
        containerElement.className = "toast-region";
        containerElement.setAttribute("aria-live", "polite");
        containerElement.setAttribute("aria-atomic", "true");
      }

      if (!containerElement.isConnected) {
        rootElement.appendChild(containerElement);
      }
    }

    function renderNotification(notification) {
      return `
        <aside class="toast-notification" role="status">
          <div>
            <strong>${escapeHtml(notification.title)}</strong>
            <p>${escapeHtml(notification.message)}</p>
          </div>
          <span>${escapeHtml(notification.badge)}</span>
        </aside>`;
    }

    function scheduleHide() {
      clearTimer();
      dismissTimer = window.setTimeout(hide, 4200);
    }

    function clearTimer() {
      if (dismissTimer) {
        window.clearTimeout(dismissTimer);
        dismissTimer = 0;
      }
    }

    return { hide, show };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    uiAdapters: {
      ...(global.AsystentStudentAiDemo.uiAdapters || {}),
      createToastNotificationRenderer
    }
  };
})(window);