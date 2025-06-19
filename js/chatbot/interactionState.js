// js/interactionState.js
let currentCourseId = 0;
let currentCourseName = "IGNOU course";
let pendingIntent = null;
let isFirstInteraction = true;
let botReplyCount = 0;

function resetInteractionState() {
  currentCourseId = 0;
  currentCourseName = "IGNOU course";
  pendingIntent = null;
  isFirstInteraction = true;
  botReplyCount = 0;
}

export {
  currentCourseId,
  currentCourseName,
  pendingIntent,
  isFirstInteraction,
  botReplyCount,
  resetInteractionState
};
