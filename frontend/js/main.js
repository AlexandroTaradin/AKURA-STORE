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
      // Сохраняем токен и пользователя
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email
      }));

      // Переход в профиль
      window.location.href = 'account.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Server error');
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
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return window.location.href = 'login.html';
  }

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
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  } catch (err) {
    console.error('Ошибка профиля:', err);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// 🧠 Автозапуск по страницам + обновление шапки
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const user = JSON.parse(localStorage.getItem('user'));
  const loginLink = document.getElementById('loginLink');

  // 1️⃣ Если это страница аккаунта — загружаем профиль
  if (path.includes('account.html')) {
    loadProfile();
  }

  // 2️⃣ Обновление кнопки входа на всех страницах
  if (user && loginLink) {
    loginLink.textContent = 'My Profile';
    loginLink.href = 'account.html';
  }

  // 3️⃣ Обработка выхода, если есть кнопка
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      }
    });
  }
});
