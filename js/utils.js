// js/utils.js

// Get today's date nicely formatted
export function getTodayDate() {
  const today = new Date();
  return today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Pick a random greeting
export function getRandomGreeting() {
  const greetings = [
    "Here you go!",
    "Found it for you!",
    "Got it!",
    "This might help!",
    "Hope this answers your question!"
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}
