// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  // === Табы и секции ===
  const productsTab        = document.getElementById('products-tab');
  const usersTab           = document.getElementById('users-tab');
  const promoTab           = document.getElementById('promo-tab');

  const productListSection = document.getElementById('product-list-section');
  const userListSection    = document.getElementById('user-list-section');
  const promoListSection   = document.getElementById('promo-list-section');

  // === Промокоды: элементы управления ===
  const promoTableBody     = document.getElementById('promo-table-body');
  const createPromoBtn     = document.getElementById('create-promo-btn');
  const newPromoCode       = document.getElementById('new-promo-code');
  const newPromoDiscount   = document.getElementById('new-promo-discount');

  // === Модалки и формы товаров ===
  const imageModal         = document.getElementById('image-modal');
  const imageModalClose    = imageModal.querySelector('.modal-close');
  const imageModalImg      = document.getElementById('modal-img');
  const editModal          = document.getElementById('edit-modal');
  const editModalClose     = editModal.querySelector('.modal-close');
  const editForm           = document.getElementById('edit-form');
  const editImageInput     = document.getElementById('edit-image-input');
  const editImagePreview   = document.getElementById('edit-image-preview');

  // === Модалки и формы пользователей ===
  const userEditModal      = document.getElementById('user-edit-modal');
  const userEditClose      = userEditModal.querySelector('.user-edit-close');
  const userEditForm       = document.getElementById('user-edit-form');

  // Функция прячет все секции
  function hideAllSections() {
    productListSection.style.display = 'none';
    userListSection   .style.display = 'none';
    promoListSection  .style.display = 'none';
  }

  // === Навешиваем табы ===
  productsTab.addEventListener('click', async e => {
    e.preventDefault();
    hideAllSections();
    productListSection.style.display = 'block';
    await loadProducts();
  });

  usersTab.addEventListener('click', async e => {
    e.preventDefault();
    hideAllSections();
    userListSection.style.display = 'block';
    await loadUsers();
  });

  promoTab.addEventListener('click', async e => {
    e.preventDefault();
    hideAllSections();
    promoListSection.style.display = 'block';
    await loadPromos();
  });

  // Закрытие модалок крестиком
  imageModalClose.onclick   = () => imageModal.classList.remove('show');
  editModalClose.onclick    = () => editModal.classList.remove('show');
  userEditClose.onclick     = () => userEditModal.classList.remove('show');
  // Закрытие модалок при клике вне
  window.addEventListener('click', e => {
    if (e.target === imageModal)    imageModal.classList.remove('show');
    if (e.target === editModal)     editModal.classList.remove('show');
    if (e.target === userEditModal) userEditModal.classList.remove('show');
  });

  // === Загрузка и отрисовка товаров ===
  async function loadProducts() {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/products');
      const data = await res.json();
      data.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.size}</td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td><button class="view-image-btn">Посмотреть</button></td>
          <td>
            <button class="btn-edit">Редактировать</button>
            <button class="btn-delete">Удалить</button>
          </td>`;
        // события кнопок
        row.querySelector('.view-image-btn').onclick = () => {
          imageModalImg.src = product.image_url;
          imageModal.classList.add('show');
        };
        row.querySelector('.btn-edit').onclick = () => {
          document.getElementById('edit-id').value          = product.id;
          document.getElementById('edit-name').value        = product.name;
          document.getElementById('edit-category').value    = product.category;
          document.getElementById('edit-size').value        = product.size;
          document.getElementById('edit-price').value       = product.price;
          document.getElementById('edit-description').value = product.description;
          editImagePreview.src = product.image_url;
          editModal.classList.add('show');
        };
        row.querySelector('.btn-delete').onclick = async () => {
          if (!confirm('Удалить этот товар?')) return;
          await fetch(`http://localhost:3010/api/products/${product.id}`, { method: 'DELETE' });
          await loadProducts();
        };
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
    }
  }

  // Сохранение изменений товара
  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const updated = {
      name:        document.getElementById('edit-name').value,
      category:    document.getElementById('edit-category').value,
      size:        document.getElementById('edit-size').value,
      price:       document.getElementById('edit-price').value,
      description: document.getElementById('edit-description').value,
      image_url:   editImagePreview.src
    };
    try {
      const res = await fetch(`http://localhost:3010/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        editModal.classList.remove('show');
        await loadProducts();
      } else {
        console.error('Ошибка обновления:', await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  });
  editImageInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => editImagePreview.src = ev.target.result;
    reader.readAsDataURL(f);
  });

  // === Загрузка и отрисовка пользователей ===
  async function loadUsers() {
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/users');
      const users = await res.json();
      for (const u of users) {
        // получаем статус
        const statusRes = await fetch(`http://localhost:3010/api/user-status/${u.id}`);
        const { status } = await statusRes.json();
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${status}</td>
          <td>${u.role}</td>
          <td>${new Date(u.created_at).toLocaleString('ru')}</td>
          <td>
            <button class="btn-edit">Ред.</button>
            <button class="btn-delete">Удал.</button>
          </td>`;
        row.querySelector('.btn-edit').onclick = () => {
          document.getElementById('user-edit-id').value    = u.id;
          document.getElementById('user-edit-name').value  = u.name;
          document.getElementById('user-edit-email').value = u.email;
          document.getElementById('user-edit-role').value  = u.role;
          userEditModal.classList.add('show');
        };
        row.querySelector('.btn-delete').onclick = async () => {
          if (!confirm('Удалить пользователя?')) return;
          await fetch(`http://localhost:3010/api/users/${u.id}`, { method: 'DELETE' });
          await loadUsers();
        };
        tableBody.appendChild(row);
      }
    } catch (err) {
      console.error('Ошибка загрузки юзеров:', err);
    }
  }
  userEditForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('user-edit-id').value;
    const upd = {
      name:  document.getElementById('user-edit-name').value,
      email: document.getElementById('user-edit-email').value,
      role:  document.getElementById('user-edit-role').value
    };
    try {
      const res = await fetch(`http://localhost:3010/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upd)
      });
      if (res.ok) {
        userEditModal.classList.remove('show');
        await loadUsers();
      } else {
        console.error('Ошибка обновления юзера:', await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  });

  // === Загрузка и CRUD промокодов ===
  async function loadPromos() {
    promoTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/promocodes');
      const promos = await res.json();
      promos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.code}</td>
          <td>${p.discount}</td>
          <td>${new Date(p.created_at).toLocaleString('ru')}</td>
          <td><button class="btn-del-promo">Удалить</button></td>`;
        tr.querySelector('.btn-del-promo').onclick = async () => {
          if (!confirm('Удалить этот промокод?')) return;
          await fetch(`http://localhost:3010/api/promocodes/${p.id}`, { method: 'DELETE' });
          await loadPromos();
        };
        promoTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error('Ошибка загрузки промокодов:', err);
    }
  }
  createPromoBtn.addEventListener('click', async () => {
    const code     = newPromoCode.value.trim();
    const discount = parseFloat(newPromoDiscount.value);
    if (!code || !discount) {
      return alert('Введите код и размер скидки');
    }
    try {
      const res = await fetch('http://localhost:3010/api/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discount })
      });
      if (!res.ok) {
        const { message } = await res.json();
        return alert(message || 'Ошибка создания');
      }
      newPromoCode.value = '';
      newPromoDiscount.value = '';
      await loadPromos();
    } catch (err) {
      console.error(err);
    }
  });

  // === Инициализация ===
  hideAllSections();
  productListSection.style.display = 'block';
  loadProducts();
});