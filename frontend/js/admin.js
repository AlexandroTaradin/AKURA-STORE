// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  // === Табы и секции ===
  const productsTab = document.getElementById('products-tab');
  const usersTab = document.getElementById('users-tab');
  const promoTab = document.getElementById('promo-tab');
  const orderTab = document.getElementById('order-tab');
  const archiveTab = document.getElementById('archive-tab');

  const productListSection = document.getElementById('product-list-section');
  const userListSection = document.getElementById('user-list-section');
  const promoListSection = document.getElementById('promo-list-section');
  const orderListSection = document.getElementById('order-list-section');
  const archiveListSection = document.getElementById('archive-list-section');

  // === Тела таблиц ===
  const productsTableBody = document.getElementById('products-table-body');
  const usersTableBody = document.getElementById('users-table-body');
  const promoTableBody = document.getElementById('promo-table-body');
  const ordersTableBody = document.getElementById('orders-table-body');
  const archiveTableBody = document.getElementById('archive-table-body');

  // === Промокоды: элементы управления ===
  const createPromoBtn = document.getElementById('create-promo-btn');
  const newPromoCode = document.getElementById('new-promo-code');
  const newPromoDiscount = document.getElementById('new-promo-discount');

  // === Модалки и формы товаров ===
  const imageModal = document.getElementById('image-modal');
  const imageModalClose = imageModal.querySelector('.modal-close');
  const imageModalImg = document.getElementById('modal-img');
  const editModal = document.getElementById('edit-modal');
  const editModalClose = editModal.querySelector('.modal-close');
  const editForm = document.getElementById('edit-form');
  const editImagePreview = document.getElementById('edit-image-preview');
  const editImagePath = document.getElementById('edit-image-path');

  // === Модалка добавления товара ===
  const addModal = document.getElementById('add-modal');
  const addModalClose = addModal.querySelector('.add-close');
  const addForm = document.getElementById('add-form');
  const addImagePreview = document.getElementById('add-image-preview');
  const addImagePathInput = document.getElementById('add-image-path');

  // === Модалки и формы пользователей ===
  const userEditModal = document.getElementById('user-edit-modal');
  const userEditClose = userEditModal.querySelector('.user-edit-close');
  const userEditForm = document.getElementById('user-edit-form');

  // Цвета и список статусов
  const statuses = [
    {value:'Новый заказ', label:'❗ Новый заказ'},
    {value:'Подтверждён', label:'Подтверждён'},
    {value:'Готовится к отправке', label:'Готовится к отправке'},
    {value:'Передан в доставку', label:'Передан в доставку'},
    {value:'В доставке', label:'В доставке'},
    {value:'Отменён', label:'Отменён'},
    {value:'Оформлен возврат', label:'Оформлен возврат'}
  ];

  // ================= Основные функции =================

  // Скрыть все секции
  function hideAllSections() {
    productListSection.style.display = 'none';
    userListSection.style.display = 'none';
    promoListSection.style.display = 'none';
    orderListSection.style.display = 'none';
    archiveListSection.style.display = 'none';
  }

  // Навигация по табам
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

  orderTab.addEventListener('click', async e => {
    e.preventDefault();
    hideAllSections();
    orderListSection.style.display = 'block';
    await loadOrders();
  });

  archiveTab.addEventListener('click', async e => {
    e.preventDefault();
    hideAllSections();
    archiveListSection.style.display = 'block';
    await loadArchive();
  });

  // Закрытие модалок
  imageModalClose.onclick = () => imageModal.classList.remove('show');
  editModalClose.onclick = () => editModal.classList.remove('show');
  addModalClose.onclick = () => addModal.classList.remove('show');
  userEditClose.onclick = () => userEditModal.classList.remove('show');

  window.addEventListener('click', e => {
    if (e.target === imageModal) imageModal.classList.remove('show');
    if (e.target === editModal) editModal.classList.remove('show');
    if (e.target === addModal) addModal.classList.remove('show');
    if (e.target === userEditModal) userEditModal.classList.remove('show');
  });

  // ================= Функции для товаров =================

  // Загрузка списка товаров
  async function loadProducts() {
  productsTableBody.innerHTML = '';
  try {
    // Загружаем товары, категории и размеры одновременно
    const [productsRes, categoriesRes, sizesRes] = await Promise.all([
      fetch('http://localhost:3010/api/products'),
      fetch('http://localhost:3010/api/categories'),
      fetch('http://localhost:3010/api/sizes')
    ]);
    
    const products = await productsRes.json();
    const categories = await categoriesRes.json();
    const sizes = await sizesRes.json();

    // Создаем объекты для быстрого поиска
    const categoriesMap = new Map(categories.map(c => [c.id, c.name]));
    const sizesMap = new Map(sizes.map(s => [s.id, s.name]));

    products.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${categoriesMap.get(p.category_id) || '—'}</td>
        <td>${sizesMap.get(p.size_id) || '—'}</td>
        <td>${p.price}</td>
        <td class="description-cell">${p.description || '—'}</td>
        <td><button class="view-image-btn">Посмотреть</button></td>
        <td>
          <button class="btn-edit">Редактировать</button>
          <button class="btn-delete">Удалить</button>
        </td>
      `;
        
        // Просмотр изображения
        row.querySelector('.view-image-btn').onclick = () => {
          imageModalImg.src = p.image_url || '';
          imageModal.classList.add('show');
        };
        
        // Редактирование товара
        row.querySelector('.btn-edit').onclick = async () => {
          await openEditModal(p);
        };
        
        // Удаление товара
        row.querySelector('.btn-delete').onclick = async () => {
          if (!confirm('Удалить этот товар?')) return;
          await fetch(`http://localhost:3010/api/products/${p.id}`, {method: 'DELETE'});
          loadProducts();
        };
        
        productsTableBody.appendChild(row);
      });
    } catch(e) {
      console.error('Ошибка загрузки товаров:', e);
    }
  }

  // Открытие модалки редактирования
  async function openEditModal(product) {
    try {
      // Загружаем категории и размеры
      const [categoriesRes, sizesRes] = await Promise.all([
        fetch('http://localhost:3010/api/categories'),
        fetch('http://localhost:3010/api/sizes')
      ]);
      
      const categories = await categoriesRes.json();
      const sizes = await sizesRes.json();
      
      // Заполняем форму
      document.getElementById('edit-id').value = product.id;
      document.getElementById('edit-name').value = product.name;
      document.getElementById('edit-price').value = product.price;
      document.getElementById('edit-description').value = product.description || '';
      
      // Заполняем категории
      const categorySelect = document.getElementById('edit-category');
      categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
      categories.forEach(cat => {
        const option = new Option(cat.name, cat.id);
        if (product.category_id == cat.id) option.selected = true;
        categorySelect.add(option);
      });
      
      // Заполняем размеры
      const sizeSelect = document.getElementById('edit-size');
      sizeSelect.innerHTML = '<option value="">Выберите размер</option>';
      sizes.forEach(size => {
        const option = new Option(size.name, size.id);
        if (product.size_id == size.id) option.selected = true;
        sizeSelect.add(option);
      });
      
      // Заполняем изображение
      const imagePath = product.image_url ? product.image_url.replace('assets/img/', '') : '';
      editImagePath.value = imagePath;
      editImagePreview.src = product.image_url || '';
      
      editModal.classList.add('show');
    } catch(e) {
      console.error('Ошибка открытия модалки редактирования:', e);
      alert('Не удалось загрузить данные для редактирования');
    }
  }

  // Сохранение изменений товара
  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const payload = {
      name: document.getElementById('edit-name').value,
      category_id: parseInt(document.getElementById('edit-category').value) || null,
      size_id: parseInt(document.getElementById('edit-size').value) || null,
      price: parseFloat(document.getElementById('edit-price').value),
      description: document.getElementById('edit-description').value,
      image_url: editImagePath.value ? 'assets/img/' + editImagePath.value.trim() : null
    };
    
    try {
      const res = await fetch(`http://localhost:3010/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        editModal.classList.remove('show');
        await loadProducts();
      } else {
        const error = await res.text();
        throw new Error(error);
      }
    } catch(error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить изменения: ' + error.message);
    }
  });

  // ================= Добавление товара =================

  // Открытие модалки добавления
  window.openAddModal = async () => {
    try {
      await Promise.all([loadCategories(), loadSizes()]);
      addModal.classList.add('show');
    } catch(e) {
      console.error('Ошибка открытия модалки добавления:', e);
      alert('Не удалось загрузить данные для добавления');
    }
  };

  // Загрузка категорий для добавления
  async function loadCategories() {
    const res = await fetch('http://localhost:3010/api/categories');
    const categories = await res.json();
    const select = document.getElementById('add-category');
    
    select.innerHTML = '<option value="">Выберите категорию</option>';
    categories.forEach(cat => {
      const option = new Option(cat.name, cat.id);
      select.add(option);
    });
  }

  // Загрузка размеров для добавления
  async function loadSizes() {
    const res = await fetch('http://localhost:3010/api/sizes');
    const sizes = await res.json();
    const select = document.getElementById('add-size');
    
    select.innerHTML = '<option value="">Выберите размер</option>';
    sizes.forEach(size => {
      const option = new Option(size.name, size.id);
      select.add(option);
    });
  }

  // Обработчик добавления товара
  addForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const fileName = addImagePathInput.value.trim();
    if (!fileName) return alert('Введите имя файла изображения');
    
    const payload = {
      name: document.getElementById('add-name').value,
      category_id: parseInt(document.getElementById('add-category').value) || null,
      size_id: parseInt(document.getElementById('add-size').value) || null,
      price: parseFloat(document.getElementById('add-price').value),
      description: document.getElementById('add-description').value,
      image_url: 'assets/img/' + fileName
    };
    
    try {
      const res = await fetch('http://localhost:3010/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addModal.classList.remove('show');
        addForm.reset();
        addImagePreview.src = '';
        await loadProducts();
      } else {
        const error = await res.text();
        throw new Error(error);
      }
    } catch(error) {
      console.error('Ошибка добавления:', error);
      alert('Не удалось добавить товар: ' + error.message);
    }
  });

  // Превью изображения при добавлении
  addImagePathInput.addEventListener('input', () => {
    const file = addImagePathInput.value.trim();
    addImagePreview.src = file ? '/assets/img/' + file : '';
  });

  // Превью изображения при редактировании
  editImagePath.addEventListener('input', () => {
    const path = editImagePath.value.trim();
    editImagePreview.src = path ? 'assets/img/' + path : '';
  });

  // ================= Пользователи =================

  async function loadUsers() {
    usersTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/users');
      const users = await res.json();
      
      for (const u of users) {
        const statusRes = await fetch(`http://localhost:3010/api/user-status/${u.id}`);
        const {status} = await statusRes.json();
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${status}</td>
          <td>${u.role}</td>
          <td>${new Date(u.created_at).toLocaleString('ru')}</td>
          <td>
            <button class="btn-edit">Редактировать</button>
            <button class="btn-delete">Удалить</button>
          </td>
        `;
        
        row.querySelector('.btn-edit').onclick = () => {
          document.getElementById('user-edit-id').value = u.id;
          document.getElementById('user-edit-name').value = u.name;
          document.getElementById('user-edit-email').value = u.email;
          document.getElementById('user-edit-role').value = u.role;
          userEditModal.classList.add('show');
        };
        
        row.querySelector('.btn-delete').onclick = async () => {
          if (!confirm('Удалить пользователя?')) return;
          await fetch(`http://localhost:3010/api/users/${u.id}`, {method: 'DELETE'});
          loadUsers();
        };
        
        usersTableBody.appendChild(row);
      }
    } catch(e) {
      console.error('Ошибка загрузки пользователей:', e);
    }
  }

  userEditForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const id = document.getElementById('user-edit-id').value;
    const upd = {
      name: document.getElementById('user-edit-name').value,
      email: document.getElementById('user-edit-email').value,
      role: document.getElementById('user-edit-role').value
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
        const error = await res.text();
        throw new Error(error);
      }
    } catch(error) {
      console.error('Ошибка сохранения пользователя:', error);
      alert('Не удалось сохранить изменения: ' + error.message);
    }
  });

  // ================= Промокоды =================

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
          <td><button class="btn-del-promo">Удалить</button></td>
        `;
        
        tr.querySelector('.btn-del-promo').onclick = async () => {
          if (!confirm('Удалить промокод?')) return;
          await fetch(`http://localhost:3010/api/promocodes/${p.id}`, {method: 'DELETE'});
          loadPromos();
        };
        
        promoTableBody.appendChild(tr);
      });
    } catch(e) {
      console.error('Ошибка загрузки промокодов:', e);
    }
  }

  createPromoBtn.addEventListener('click', async () => {
    const code = newPromoCode.value.trim();
    const disc = parseFloat(newPromoDiscount.value);
    
    if (!code || !disc) return alert('Заполните все поля');
    
    try {
      const res = await fetch('http://localhost:3010/api/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discount: disc })
      });
      
      if (res.ok) {
        newPromoCode.value = '';
        newPromoDiscount.value = '';
        await loadPromos();
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Ошибка сервера');
      }
    } catch(error) {
      console.error('Ошибка создания промокода:', error);
      alert(error.message);
    }
  });

  // ================= Заказы =================

  async function loadOrders() {
    ordersTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/admin/orders');
      const orders = await res.json();
      
      orders.forEach(o => {
        const row = document.createElement('tr');
        const itemsHTML = JSON.parse(o.items).map(i => `${i.name}×${i.quantity}`).join('<br>');
        
        row.innerHTML = `
          <td>${o.id}</td>
          <td>${o.full_name}</td>
          <td>${o.email}</td>
          <td>${o.address}</td>
          <td>${o.city}</td>
          <td>${o.zip}</td>
          <td>${o.delivery_method}</td>
          <td>${itemsHTML}</td>
          <td>${new Date(o.created_at).toLocaleString('ru')}</td>
        `;
        
        // Статус заказа
        const statusCell = document.createElement('td');
        const select = document.createElement('select');
        
        statuses.forEach(s => {
          const option = new Option(s.label, s.value);
          if (o.status === s.value) option.selected = true;
          select.appendChild(option);
        });
        
        select.onchange = async () => {
          await fetch(`http://localhost:3010/api/admin/orders/${o.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: select.value })
          });
        };
        
        statusCell.appendChild(select);
        row.appendChild(statusCell);
        
        // Кнопка архивации
        const archiveCell = document.createElement('td');
        const archiveBtn = document.createElement('button');
        archiveBtn.textContent = 'В архив';
        archiveBtn.onclick = async () => {
          await fetch(`http://localhost:3010/api/admin/orders/${o.id}/archive`, { method: 'PUT' });
          loadOrders();
        };
        
        archiveCell.appendChild(archiveBtn);
        row.appendChild(archiveCell);
        
        // Цвет фона по статусу
        const bg = statuses.find(s => s.value === o.status)?.color;
        if (bg) row.style.backgroundColor = bg;
        
        ordersTableBody.appendChild(row);
      });
    } catch(e) {
      console.error('Ошибка загрузки заказов:', e);
    }
  }

  // ================= Архив =================

  async function loadArchive() {
    archiveTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/admin/orders/archive');
      const orders = await res.json();
      
      orders.forEach(o => {
        const row = document.createElement('tr');
        const items = JSON.parse(o.items).map(i => `${i.name}×${i.quantity}`).join(', ');
        
        row.innerHTML = `
          <td>${o.id}</td>
          <td>${o.full_name}</td>
          <td>${o.email}</td>
          <td>${o.address}</td>
          <td>${o.city}</td>
          <td>${o.zip}</td>
          <td>${o.delivery_method}</td>
          <td>${items}</td>
          <td>${new Date(o.created_at).toLocaleString('ru')}</td>
          <td>
            <button class="btn-return" onclick="restoreOrder(${o.id})">Вернуть</button>
            <button class="btn-delete" onclick="deleteOrder(${o.id})">Удалить</button>
          </td>
        `;
        
        archiveTableBody.appendChild(row);
      });
    } catch(e) {
      console.error('Ошибка загрузки архива:', e);
    }
  }

  // ================= Инициализация =================

  // Глобальные функции
  window.restoreOrder = async function(id) {
  try {
    const response = await fetch(`http://localhost:3010/api/admin/orders/${id}/restore`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Добавляем проверку типа контента
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Неверный формат ответа от сервера');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка восстановления заказа');
    }

    await loadArchive();
    await loadOrders();
    alert('Заказ успешно восстановлен!');
  } catch(e) {
    console.error('Ошибка восстановления:', e);
    alert('Ошибка: ' + e.message);
  }
};

window.deleteOrder = async function(id) {
  if (!confirm('Вы уверены, что хотите навсегда удалить этот заказ?')) return;

  try {
    const response = await fetch(`http://localhost:3010/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Добавляем проверку типа контента
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Неверный формат ответа от сервера');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка удаления заказа');
    }

    await loadArchive();
    alert('Заказ удален навсегда!');
  } catch(e) {
    console.error('Ошибка удаления:', e);
    alert('Ошибка: ' + e.message);
  }
};

  window.filterArchiveTable = function() {
    const input = document.getElementById('archive-search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#archive-table-body tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(input) ? '' : 'none';
    });
  };

  // Запуск приложения
  hideAllSections();
  productListSection.style.display = 'block';
  loadProducts();
});