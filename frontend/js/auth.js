async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage('loginMessage', data.message || 'Login failed.', true);
      return;
    }

    saveAuth(data.token, data.name, data.userId);
    window.location.href = 'feed.html';

  } catch (err) {
    showMessage('loginMessage', 'Server error.', true);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage('signupMessage', data.message || 'Signup failed.', true);
      return;
    }

    showMessage('signupMessage', 'Account created! Please login.', false);
    setTimeout(() => {
      document.getElementById('signupForm').classList.remove('active');
      document.getElementById('loginForm').classList.add('active');
    }, 1200);

  } catch (err) {
    showMessage('signupMessage', 'Server error.', true);
  }
}