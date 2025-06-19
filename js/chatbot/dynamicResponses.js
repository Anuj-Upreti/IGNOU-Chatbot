// js/dynamicResponses.js
import { generateCourseResponse } from './courseLogic.js';

export function getDynamicResponse(intent, courseName, courseId) {
  switch (intent) {
    case 'admission_fees':
      return `${courseName} admission fee is the first installment of course fee plus the university development fee of Rs. 200/-.`;

    case 'date_sheet':
      return `To download the ${courseName} date sheet students can visit the IGNOU official website.`;

    case 'process':
      return 'To apply, register on the IGNOU Samarth portal to create an account. After that, complete the student login to fill the form and pay the application fee.';

    case 'application_fee':
      return "IGNOU 2025 July application fee for most courses is Rs. 300/-. However FLIP Courses need Rs. 500/-.";

    case 'flip_courses':
      return "FLIP courses are PGDMCH, PGDGM, DNA, PGCMDM, CESEIVI, CESEIHI, CESEIID. They are mostly medical courses with fixed number of seats.";

    case 'study_material':
      return `You can find ${courseName} study materials and PDFs on the eGyankosh portal and study centers.`;

    case 'assignment':
      return `${courseName} assignments for July 2025 will be submitted at the study centers till 30 September 2025.`;

    // Fallback for unknown
    default:
      return null;
  }
}
