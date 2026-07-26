// /asystent-studenta-ai-demo/src/adapters/teams/teams-transition-adapter.js
(function attachTeamsTransitionAdapter(global) {
  "use strict";

  function createTeamsTransitionAdapter(dependencies) {
    const notifications = dependencies.notifications;
    const translate = dependencies.translate;

    function openScheduleItem(scheduleItem) {
      if (!notifications || typeof notifications.show !== "function") {
        return;
      }

      notifications.show({
        title: translate("toastTitle"),
        message: translate("toastMessage"),
        badge: translate("demoBadge"),
        meta: scheduleItem ? {
          teamName: scheduleItem.teamName,
          subjectCode: scheduleItem.subjectCode
        } : null
      });
    }

    return { openScheduleItem };
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    teamsAdapters: {
      ...(global.AsystentStudentAiDemo.teamsAdapters || {}),
      createTeamsTransitionAdapter
    }
  };
})(window);
