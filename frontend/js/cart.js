document.addEventListener('DOMContentLoaded', () => {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  let currentTotal = 0;
  let deleteIndex = null;

  // Модальное окно
  const deleteModal = document.getElementById("deleteModal");
  const modalItemName = document.getElementById("modalItemName");
  const cancelDeleteBtn = document.getElementById("cancelDelete");
  const confirmDeleteBtn = document.getElementById("confirmDelete");

  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
    deleteIndex = null;
  });

  confirmDeleteBtn.addEventListener("click", () => {
    if (deleteIndex !== null) {
      cartItems.splice(deleteIndex, 1);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      renderCart();
      updateCartCounter();
      deleteModal.style.display = "none";
      deleteIndex = null;
    }
  });

  function renderCart() {
    container.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      totalEl.textContent = '0.00 €';
      currentTotal = 0;
      return;
    }

    cartItems.forEach((item, index) => {
      total += item.price * item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${item.price.toFixed(2)} €</p>
          <p>Size: <strong>${item.size}</strong></p>
          <label>Quantity</label>
          <div class="quantity-control">
            <button onclick="updateQuantity(${index}, ${item.quantity - 1})">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      `;

      container.appendChild(itemEl);
    });

    currentTotal = total;
    totalEl.textContent = total.toFixed(2) + ' €';
  }

  window.updateQuantity = function (index, newQty) {
    newQty = parseInt(newQty);
    if (newQty < 1) {
      removeItem(index); // вызываем модальное удаление
      return;
    }

    cartItems[index].quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCart();
    updateCartCounter();
  };

  window.removeItem = function (index) {
    deleteIndex = index;
    modalItemName.textContent = cartItems[index].name;
    deleteModal.style.display = "flex";
  };

  window.applyPromo = async function () {
    const code = document.getElementById('promo').value.trim();
    if (!code) {
      return alert('Введите промокод');
    }

    try {
      const res = await fetch(`http://localhost:3010/api/promocodes/validate/${encodeURIComponent(code)}`);
      if (!res.ok) {
        if (res.status === 404) {
          return alert('Промокод не найден');
        }
        throw new Error('Ошибка сервера');
      }
      const { discount } = await res.json();

      const discountedTotal = currentTotal * (1 - discount / 100);
      totalEl.innerHTML = `
        <span style="text-decoration: line-through;">
          ${currentTotal.toFixed(2)} €
        </span>
        &nbsp;→&nbsp;
        <span>${discountedTotal.toFixed(2)} €</span>
        <div class="promo-ok">Скидка ${discount}% применена</div>
      `;
    } catch (err) {
      console.error(err);
      alert('Не удалось применить промокод');
    }
  };

  function updateCartCounter() {
    const cartCount = document.getElementById("cartCount");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCount) {
      if (totalItems > 0) {
        cartCount.style.display = "flex";
        cartCount.textContent = totalItems;
      } else {
        cartCount.style.display = "none";
      }
    }

    localStorage.setItem("cartQty", totalItems);
  }

  renderCart();
  updateCartCounter();
});