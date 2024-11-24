
const messageArea = document.getElementById('message-area');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');


const addMessage = (type, text) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  messageArea.appendChild(messageDiv);
  messageArea.scrollTop = messageArea.scrollHeight; 
};

sendBtn.addEventListener('click', () => {
  const message = chatInput.value.trim();
  if (message) {
    addMessage('chat', `You: ${message}`);
    chatInput.value = '';
  }
});


