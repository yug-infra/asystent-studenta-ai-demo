// /asystent-studenta-ai-demo/src/domain/schedule/teachers.js
(function attachTeachers(global) {
  "use strict";

  const MANUAL_TEACHERS = [
    { id: "teacher_a", label: "Lecturer A", aliases: ["teacher_a", "lecturer a"] },
    { id: "teacher_b", label: "Lecturer B", aliases: ["teacher_b", "lecturer b"] },
    { id: "teacher_c", label: "Lecturer C", aliases: ["teacher_c", "lecturer c"] }
  ];

  global.AsystentStudentAiDemo = {
    ...(global.AsystentStudentAiDemo || {}),
    teachers: {
      MANUAL_TEACHERS
    }
  };
})(window);
