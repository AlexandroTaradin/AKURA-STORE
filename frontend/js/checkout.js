document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
      if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }
  
      const orderData = {
        fullName: form.elements['fullName'].value,
        email: form.elements['email'].value,
        address: form.elements['address'].value,
        city: form.elements['city'].value,
        zip: form.elements['zip'].value,
        delivery: form.elements['delivery'].value,
        cart: cart,
      };
  
      try {
        const res = await fetch('http://localhost:3010/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token // ✅
          },
          body: JSON.stringify(orderData)
        });
  
        const result = await res.json();
        alert(`Order successfully placed! Your order number is #${result.orderId}`);
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
      } catch (err) {
        alert('Failed to place order.');
        console.error(err);
      }
    });
  });
  