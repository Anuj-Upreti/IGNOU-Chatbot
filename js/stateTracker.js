// js/stateTracker.js
let botReplyCount = 0;
const MAX_REPLIES_BEFORE_FORM = 3;

function incrementReplyCount() {
  botReplyCount++;
}

function shouldTriggerLeadForm() {
  const filled = localStorage.getItem('lead_form_filled');
  return botReplyCount >= MAX_REPLIES_BEFORE_FORM && filled !== 'true';
}

export { incrementReplyCount, shouldTriggerLeadForm };
