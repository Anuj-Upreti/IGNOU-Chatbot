// js/chatbot.js

import { getTodayDate, getRandomGreeting } from './utils.js';
import { displayUserMessage } from './functions.js'; 
import { detectIntent } from './intentMatcher.js';
import { handleCourseQuery, generateCourseResponse, getPrimaryCourseName, loadCourseData, isDataReady } from './courseLogic.js';
import { getCourseIdFromURL } from './urlDetector.js';

let currentCourseId = 0;
let currentCourseName = "IGNOU course";
let pendingIntent = null;
let isFirstInteraction = true;
let botReplyCount = 0;
const MAX_REPLIES_BEFORE_FORM = 3;

// Load course data before setting course ID
loadCourseData().then(() => {
  currentCourseId = getCourseIdFromURL();
  currentCourseName = getPrimaryCourseName(currentCourseId);
});

function handleUserInput(userInput) {
  const cleanedInput = userInput.trim().toLowerCase().replace(/\s+/g, ' ');

  if (!window.__suppressUserDisplay) {
    displayUserMessage(userInput);
  }
  window.__suppressUserDisplay = false;

  const intent = detectIntent(cleanedInput);
  const newCourseId = handleCourseQuery(cleanedInput);

  if (newCourseId && newCourseId !== currentCourseId) {
    currentCourseId = newCourseId;
    currentCourseName = getPrimaryCourseName(currentCourseId);
  }

  if (!intent && newCourseId && !pendingIntent) {
    if (isDataReady()) {
      const feeResponse = generateCourseResponse('course_fee', newCourseId);
      const eligibilityResponse = generateCourseResponse('eligibility', newCourseId);
      const lastDateResponse = "Last date for the admission process is 30 July 2025*.";
      const combined = `${feeResponse}\n\n${eligibilityResponse}\n\n${lastDateResponse}`;
      displayBotMessage(combined);
    } else {
      displayBotMessage("Please wait a moment while course data loads...");
    }
    return;
  }

  if (pendingIntent && !intent && newCourseId) {
    const response = generateCourseResponse(pendingIntent, currentCourseId);
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
      if (currentCourseId === 0) {
        response = generateCourseResponse(intent, 0);
        pendingIntent = intent;
      } else {
        response = generateCourseResponse(intent, currentCourseId);
      }
    } else {
      switch (intent) {
        case 'hello':
          response = `Hello, what can I help you with?`;
          break;
        case 'ignou_what':
          response = `IGNOU is the largest open university in the world offering online and distance courses.`;
          break;
        case 'ignou_courses':
          response = `IGNOU offers 300+ UG, PG, Diploma, & Certificate level courses in Science, Arts, and Humanities.`;
          break;
        case 'ignou_contact':
          response = `Students can contact IGNOU via call at 📱29572513 and by post at IGNOU Maidan Garhi, New Delhi, India Pin Code: 110068`;
          break;
        case 'admission_fees':
          response = `${currentCourseName} admission fee is the first installment of course fee plus the university development fee of Rs. 200/-.`;
          break;
        case 'exam_fees':
          response = "To appear in the exam pay a fee of Rs. 200/- per theory subject and Rs. 300/- per practical subject.";
          break;
        case 'exam_date':
          response = "Term end examination will start from 12th June 2025 and will end on 19th July 2025.";
          break;
        case 'date_sheet':
          response = `To download the ${currentCourseName} date sheet students can visit the IGNOU offcial website.`;
          break;
        case 'process':
          response = 'To apply, register on the IGNOU Samarth portal to create an account. After that, complete the student login to fill the form and pay the application fee.';
          break;
        case 'application_fee':
          response = "IGNOU 2025 July application fee for most courses is Rs. 300/-. However FLIP Courses need Rs. 500/-.";
          break;
        case 'flip_courses':
          response = "FLIP courses are PGDMCH, PGDGM, DNA, PGCMDM, CESEIVI, CESEIHI, CESEIID. They are mosyly medical coruses with fixed number of seats.";
          break;
        case 'start_dates':
          response = "Admission process will start from 15 July 2025.";
          break;
        case 'last_dates':
          response = "Last date for the admission process is 30 July 2025*.";
          break;
        case 'study_material':
          response = `You can find ${currentCourseName} study materials and PDFs on the eGyankosh portal and study centers.`;
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
          response = `${currentCourseName} assignments for July 2025 will be submitted at the study cetners till 30 September 2025*`;
          break;
      }
    }
  }

  isFirstInteraction = false;
  displayBotMessage(response);
}

function displayBotMessage(message) {
  const chatBox = document.getElementById('chat-box');
  const botDiv = document.createElement('div');
  botDiv.className = 'bot-message';
  botDiv.innerText = message;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  botReplyCount++;
  checkLeadFormTrigger();
}

function checkLeadFormTrigger() {
  const formAlreadyFilled = localStorage.getItem('lead_form_filled');
  if (botReplyCount >= MAX_REPLIES_BEFORE_FORM && formAlreadyFilled !== 'true') {
    openLeadForm();
  }
}

function openLeadForm() {
  const formOverlay = document.getElementById('lead-form-overlay');
  const formIframe = document.getElementById('lead-form-iframe');

  const formURL = window.__LEAD_FORM_URL__;
  if (!formURL) return;

  formIframe.src = formURL;
  formOverlay.style.display = 'block';
}

window.addEventListener('message', (e) => {
  if (e.data === 'formSubmitted') {
    document.getElementById('lead-form-overlay').style.display = 'none';
    localStorage.setItem('lead_form_filled', 'true');
  }
});

export { handleUserInput };
