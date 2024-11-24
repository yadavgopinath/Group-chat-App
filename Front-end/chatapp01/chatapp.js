
const messageInput = document.getElementById('chat-input');  
const sendButton = document.getElementById('send-btn');



sendButton.addEventListener('click', function() {
  const message = messageInput.value.trim(); 

  if (message === '') {
    alert('Please enter a message!');
    return;
  }

 
  const token = localStorage.getItem('token');
  

  if (!token) {
    alert('You need to be logged in to send a message.');
    return;
  }

  // Create the message payload
  const payload = {
    message: message
  };

  axios.post('http://localhost:3000/text/message', payload,{headers:{'Authorization':token}})
  .then(response => {
    
    console.log('Message sent:', response.data);
    
    messageInput.value = '';
  })
  .catch(error => {
   
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try again.');
  });
});
