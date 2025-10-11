// renderer.js
const form = document.getElementById('loginForm');
const btn = document.getElementById('btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await window.api.login(username, password);
  if (res && res.statusCode === 200) {
    sessionStorage.setItem('token', res.token)
    await window.api.openDashboard();
    // window.location.href = 'App/Pages/home.html';
  }
});