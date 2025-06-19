// js/chatbot/chatUI.js
function initChatUI() {
  const chatContainer = document.getElementById('chat-container');
  const minimizeBtn = document.getElementById('minimize-btn');

  if (!chatContainer || !minimizeBtn) return;

  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatContainer.classList.add('minimized');
  });

  chatContainer.addEventListener('click', () => {
    if (chatContainer.classList.contains('minimized')) {
      chatContainer.classList.remove('minimized');
    }
  });
}

export { initChatUI };
