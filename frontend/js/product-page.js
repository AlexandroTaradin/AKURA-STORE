document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    alert('Product ID is missing!');
    return;
  }
  fetch(`http://localhost:3010/api/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      // Название и цена
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-price').textContent = `${product.price} €`;

      // Описание
      const desc = document.getElementById('product-desc');
      desc.innerHTML = `<li>${product.description}</li>`;

      // Картинка
      const imageContainer = document.getElementById('productImages');
      imageContainer.innerHTML = `
      <div class="swiper-slide"><img src="${product.image_url}" alt="${product.name}" /></div>
      <div class="swiper-slide"><img src="${product.image_url}" alt="${product.name} (2)" /></div>
    `;
    

      // Инициализация слайдера
      new Swiper('.mySwiper', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });

    })
    .catch(err => {
      console.error('Ошибка загрузки товара:', err);
    });
});


// Обработка размера
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Обработка количества
let qty = 1;
const qtyDisplay = document.getElementById('qty');
document.getElementById('increase').addEventListener('click', () => {
  qty++;
  qtyDisplay.textContent = qty;
});
document.getElementById('decrease').addEventListener('click', () => {
  if (qty > 1) qty--;
  qtyDisplay.textContent = qty;
});

document.querySelector('.add-to-cart').addEventListener('click', () => {
  const productId = new URLSearchParams(window.location.search).get('id');
  const name = document.getElementById('product-name').textContent;
  const price = parseFloat(document.getElementById('product-price').textContent);
  const quantity = parseInt(document.getElementById('qty').textContent);
  const image_url = document.querySelector('.swiper-slide img')?.src || '';
  const size = document.querySelector('.size-btn.active')?.textContent || 'Unknown';

  const item = { id: productId, name, price, quantity, image_url, size };

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(p => p.id === productId && p.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  // alert('Added to cart!');
});

document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.querySelector(".add-to-cart");
  const cartCount = document.getElementById("cartCount");

  // Храним количество в localStorage (или просто в переменной)
  let cartQty = parseInt(localStorage.getItem("cartQty") || "0");

  updateCartUI();

  addToCartBtn.addEventListener("click", function () {
    cartQty++;
    localStorage.setItem("cartQty", cartQty);
    updateCartUI();
  });

  function updateCartUI() {
    if (cartQty > 0) {
      cartCount.style.display = "flex";
      cartCount.textContent = cartQty;
    } else {
      cartCount.style.display = "none";
    }
  }
});
