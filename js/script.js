// js/script.js

import { handleUserInput as chatbotHandleUserInput } from './chatbot.js';
import { simulateTyping, showOptions } from './functions.js';

window.onload = () => {
  const inputField = document.getElementById('user-input');
  const sendButton = document.getElementById('send-btn');

  simulateTyping("What do you want to know?", showOptions);

  sendButton.addEventListener('click', () => {
    const userInput = inputField.value;
    if (userInput.trim() !== "") {
      chatbotHandleUserInput(userInput); 
      inputField.value = ''; 
    }
  });

  inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const userInput = inputField.value;
      if (userInput.trim() !== "") {
        chatbotHandleUserInput(userInput); 
        inputField.value = ''; 
      }
    }
  });
};
