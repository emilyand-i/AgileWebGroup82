
/**
 * AUTHENTICATION & USER MANAGEMENT
 * Functions for user login and registration
 */





// Login form
export function LoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const fetch_login = await fetch('/api/login', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    
    const login_data = await fetch_login.json();
    if (fetch_login.ok) {
      window.location.href = 'dashboard.html';
    } else {
      alert(login_data.error || 'Login failed');
    }
  });
}

// Registration form
export function SignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;
  
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const pass_confirm = document.getElementById('confirm-password').value;
    
    if (password != pass_confirm) {
      alert('Password does not match');
      return;
    }

    const fetch_signup = await fetch('/api/register', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, email, password})
    });
    
    const signup_data = await fetch_signup.json();
    if (fetch_signup.ok) {
      alert('Account created! Please log in.');
      flipForm();
    } else {
      alert(signup_data.error || 'Signup error. Please check details.')
    }
  });
}
