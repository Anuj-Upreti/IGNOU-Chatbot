import { staticResponses } from './staticResponses.js';
import { getDynamicResponse } from './dynamicResponses.js';
import { detectIntent } from '../functions/intentMatcher.js';
import { handleCourseQuery, generateCourseResponse, getPrimaryCourseName, loadCourseData, isDataReady } from '../courseLogic/courseLogic.js';
import { displayUserMessage } from '../functions/functions.js';
import { displayBotMessage } from '../script/responseHandler.js';
import { getCourseIdFromURL } from '../script/urlDetector.js';
import { initChatUI } from './chatUI.js'; // ✅ Import the function

initChatUI(); // ✅ This activates the minimize/maximize listeners?

let courseId = 0;
let courseName = "IGNOU course";
let pendingIntent = null;

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

  if (!intent && newCourseId && !pendingIntent) {
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

  if (pendingIntent && !intent && newCourseId) {
    const response = generateCourseResponse(pendingIntent, courseId);
    pendingIntent = null;
    displayBotMessage(response);
    return;
  }

  if (intent) {
    pendingIntent = null;
  }

  let response = "Hmm, seems like I can't read that. Try a different course.";

  if (intent) {
    if (intent === 'course_fee' || intent === 'eligibility') {
      if (courseId === 0) {
        response = generateCourseResponse(intent, 0);
        pendingIntent = intent;
      } else {
        response = generateCourseResponse(intent, courseId);
      }
    } else if (staticResponses[intent]) {
      response = staticResponses[intent];
    } else {
      const dynamic = getDynamicResponse(intent, courseName, courseId);
      if (dynamic) {
        response = dynamic;
      }
    }
  }

  displayBotMessage(response);
}

export { handleUserInput };
