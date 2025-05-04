document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3010/api/products')
    .then(response => response.json())
    .then(products => {
      const container = document.getElementById('product-container');
      container.innerHTML = '';

      products.forEach(product => {
        const productCard = document.createElement('a');
        productCard.classList.add('product-card');
        productCard.href = `product.html?id=${product.id}`;
        productCard.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}">
        <h3>${product.name}</h3>
        <span>${product.price} €</span>
      `;
      
        container.appendChild(productCard);
      });
    })
    .catch(error => {
      console.error('Ошибка загрузки товаров:', error);
    });
});
