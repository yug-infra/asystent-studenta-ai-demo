// /asystent-studenta-ai-demo/src/shared/i18n/index.js
(function attachI18nModule(global) {
  "use strict";

  const resources = global.AsystentStudentAiDemo.i18nResources;
  const translator = global.AsystentStudentAiDemo.i18nTranslator;

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    i18n: {
      DEFAULT_LANGUAGE: resources.DEFAULT_LANGUAGE,
      RESOURCES: resources.RESOURCES,
      SUPPORTED_LANGUAGES: resources.SUPPORTED_LANGUAGES,
      createTranslator: translator.createTranslator,
      getDictionary: translator.getDictionary,
      normalizeLanguage: translator.normalizeLanguage,
      translate: translator.translate
    }
  };
})(window);
