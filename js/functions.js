// js/functions.js

import { chatbotOptions } from './options.js';
import { handleUserInput as chatbotHandleUserInput } from './chatbot.js';

function simulateTyping(text, callback) {
    const chatBox = document.getElementById('chat-box');
    const botDiv = document.createElement('div');
    botDiv.className = 'bot-message';
    chatBox.appendChild(botDiv);

    let index = 0;
    const typingSpeed = 50;

    function typeChar() {
        if (index < text.length) {
            botDiv.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeChar, typingSpeed);
        } else {
            // ⬇️ Ensure scroll after typing
            chatBox.scrollTop = chatBox.scrollHeight;
            callback();
        }
    }

    typeChar();
}

function showOptions() {
    
    const chatBox = document.getElementById('chat-box');
    chatbotOptions.forEach(option => {
        // console.log(chatbotOptions); // to debug cached display
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = option;
        button.addEventListener('click', () => {
         window.__suppressUserDisplay = true; // prevent duplicate display in chatbot.js
         displayUserMessage(option);          // display button text with original casing
         chatbotHandleUserInput(option.toLowerCase()); // process with lowercase logic
         });

        chatBox.appendChild(button);
        button.style.opacity = 0;
        setTimeout(() => {
            button.style.opacity = 1;
            button.style.transform = 'translateY(0)';
        }, 100);
    });
}

function displayUserMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const userDiv = document.createElement('div');
    userDiv.className = 'user-message';
    userDiv.innerText = message;
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayBotMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const botDiv = document.createElement('div');
    botDiv.className = 'bot-message';
    botDiv.innerText = message;
    chatBox.appendChild(botDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

export { simulateTyping, showOptions, displayUserMessage, displayBotMessage };
