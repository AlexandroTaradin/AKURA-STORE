// Получаем id из URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'));

// Находим нужный товар
const product = products.find(p => p.id === productId);

// Обновляем содержимое страницы
if (product) {
  // Обновляем название и цену
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = `$${product.price}`;

  // Заполняем описание
  const descList = document.getElementById('product-desc');
  descList.innerHTML = '';
  if (Array.isArray(product.description)) {
    product.description.forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      descList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = product.description;
    descList.appendChild(li);
  }

  // Генерация картинок
const imagesContainer = document.getElementById('productImages');
imagesContainer.innerHTML = ''; // Очищаем

product.images.forEach(image => {
  if (image && image.trim() !== '') { 
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${image}" alt="${product.name}">`;
    imagesContainer.appendChild(slide);
  }
});

// ИНИЦИАЛИЗИРУЕМ SWIPER ТОЛЬКО ПОСЛЕ ГЕНЕРАЦИИ!
setTimeout(() => {
new Swiper('.mySwiper', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  slidesPerView: 1,  // Одна картинка за раз
});

  
  
}, 0);


} else {
  document.querySelector('main').innerHTML = '<p>Product not found.</p>';
}

// ===============================
// Количество товара
// ===============================
let quantity = 1;
const qtySpan = document.getElementById('qty');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');

increaseBtn.addEventListener('click', () => {
  quantity++;
  qtySpan.textContent = quantity;
});

decreaseBtn.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    qtySpan.textContent = quantity;
  }
});

// ===============================
// Выбор размера
// ===============================
const sizeButtons = document.querySelectorAll('.size-btn');
sizeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
