const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

function saveAuth(token, name, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', name);
  localStorage.setItem('userId', userId);
}

function getToken() { return localStorage.getItem('token'); }
function getUserId() { return localStorage.getItem('userId'); }
function isLoggedIn() { return !!getToken(); }

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

function toggleForm(e) {
  e.preventDefault();
  document.getElementById('loginForm').classList.toggle('active');
  document.getElementById('signupForm').classList.toggle('active');
}

function showMessage(id, text, isError) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'message ' + (isError ? 'error' : 'success');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm') && isLoggedIn()) {
    window.location.href = 'feed.html';
  }
});