// /asystent-studenta-ai-demo/src/shared/i18n/translator.js
(function attachTranslator(global) {
  "use strict";

  const resources = global.AsystentStudentAiDemo.i18nResources;
  const { DEFAULT_LANGUAGE, RESOURCES, SUPPORTED_LANGUAGES } = resources;

  function normalizeLanguage(language) {
    return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  }

  function getDictionary(language) {
    const lang = normalizeLanguage(language);
    return RESOURCES[lang] || RESOURCES[DEFAULT_LANGUAGE];
  }

  function translate(language, key) {
    const dictionary = getDictionary(language);
    const fallbackDictionary = RESOURCES[DEFAULT_LANGUAGE];

    return dictionary[key] || fallbackDictionary[key] || key;
  }

  function createTranslator(getLanguage) {
    return function t(key) {
      return translate(getLanguage(), key);
    };
  }

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    i18nTranslator: {
      createTranslator,
      getDictionary,
      normalizeLanguage,
      translate
    }
  };
})(window);
