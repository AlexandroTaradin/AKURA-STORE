document.addEventListener('DOMContentLoaded', () => {
    const productsTab        = document.getElementById('products-tab');
    const productListSection = document.getElementById('product-list-section');
    const imageModal         = document.getElementById('image-modal');
    const imageModalClose    = imageModal.querySelector('.modal-close');
    const imageModalImg      = document.getElementById('modal-img');
    const editModal          = document.getElementById('edit-modal');
    const editModalClose     = editModal.querySelector('.modal-close');
    const editForm           = document.getElementById('edit-form');
    const editImageContainer = document.getElementById('edit-image-container');
    const editImageInput     = document.getElementById('edit-image-input');
    const editImagePreview   = document.getElementById('edit-image-preview');
  
    // Открываем секцию товаров
    productsTab.addEventListener('click', async (event) => {
      event.preventDefault();
      productListSection.style.display = 'block';
      await getProducts();
    });
  
    // Загрузка и отрисовка списка товаров
    async function getProducts() {
      try {
        const response = await fetch('http://localhost:3010/api/products');
        const data = await response.json();
        const tableBody = document.getElementById('products-table-body');
        tableBody.innerHTML = '';
  
        data.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.size}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td><button class="view-image-btn" data-image="${product.image_url}">Посмотреть</button></td>
            <td>
              <button class="btn-edit" data-id="${product.id}">Редактировать</button>
              <button class="btn-delete" data-id="${product.id}">Удалить</button>
            </td>
          `;
  
          // Показ изображения
          row.querySelector('.view-image-btn').addEventListener('click', () => {
            imageModalImg.src = product.image_url;
            imageModal.classList.add('show');
          });
  
          // Открытие формы редактирования
          row.querySelector('.btn-edit').addEventListener('click', () => {
            document.getElementById('edit-id').value          = product.id;
            document.getElementById('edit-name').value        = product.name;
            document.getElementById('edit-category').value    = product.category;
            document.getElementById('edit-size').value        = product.size;
            document.getElementById('edit-price').value       = product.price;
            document.getElementById('edit-description').value = product.description;
            editImagePreview.src = product.image_url; // Заполняем превью изображения
            editModal.classList.add('show');
          });
  
          // Удаление товара
          row.querySelector('.btn-delete').addEventListener('click', async () => {
            if (confirm('Вы уверены, что хотите удалить этот товар?')) {
              try {
                await fetch(`http://localhost:3010/api/products/${product.id}`, {
                  method: 'DELETE'
                });
                getProducts();
              } catch (error) {
                console.error('Ошибка при удалении товара:', error);
              }
            }
          });
  
          tableBody.appendChild(row);
        });
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    }
  
    // Закрытие модалки при клике на крестик
    imageModalClose.addEventListener('click', () => {
      imageModal.classList.remove('show');
    });
    editModalClose.addEventListener('click', () => {
      editModal.classList.remove('show');
    });
  
    // Закрытие по клику вне контента
    window.addEventListener('click', (event) => {
      if (event.target === imageModal) {
        imageModal.classList.remove('show');
      }
      if (event.target === editModal) {
        editModal.classList.remove('show');
      }
    });
  
    // Отправка формы редактирования
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-id').value;
      const updatedProduct = {
        name:        document.getElementById('edit-name').value,
        category:    document.getElementById('edit-category').value,
        size:        document.getElementById('edit-size').value,
        price:       document.getElementById('edit-price').value,
        description: document.getElementById('edit-description').value,
        image_url:   editImagePreview.src // Передаем новое изображение
      };
  
      try {
        const res = await fetch(`http://localhost:3010/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        });
  
        if (!res.ok) {
          console.error('Ошибка при обновлении товара:', await res.text());
          return;
        }
  
        editModal.classList.remove('show');
        await getProducts();
      } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
      }
    });
  
    // Обработчик выбора изображения для редактирования
    editImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          editImagePreview.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  });
  