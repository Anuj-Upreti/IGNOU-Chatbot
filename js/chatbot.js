import { getTodayDate, getRandomGreeting } from './utils.js';
import { displayUserMessage } from './functions.js'; 
import { detectIntent } from './intentMatcher.js';
import { handleCourseQuery, generateCourseResponse, getPrimaryCourseName, loadCourseData, isDataReady } from './courseLogic.js';
import { getCourseIdFromURL } from './urlDetector.js';
import { displayBotMessage } from './responseHandler.js';
import { initChatUI } from './chatUI.js';
import { initFormListener } from './formListener.js';

import { currentCourseId, currentCourseName, pendingIntent } from './interactionState.js';

let courseId = 0;
let courseName = "IGNOU course";
let intentPending = null;

loadCourseData().then(() => {
  courseId = getCourseIdFromURL();
  courseName = getPrimaryCourseName(courseId);
});

function handleUserInput(userInput) {
  const cleanedInput = userInput.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!window.__suppressUserDisplay) displayUserMessage(userInput);
  window.__suppressUserDisplay = false;

  const intent = detectIntent(cleanedInput);
  const newCourseId = handleCourseQuery(cleanedInput);

  if (newCourseId && newCourseId !== courseId) {
    courseId = newCourseId;
    courseName = getPrimaryCourseName(courseId);
  }

  if (!intent && newCourseId && !intentPending) {
    if (isDataReady()) {
      const fee = generateCourseResponse('course_fee', newCourseId);
      const elig = generateCourseResponse('eligibility', newCourseId);
      const lastDate = "Last date for the admission process is 30 July 2025.";
      displayBotMessage(`${fee}\n\n${elig}\n\n${lastDate}`);
    } else {
      displayBotMessage("Please wait a moment while course data loads...");
    }
    return;
  }

  if (intentPending && !intent && newCourseId) {
    const response = generateCourseResponse(intentPending, courseId);
    intentPending = null;
    displayBotMessage(response);
    return;
  }

  if (intent) {
    intentPending = null;
  }

  let response = "Hmm, seems like I can't read that. Try a different course.";

  if (intent) {
    if (intent === 'course_fee' || intent === 'eligibility') {
      if (courseId === 0) {
        response = generateCourseResponse(intent, 0);
        intentPending = intent;
      } else {
        response = generateCourseResponse(intent, courseId);
      }
    } else {
      switch (intent) {
        case 'hello':
          response = "Hello, what can I help you with?";
          break;
        case 'ignou_what':
          response = "IGNOU is the largest open university in the world offering online and distance courses.";
          break;
        case 'ignou_courses':
          response = "IGNOU offers 300+ UG, PG, Diploma, & Certificate level courses in Science, Arts, and Humanities.";
          break;
        case 'ignou_contact':
          response = "Students can contact IGNOU via call at 📱29572513 and by post at IGNOU Maidan Garhi, New Delhi, India Pin Code: 110068";
          break;
        case 'admission_fees':
          response = `${courseName} admission fee is the first installment of course fee plus the university development fee of Rs. 200/-.`;
          break;
        case 'exam_fees':
          response = "To appear in the exam pay a fee of Rs. 200/- per theory subject and Rs. 300/- per practical subject.";
          break;
        case 'exam_date':
          response = "Term end examination will start from 12th June 2025 and will end on 19th July 2025.";
          break;
        case 'date_sheet':
          response = `To download the ${courseName} date sheet students can visit the IGNOU official website.`;
          break;
        case 'process':
          response = 'To apply, register on the IGNOU Samarth portal to create an account. After that, complete the student login to fill the form and pay the application fee.';
          break;
        case 'application_fee':
          response = "IGNOU 2025 July application fee for most courses is Rs. 300/-. However FLIP Courses need Rs. 500/-.";
          break;
        case 'flip_courses':
          response = "FLIP courses are PGDMCH, PGDGM, DNA, PGCMDM, CESEIVI, CESEIHI, CESEIID. They are mostly medical courses with fixed number of seats.";
          break;
        case 'start_dates':
          response = "Admission process will start from 15 July 2025.";
          break;
        case 'last_dates':
          response = "Last date for the admission process is 30 July 2025.";
          break;
        case 'study_material':
          response = `You can find ${courseName} study materials and PDFs on the eGyankosh portal and study centers.`;
          break;
        case 'hall_ticket':
          response = "You can download the hall ticket from IGNOU website.";
          break;
        case 'result':
          response = "Result will be declared 30 days after IGNOU term end exams.";
          break;
        case 'contact_class':
          response = "Check for the schedule of contact classes on the website of your Regional Center.";
          break;
        case 'assignment':
          response = `${courseName} assignments for July 2025 will be submitted at the study centers till 30 September 2025.`;
          break;
      }
    }
  }

  displayBotMessage(response);
}

document.addEventListener('DOMContentLoaded', () => {
  initChatUI();
  initFormListener();
});

export { handleUserInput };
