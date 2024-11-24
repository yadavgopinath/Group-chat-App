document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    var errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none'; 
    errorMsg.innerText = '';
  
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var phone = document.getElementById('phone').value;
  
    

  
    
    if (name === '' || email === '' || password === '' || phone === '') {
      errorMsg.style.display = 'block'; 
      errorMsg.innerText = 'Please fill in all the required fields!';
      return; 
    }
    if (phone.length !== 10) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Please enter a 10-digit phone number!';
        return; 
      }
  
    var signupBtn = document.getElementById('signup-btn');
    var spinner = document.getElementById('loading-spinner');
  
    signupBtn.disabled = true;
    spinner.classList.remove('d-none');
  
    let data = {
      name: name,
      email: email,
      password: password,
      phoneno:phone
    };
  
   
 await    axios.post('http://localhost:3000/user/signup', data)
      .then(function(response) {
        var name = document.getElementById('name').value = '';
    var email = document.getElementById('email').value = '';
    var password = document.getElementById('password').value = '';
    var phone = document.getElementById('phone').value= '';
    alert('SingUp successfully:')
        console.log('Form submitted successfully:', response.data);
        window.location.href = '../Login/login.html';

        signupBtn.disabled = false;
        spinner.classList.add('d-none');
      })
      .catch(function(error) {
        
        
        errorMsg.style.display = 'block'; 
        errorMsg.innerText = error.response.data.message?error.response.data.message:'An error occurred. Please try again.';
        
        console.error('Error:', error);
        signupBtn.disabled = false;
        spinner.classList.add('d-none');
      })
     
  });