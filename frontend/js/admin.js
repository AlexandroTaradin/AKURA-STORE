// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  // === Табы и секции ===
  const productsTab        = document.getElementById('products-tab');
  const usersTab           = document.getElementById('users-tab');
  const promoTab           = document.getElementById('promo-tab');
  const orderTab           = document.getElementById('order-tab');
  const archiveTab         = document.getElementById('archive-tab');

  const productListSection = document.getElementById('product-list-section');
  const userListSection    = document.getElementById('user-list-section');
  const promoListSection   = document.getElementById('promo-list-section');
  const orderListSection   = document.getElementById('order-list-section');
  const archiveListSection = document.getElementById('archive-list-section');

  // === Тела таблиц ===
  const productsTableBody = document.getElementById('products-table-body');
  const usersTableBody    = document.getElementById('users-table-body');
  const promoTableBody    = document.getElementById('promo-table-body');
  const ordersTableBody   = document.getElementById('orders-table-body');
  const archiveTableBody  = document.getElementById('archive-table-body');

  // === Промокоды: элементы управления ===
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

  // Скрыть все секции
  function hideAllSections() {
    productListSection.style.display  = 'none';
    userListSection.style.display     = 'none';
    promoListSection.style.display    = 'none';
    orderListSection.style.display    = 'none';
    archiveListSection.style.display  = 'none';
  }

  // Навигация по табам
  productsTab.addEventListener('click', async e => { e.preventDefault(); hideAllSections(); productListSection.style.display = 'block'; await loadProducts(); });
  usersTab.addEventListener('click',    async e => { e.preventDefault(); hideAllSections(); userListSection.style.display    = 'block'; await loadUsers();    });
  promoTab.addEventListener('click',    async e => { e.preventDefault(); hideAllSections(); promoListSection.style.display   = 'block'; await loadPromos();    });
  orderTab.addEventListener('click',    async e => { e.preventDefault(); hideAllSections(); orderListSection.style.display   = 'block'; await loadOrders();   });
  archiveTab.addEventListener('click',  async e => { e.preventDefault(); hideAllSections(); archiveListSection.style.display = 'block'; await loadArchive(); });

  // Закрытие модалок
  imageModalClose.onclick = () => imageModal.classList.remove('show');
  editModalClose.onclick  = () => editModal.classList.remove('show');
  userEditClose.onclick   = () => userEditModal.classList.remove('show');
  window.addEventListener('click', e => {
    if (e.target === imageModal)    imageModal.classList.remove('show');
    if (e.target === editModal)     editModal.classList.remove('show');
    if (e.target === userEditModal) userEditModal.classList.remove('show');
  });

  // Цвета и список статусов
  const statuses = [
    {value:'Новый',                label:'❗ Новый',               color:''},
    {value:'Подтверждён',          label:'Подтверждён',          color:'lightgreen'},
    {value:'Готовится к отправке', label:'Готовится к отправке', color:'orange'},
    {value:'Передан в доставку',   label:'Передан в доставку',   color:'orange'},
    {value:'В доставке',           label:'В доставке',           color:'orange'},
    {value:'Отменён',              label:'Отменён',              color:'#faa'},
    {value:'Оформлен возврат',     label:'Оформлен возврат',     color:'#faa'}
  ];

  // ================= Функции =================

  // --- Продукты ---
  async function loadProducts() {
    productsTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/products');
      const data = await res.json();
      data.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.size}</td>
          <td>${p.price}</td>
          <td>${p.description}</td>
          <td><button class="view-image-btn">Посмотреть</button></td>
          <td>
            <button class="btn-edit">Редактировать</button>
            <button class="btn-delete">Удалить</button>
          </td>`;
        row.querySelector('.view-image-btn').onclick = () => { imageModalImg.src = p.image_url; imageModal.classList.add('show'); };
        row.querySelector('.btn-edit').onclick = () => {
          document.getElementById('edit-id').value          = p.id;
          document.getElementById('edit-name').value        = p.name;
          document.getElementById('edit-category').value    = p.category;
          document.getElementById('edit-size').value        = p.size;
          document.getElementById('edit-price').value       = p.price;
          document.getElementById('edit-description').value = p.description;
          editImagePreview.src = p.image_url;
          editModal.classList.add('show');
        };
        row.querySelector('.btn-delete').onclick = async () => { if (!confirm('Удалить этот товар?')) return; await fetch(`http://localhost:3010/api/products/${p.id}`, {method:'DELETE'}); loadProducts(); };
        productsTableBody.appendChild(row);
      });
    } catch(e) { console.error(e); }
  }
  // Сохранение редактирования продукта
  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const upd = {
      name: document.getElementById('edit-name').value,
      category: document.getElementById('edit-category').value,
      size: document.getElementById('edit-size').value,
      price: document.getElementById('edit-price').value,
      description: document.getElementById('edit-description').value,
      image_url: editImagePreview.src
    };
    const res = await fetch(`http://localhost:3010/api/products/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(upd)});
    if (res.ok) { editModal.classList.remove('show'); loadProducts(); } else console.error(await res.text());
  });
  editImageInput.addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => editImagePreview.src = ev.target.result; r.readAsDataURL(f); });

  // --- Пользователи ---
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
          <td><button class="btn-edit">Ред.</button> <button class="btn-delete">Удал.</button></td>`;
        row.querySelector('.btn-edit').onclick = () => {
          document.getElementById('user-edit-id').value    = u.id;
          document.getElementById('user-edit-name').value  = u.name;
          document.getElementById('user-edit-email').value = u.email;
          document.getElementById('user-edit-role').value  = u.role;
          userEditModal.classList.add('show');
        };
        row.querySelector('.btn-delete').onclick = async () => { if (!confirm('Удалить пользователя?')) return; await fetch(`http://localhost:3010/api/users/${u.id}`,{method:'DELETE'}); loadUsers(); };
        usersTableBody.appendChild(row);
      }
    } catch(e){ console.error(e); }
  }
  userEditForm.addEventListener('submit', async e => { e.preventDefault(); const id = document.getElementById('user-edit-id').value; const upd = {name: document.getElementById('user-edit-name').value,email: document.getElementById('user-edit-email').value,role: document.getElementById('user-edit-role').value}; const res = await fetch(`http://localhost:3010/api/users/${id}`,{method:'PUT',headers:{'Content-Type':'application/json' },body:JSON.stringify(upd)}); if (res.ok) { userEditModal.classList.remove('show'); loadUsers(); } else console.error(await res.text()); });

  // --- Промокоды ---
  async function loadPromos() {
    promoTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/promocodes');
      const promos = await res.json();
      promos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.id}</td><td>${p.code}</td><td>${p.discount}</td><td>${new Date(p.created_at).toLocaleString('ru')}</td><td><button class="btn-del-promo">Удалить</button></td>`;
        tr.querySelector('.btn-del-promo').onclick = async () => { if(!confirm('Удалить?')) return; await fetch(`http://localhost:3010/api/promocodes/${p.id}`,{method:'DELETE'}); loadPromos(); };
        promoTableBody.appendChild(tr);
      });
    } catch(e){ console.error(e); }
  }
  createPromoBtn.addEventListener('click', async()=>{ const code=newPromoCode.value.trim(),disc=parseFloat(newPromoDiscount.value); if(!code||!disc) return alert('Введите'); const res=await fetch('http://localhost:3010/api/promocodes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,discount:disc})}); if(!res.ok){alert((await res.json()).message||'Ошибка');return;} newPromoCode.value='';newPromoDiscount.value=''; loadPromos(); });

  // --- Заказы (админ) ---
  async function loadOrders() {
    ordersTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/admin/orders');
      const orders = await res.json();
      orders.forEach(o => {
        const row = document.createElement('tr');
        const itemsHTML = JSON.parse(o.items).map(i=>`${i.name}×${i.quantity}`).join('<br>');
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
        // статус
        const select = document.createElement('select');
        statuses.forEach(s=>{const opt=document.createElement('option');opt.value=s.value;opt.textContent=s.label;if(o.status===s.value)opt.selected=true;select.appendChild(opt)});
        select.onchange = async ()=>{await fetch(`http://localhost:3010/api/admin/orders/${o.id}/status`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:select.value})});};
        row.appendChild(document.createElement('td')).appendChild(select);
        // архив
        const btn=document.createElement('button');btn.textContent='Добавить в архив';btn.onclick=async()=>{await fetch(`http://localhost:3010/api/admin/orders/${o.id}/archive`,{method:'PUT'});loadOrders();};
        row.appendChild(document.createElement('td')).appendChild(btn);
        // фон
        const bg=statuses.find(s=>s.value===o.status).color;if(bg)row.style.backgroundColor=bg;
        ordersTableBody.appendChild(row);
      });
    } catch(e){console.error(e);}
  }

  // --- Архив ---
  async function loadArchive() {
    archiveTableBody.innerHTML = '';
    try {
      const res = await fetch('http://localhost:3010/api/admin/orders/archive');
      const orders = await res.json();
      orders.forEach(o => {
        const row = document.createElement('tr');
        const items=JSON.parse(o.items).map(i=>`${i.name}×${i.quantity}`).join(', ');
        row.innerHTML = `<td>${o.id}</td><td>${o.full_name}</td><td>${o.email}</td><td>${o.address}</td><td>${o.city}</td><td>${o.zip}</td><td>${o.delivery_method}</td><td>${items}</td><td>${new Date(o.created_at).toLocaleString('ru')}</td>`;
        archiveTableBody.appendChild(row);
      });
    } catch(e){console.error(e);}  
  }

  // === Инициализация ===
  hideAllSections();
  productListSection.style.display = 'block';
  loadProducts();
});
