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
      const lastDate = "Last date for the admission process is 30 July 2025*.";
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
    const commonIntents = {
      hello: `Hello, what can I help you with?`,
      ignou_what: `IGNOU is the largest open university in the world...`,
      ignou_courses: `IGNOU offers 300+ UG, PG, Diploma, & Certificate level courses...`,
      ignou_contact: `Students can contact IGNOU via 📱29572513 or by post at IGNOU Maidan Garhi...`,
      admission_fees: `${courseName} admission fee is...`,
      exam_fees: `Exam fee is Rs. 200/- per theory subject and Rs. 300/- per practical...`,
      // more...
    };

    if (intent in commonIntents) {
      response = commonIntents[intent];
    } else if (intent === 'course_fee' || intent === 'eligibility') {
      if (courseId === 0) {
        response = generateCourseResponse(intent, 0);
        intentPending = intent;
      } else {
        response = generateCourseResponse(intent, courseId);
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