document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
  
    function renderCart() {
      container.innerHTML = '';
      let total = 0;
  
      if (cartItems.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalEl.textContent = '0.00 €';
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
          <p>${item.price} €</p>
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
  
      totalEl.textContent = total.toFixed(2) + ' €';
    }
  
    window.updateQuantity = function (index, newQty) {
        newQty = parseInt(newQty);
        if (newQty < 1) {
          if (confirm('Do you really want to remove an item from your cart?')) {
            cartItems.splice(index, 1);
          }
        } else {
          cartItems[index].quantity = newQty;
        }
      
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCart();
      };
      
      window.removeItem = function (index) {
        if (confirm('Do you really want to remove an item from your cart?')) {
          cartItems.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cartItems));
          renderCart();
        }
      };
      
    window.applyPromo = function () {
      alert('Promo applied — this will be connected to backend later!');
    };
  
    renderCart();
  });
  