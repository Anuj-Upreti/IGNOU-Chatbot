// js/chatbot/responseHandler.js
import { incrementReplyCount, shouldTriggerLeadForm } from './stateTracker.js';

function displayBotMessage(message) {
  const chatBox = document.getElementById('chat-box');
  const botDiv = document.createElement('div');
  botDiv.className = 'bot-message';
  botDiv.innerText = message;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  incrementReplyCount();
  if (shouldTriggerLeadForm()) openLeadForm();
}

function openLeadForm() {
  const formURL = window.__LEAD_FORM_URL__;
  if (!formURL) return;
  const formIframe = document.getElementById('lead-form-iframe');
  formIframe.src = formURL;
  document.getElementById('lead-form-overlay').style.display = 'block';
}

export { displayBotMessage, openLeadForm };
