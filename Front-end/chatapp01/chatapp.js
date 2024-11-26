document.addEventListener('DOMContentLoaded', function () {
    const messageArea = document.getElementById('message-area');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
  
    // Function to add messages dynamically
    const addMessage = (type, text) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = text;
      messageArea.appendChild(messageDiv);
      messageArea.scrollTop = messageArea.scrollHeight; // Auto-scroll to the bottom
    };
  
    // Load messages from the server
    const loadMessages = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in to view messages.');
        return;
      }
  
      axios
        .get('http://localhost:3000/text/messages', {
          headers: { Authorization: token },
        })
        .then((response) => {
          const messages = response.data.messages; // Extract the `messages` array
          if (Array.isArray(messages)) {
            messageArea.innerHTML = ''; // Clear existing messages
            messages.forEach((msg) => {
              const text = `${msg.name}: ${msg.message}`;
              addMessage('chat', text); // Add message with 'chat' type
            });
          } else {
            console.error('Invalid response format: messages should be an array');
          }
        })
        .catch((error) => {
          console.error('Error loading messages:', error);
          alert('Failed to load messages. Please try again.');
        });
    };
  
    // Send a new message
    sendBtn.addEventListener('click', () => {
      const message = chatInput.value.trim();
  
      if (!message) {
        alert('Please enter a message!');
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to send a message.');
        return;
      }
  
      const payload = { message };
      axios
        .post('http://localhost:3000/text/message', payload, {
          headers: { Authorization: token },
        })
        .then(() => {
          addMessage('chat', `You: ${message}`);
          chatInput.value = ''; // Clear input
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          alert('Failed to send message. Please try again.');
        });
    });
  
    // Initial loading of messages
   // setInterval(loadMessages,1000);
    loadMessages();
  });
  