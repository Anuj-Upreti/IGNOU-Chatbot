// js/urlDetector.js

import { handleCourseQuery } from './courseLogic.js';

export function getCourseIdFromURL() {
  const path = window.location.pathname.toLowerCase();
  const match = path.match(/ignou-(.+?)-admission/);
  if (match && match[1]) {
    const slug = match[1].replace(/-/g, ' ');
    const courseId = handleCourseQuery(slug);
    console.log("Detected course from URL:", slug, " → courseId:", courseId);
    return courseId || 0;
  }
  return 0; // fallback to general course
}
