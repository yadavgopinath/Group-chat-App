
document.addEventListener('DOMContentLoaded', function () {
  const messageArea = document.getElementById('message-area');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  
  const addMessage = (type, text) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messageArea.appendChild(messageDiv);
  };


  const loadMessages = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in to view messages.');
      window.location.href = '../Login/login.html';
      return;
    }

   
    const lastMessageId = localStorage.getItem('lastMessageId') || -1;

    axios
      .get(`http://localhost:3000/text/messages?lastMessageId=${lastMessageId}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const messages = response.data.messages;
        if (Array.isArray(messages) && messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          console.log(lastMessage);
        
          localStorage.setItem('lastMessageId', lastMessage.id);

          // Update the messages in localStorage (latest 10 messages)
          const storedMessages = JSON.parse(localStorage.getItem('storedMessages')) || [];
          const updatedMessages = [...storedMessages, ...messages]
            .slice(-10); // Keep only the latest 10 messages
          localStorage.setItem('storedMessages', JSON.stringify(updatedMessages));
        }
      })
      .catch((error) => {
        console.error('Error loading messages:', error);
      })
      .finally(() => {
        setTimeout(loadMessages, 1000); 
      });
  };

  // Display messages from localStorage
  const displayMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('storedMessages')) || [];
    messageArea.innerHTML = '';

    // Add messages from localStorage to the chat area
    storedMessages.forEach((msg) => {
      const text = `${msg.name}: ${msg.message}`;
      addMessage('chat', text);
    });

    
    messageArea.scrollTop = messageArea.scrollHeight;

    setTimeout(displayMessages, 1000); 
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
        //loadMessages();
        addMessage('chat', `You: ${message}`);
        chatInput.value = ''; 
        loadMessages(); 
        const messageArea = document.getElementById('message-area');
        messageArea.scrollTop = messageArea.scrollHeight; 
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      });
  });

  // Start the two continuous processes
  loadMessages(); 
  displayMessages(); 
});

