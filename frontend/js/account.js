document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const usernameEl = document.getElementById('username');
    const emailEl = document.getElementById('useremail');
    const orderList = document.getElementById('order-list');
    const logoutBtn = document.getElementById('logoutBtn');
  
    // ⛔ Если не авторизован — редирект
    if (!user || !token) {
      window.location.href = 'login.html';
      return;
    }
  
    // 👤 Отображаем имя и email
    usernameEl.textContent = user.name || 'User';
    emailEl.textContent = user.email || 'unknown';

  // 📌 Получаем статус
  fetch(`http://localhost:3010/api/user-status/${user.id}`)
  .then(res => res.json())
  .then(data => {
    const { status, orderCount } = data;
    const nextLevels = { Bronse: 5, Silver: 10, Gold: 15, Diamond: null };

    const statusEl = document.getElementById('user-status');
    statusEl.textContent = `(${status})`;

    let tooltip = '';

    if (status === 'Diamond') {
      tooltip = 'Thank you for being our most loyal customer!';
    } else {
      const toNext = nextLevels[status] - orderCount;
      const nextStatus = Object.keys(nextLevels)[Object.keys(nextLevels).indexOf(status) + 1];
      tooltip = `Thank you for your purchases!\nOnly ${toNext} more to reach ${nextStatus} status.`;
    }

    tooltipText = tooltip;

  });

  const statusElement = document.getElementById('user-status');
  const tooltip = document.getElementById('status-tooltip');
  
  statusElement.addEventListener('mouseenter', () => {
    tooltip.textContent = tooltipText;
    tooltip.style.display = 'block';
  });
  
  statusElement.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
  
  

// 📦 Загружаем заказы
fetch('http://localhost:3010/api/orders', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(orders => {
      orderList.innerHTML = ''; // Очищаем
  
      if (!orders.length) {
        orderList.innerHTML = '<li>No orders yet.</li>';
        return;
      }
  
      orders.forEach(order => {
        const li = document.createElement('li');
        const trackNumber = 'TRK' + String(order.id).padStart(6, '0');
        const createdAt = new Date(order.created_at).toLocaleDateString();
        const items = JSON.parse(order.items || '[]');
      
        let itemHtml = '';
        items.forEach(item => {
          itemHtml += `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="${item.image_url || 'assets/img/placeholder.png'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px;">
              <div>
                <strong>${item.name}</strong><br>
                Size: ${item.size || '—'} | Qty: ${item.quantity || 1} | ${item.price} € each
              </div>
            </div>
          `;
        });
      

        li.innerHTML = `
          <strong>Order #${order.id}</strong> — ${createdAt}<br>
          <strong>Delivery:</strong> ${order.delivery_method || '—'}<br>
          <strong>Address:</strong> ${order.address || '—'}, ${order.city || '—'}, ${order.zip || '—'}<br>
          <strong>Tracking Number:</strong> ${trackNumber}<br><br>
          ${itemHtml}
          <hr>
        `;

        orderList.appendChild(li);
      });
    })
    .catch(err => {
      orderList.innerHTML = '<li>Error loading orders.</li>';
      console.error('Order fetch error:', err);
    });
      
    })
    .catch(err => {
      orderList.innerHTML = '<li>Error loading orders.</li>';
      console.error('Order fetch error:', err);
    });
  
  
    // 🚪 Выход с подтверждением
    logoutBtn.addEventListener('click', () => {
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      }
    });

  
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
      alert(data.message || 'Could not change password');
    } catch (error) {
      console.error('Password change error:', error);
      alert('Server error');
    }
  }

