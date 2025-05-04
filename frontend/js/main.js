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
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email
      }));

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

  if (path.includes('account.html')) {
    loadProfile();
  }

  if (user && loginLink) {
    loginLink.textContent = 'My Profile';
    loginLink.href = 'account.html';
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        logout();
      }
    });
  }

  const applyBtn = document.getElementById('applyFiltersBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }

  loadCategoriesWithCount();
  loadSizesWithCount();
  loadColorsWithCount();
});

function applyFilters() {
  const selectedCategories = [...document.querySelectorAll('#categoryFilters input:checked')].map(el => el.value);
  const selectedSizes = [...document.querySelectorAll('#sizeFilters input:checked')].map(el => el.value);
  const selectedColors = [...document.querySelectorAll('#colorFilters input:checked')].map(el => el.value);
  const sortBy = document.getElementById('sortSelect').value;

  const minInput = document.getElementById('minPrice');
  const maxInput = document.getElementById('maxPrice');

  const minVal = document.getElementById('minPrice').value;
  const maxVal = document.getElementById('maxPrice').value;
  
  
  
  const body = {
    categories: selectedCategories,
    sizes: selectedSizes,
    colors: selectedColors,
    sortBy
  };



  fetch('http://localhost:3010/api/products/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('product-container');
      container.innerHTML = '';

      if (products.length === 0) {
        container.innerHTML = '<p>Нет подходящих товаров.</p>';
        return;
      }

      products.forEach(p => {
        const card = document.createElement('a');
        card.href = `product.html?id=${p.id}`;
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${p.image_url}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.price}€</p>
        `;
        container.appendChild(card);
      });

      document.getElementById('filterPanel').classList.remove('show');
    })
    .catch(err => {
      console.error('Ошибка фильтрации:', err);
      alert('Ошибка фильтрации: ' + err.message);
    });
}

function toggleFilterSection(el) {
  const group = el.nextElementSibling;
  const icon = el.querySelector('.toggle-icon');
  if (group.style.display === 'none') {
    group.style.display = 'block';
    icon.textContent = '−';
  } else {
    group.style.display = 'none';
    icon.textContent = '+';
  }
}

function toggleShowMore(el) {
  const labels = el.parentElement.querySelectorAll('label');
  labels.forEach((label, index) => {
    if (index >= 5) {
      label.style.display = label.style.display === 'none' ? 'block' : 'none';
    }
  });

  el.textContent = el.textContent === 'Show more' ? 'Show less' : 'Show more';
}

document.addEventListener('DOMContentLoaded', () => {
  const sizeLabels = document.querySelectorAll('#sizeFilters label');
  sizeLabels.forEach((label, index) => {
    if (index >= 5) {
      label.style.display = 'none';
    }
  });
});

function loadCategoriesWithCount() {
  fetch('http://localhost:3010/api/categories-with-count')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('categoryFilters');
      if (!container) return;

      container.innerHTML = '';
      data.forEach(({ category, count }) => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" value="${category}">
          ${category} <span class="count">(${count})</span>
        `;
        container.appendChild(label);
      });
    })
    .catch(err => {
      console.error('❌ Ошибка загрузки категорий с количеством:', err);
    });
}

function loadSizesWithCount() {
  fetch('http://localhost:3010/api/sizes-with-count')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('sizeFilters');
      if (!container) return;

      container.innerHTML = '';
      data.forEach(({ size, count }) => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" value="${size}">
          ${size} <span class="count">(${count})</span>
        `;
        container.appendChild(label);
      });
    })
    .catch(err => {
      console.error('❌ Ошибка загрузки размеров:', err);
    });
}

function loadColorsWithCount() {
  fetch('http://localhost:3010/api/colors-with-count')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('colorFilters');
      if (!container) return;

      container.innerHTML = '';
      data.forEach(({ color, count }) => {
        const label = document.createElement('label');
        label.classList.add('color-option');
        label.innerHTML = `
          <input type="checkbox" value="${color}">
          <span class="color-box" style="background-color: ${color.toLowerCase()};"></span>
          ${color} <span class="count">(${count})</span>
        `;
        container.appendChild(label);
      });
    })
    .catch(err => {
      console.error('❌ Ошибка загрузки цветов:', err);
    });
}

fetch('http://localhost:3010/api/products/price-range')
  .then(res => res.json())
  .then(({ min, max }) => {
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');
    const minLabel = document.getElementById('minPriceDisplay');
    const maxLabel = document.getElementById('maxPriceDisplay');

    minInput.min = minInput.value = min;
    maxInput.max = maxInput.value = max;

    minLabel.textContent = min;
    maxLabel.textContent = max;

    minInput.oninput = () => minLabel.textContent = minInput.value;
    maxInput.oninput = () => maxLabel.textContent = maxInput.value;
  });
