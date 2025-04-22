// 🔐 Авторизация пользователя
async function loginUser(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3010/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'account.html';
      } else {
        alert(data.message || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Ошибка логина:', error);
      alert('Ошибка сервера');
    }
  }
  
  // 👤 Регистрация пользователя
  async function registerUser(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:3010/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Регистрация успешна! Выполните вход.');
        window.location.href = 'login.html';
      } else {
        alert(data.message || 'Ошибка при регистрации');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Ошибка сервера');
    }
  }
  
  // 👤 Загрузка профиля
  async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';
  
    try {
      const response = await fetch('http://localhost:3010/api/profile', {
        headers: { Authorization: 'Bearer ' + token }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        document.getElementById('username').textContent = data.name;
        document.getElementById('useremail').textContent = data.email;
      } else {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      }
    } catch (err) {
      console.error('Ошибка профиля:', err);
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  }
  
  // 🔁 Смена пароля
  async function changePassword(event) {
    event.preventDefault();
  
    const token = localStorage.getItem('token');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
  
    try {
      const response = await fetch('http://localhost:3010/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
  
      const data = await response.json();
      alert(data.message || 'Не удалось сменить пароль');
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      alert('Ошибка сервера');
    }
  }
  
  // 🚪 Выход из аккаунта
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  // 🧠 Автозапуск по страницам
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
  
    if (path.includes('account.html')) {
      loadProfile();
    }
  });
  