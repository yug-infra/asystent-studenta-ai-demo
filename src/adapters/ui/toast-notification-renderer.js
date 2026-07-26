// /asystent-studenta-ai-demo/src/adapters/ui/toast-notification-renderer.js
(function attachToastNotificationRenderer(global) {
  "use strict";

  function createToastNotificationRenderer(rootElement) {
    let containerElement = null;
    const activeTimers = new WeakMap();

    function show(notification) {
      ensureContainer();

      const toastElement = document.createElement("aside");
      toastElement.className = "toast-notification";
      toastElement.setAttribute("role", "status");
      toastElement.innerHTML = renderNotification(notification);
      containerElement.appendChild(toastElement);

      const timers = { hide: 0, remove: 0 };
      activeTimers.set(toastElement, timers);

      toastElement.addEventListener("mouseenter", () => clearTimers(toastElement));
      toastElement.addEventListener("mouseleave", () => scheduleHide(toastElement));

      window.requestAnimationFrame(() => {
        toastElement.classList.add("is-visible");
      });

      scheduleHide(toastElement);
    }

    function hide() {
      if (!containerElement) return;

      Array.from(containerElement.querySelectorAll(".toast-notification")).forEach((toastElement) => {
        clearTimers(toastElement);
        beginDismiss(toastElement);
      });
    }

    function ensureContainer() {
      if (!containerElement) {
        containerElement = document.createElement("div");
        containerElement.className = "toast-region";
        containerElement.setAttribute("aria-live", "polite");
        containerElement.setAttribute("aria-atomic", "false");
      }

      if (!containerElement.isConnected) {
        rootElement.appendChild(containerElement);
      }
    }

    function renderNotification(notification) {
      return `
        <div>
          <strong>${escapeHtml(notification.title)}</strong>
          <p>${escapeHtml(notification.message)}</p>
        </div>
        <span>${escapeHtml(notification.badge)}</span>`;
    }

    function scheduleHide(toastElement) {
      clearTimers(toastElement);
      const timers = activeTimers.get(toastElement) || { hide: 0, remove: 0 };
      timers.hide = window.setTimeout(() => beginDismiss(toastElement), 5200);
      activeTimers.set(toastElement, timers);
    }

    function beginDismiss(toastElement) {
      if (!toastElement || toastElement.classList.contains("is-leaving")) return;

      toastElement.classList.add("is-leaving");
      toastElement.classList.remove("is-visible");

      const timers = activeTimers.get(toastElement) || { hide: 0, remove: 0 };
      timers.remove = window.setTimeout(() => {
        activeTimers.delete(toastElement);
        toastElement.remove();
      }, 2100);
      activeTimers.set(toastElement, timers);
    }

    function clearTimers(toastElement) {
      const timers = activeTimers.get(toastElement);
      if (!timers) return;

      if (timers.hide) {
        window.clearTimeout(timers.hide);
        timers.hide = 0;
      }

      if (timers.remove) {
        window.clearTimeout(timers.remove);
        timers.remove = 0;
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
