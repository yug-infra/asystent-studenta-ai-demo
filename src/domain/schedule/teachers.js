// /asystent-studenta-ai-demo/src/domain/schedule/teachers.js
(function attachTeachers(global) {
  "use strict";

  const MANUAL_TEACHERS = [
    { id: "p_zaskorski", label: "prof. dr hab. inż. P. Zaskórski", aliases: ["p_zaskorski", "p zaskorski", "p. zaskórski", "p zaskórski", "pzask"] },
    { id: "z_gniazdowski", label: "dr hab. inż. Z. Gniazdowski", aliases: ["z_gniazdowski", "z. gniazdowski"] },
    { id: "e_figielska", label: "dr inż. E. Figielska", aliases: ["e_figielska", "e. figielska"] },
    { id: "w_labuda", label: "dr inż. W. Łabuda", aliases: ["w_labuda", "w. łabuda", "w labu"] },
    { id: "d_chaladyniak", label: "dr inż. D. Chaładyniak", aliases: ["d_chaladyniak", "d. chaładyniak"] },
    { id: "t_siemek", label: "dr inż. T. Siemek", aliases: ["t_siemek", "t. siemek"] },
    { id: "d_palka", label: "dr inż. D. Pałka", aliases: ["d_palka", "d. pałka"] },
    { id: "p_figat", label: "dr inż. P. Figat", aliases: ["p_figat", "p. figat"] },
    { id: "j_markus", label: "dr inż. J. Markus", aliases: ["j_markus", "j. markus"] },
    { id: "s_supernak", label: "dr inż. S. Supernak", aliases: ["s_supernak", "s. supernak"] },
    { id: "r_jezierski", label: "mgr inż. R. Jezierski", aliases: ["r_jezierski", "r. jezierski"] },
    { id: "a_ptasznik", label: "mgr inż. A. Ptasznik", aliases: ["a_ptasznik", "a. ptasznik"] },
    { id: "m_stys", label: "mgr inż. M. Styś", aliases: ["m_stys", "m. styś", "m stys"] },
    { id: "m_pytlik", label: "mgr inż. M. Pytlik", aliases: ["m_pytlik", "m. pytlik"] },
    { id: "a_chaladyniak", label: "mgr inż. A. Chaładyniak", aliases: ["a_chaladyniak", "a. chaładyniak"] },
    { id: "a_zylawski", label: "mgr A. Żyławski", aliases: ["a_zylawski", "a. żyławski"] },
    { id: "m_iwaszko", label: "mgr M. Iwaszko", aliases: ["m_iwaszko", "m. iwaszko"] },
    { id: "m_golos", label: "inż. M. Gołoś", aliases: ["m_golos", "m. gołoś"] }
  ];

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    teachers: {
      MANUAL_TEACHERS
    }
  };
})(window);
