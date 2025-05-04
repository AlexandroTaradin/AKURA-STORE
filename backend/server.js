// Импортируем нужные модули
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Создаём express-приложение
const app = express();
const PORT = 3010;

const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend')));

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Создаём подключение к базе данных
const db = mysql.createConnection({
  host: 'localhost',      // если база на сервере — укажи IP или домен
  user: 'root',           // твой пользователь
  password: '',   // твой пароль от базы
  database: 'akura_store' // имя базы данных
});
;

// Проверка соединения с базой
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL DB Успешно');
});

// Секрет для JWT
const jwtSecret = 'secureSecretKey123';

// 🔐 Регистрация нового пользователя
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) throw err;
          res.status(201).json({ message: 'Регистрация успешна' });
        });
    });
  });
  

// 🔑 Авторизация
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) return res.status(400).json({ message: 'Неверный email или пароль' });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Неверный email или пароль' });

    // Генерируем токен
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' });
    res.json({
      token,
      name: user.name,
      email: user.email,
      id: user.id
    });
    
  });
});

// 👤 Получить профиль пользователя
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [decoded.id], (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
});

// 🔁 Смена пароля
app.post('/api/change-password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { currentPassword, newPassword } = req.body;

  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, jwtSecret);

    db.query('SELECT * FROM users WHERE id = ?', [decoded.id], async (err, results) => {
      if (err || results.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });

      const user = results[0];

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Неверный текущий пароль' });

      const hashed = await bcrypt.hash(newPassword, 10);

      db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, decoded.id], (err2) => {
        if (err2) throw err2;
        res.json({ message: 'Пароль успешно обновлен' });
      });
    });
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
});

// 📦 Фильтрация товаров
app.post('/api/products/filter', (req, res) => {
  const { category, size, priceRange } = req.body;

  let query = 'SELECT * FROM products WHERE 1=1';
  const values = [];

  if (category) {
    query += ' AND category = ?';
    values.push(category);
  }

  if (size) {
    query += ' AND size = ?';
    values.push(size);
  }

  if (priceRange) {
    if (priceRange === 'low') {
      query += ' AND price < 30';
    } else if (priceRange === 'medium') {
      query += ' AND price BETWEEN 30 AND 60';
    } else if (priceRange === 'high') {
      query += ' AND price > 60';
    }
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Ошибка фильтрации:', err);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
    res.json(results);
  });
});

// Получение списка товаров
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Ошибка при получении товаров:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);  // Отправляем данные товаров как JSON
  });
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      console.error('Ошибка получения товара:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Товар не найден' });
    } else {
      res.json(results[0]);
    }
  });
});


// Удалить товар
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

// ✏️ Обновление товара
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, category, size, price, description } = req.body;

  const sql = `
    UPDATE products
       SET name = ?, category = ?, size = ?, price = ?, description = ?
     WHERE id = ?`;
  const params = [name, category, size, price, description, productId];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Ошибка обновления товара:', err);
      return res.status(500).json({ message: 'Ошибка сервера при обновлении товара' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json({ message: 'Товар успешно обновлён' });
  });
});

app.post('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  let userId = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      userId = decoded.id;
    } catch (err) {
      console.error('Invalid token');
    }
  }

  const { fullName, email, address, city, zip, delivery, cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const sql = `
    INSERT INTO orders 
      (full_name, email, address, city, zip, delivery_method, items, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    fullName,
    email,
    address,
    city,
    zip,
    delivery, // 🛠 именно delivery, не delivery_method
    JSON.stringify(cart),
    userId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ orderId: result.insertId });
  });
});




// 📦 Получить заказы по userId
app.get('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const sql = `
      SELECT id, created_at, items, address, city, zip, delivery_method 
      FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    db.query(sql, [decoded.id], (err, results) => {
      if (err) {
        console.error('Ошибка при получении заказов:', err);
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
});



app.get('/api/user-status/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.promise().query('SELECT COUNT(*) AS order_count FROM orders WHERE user_id = ?', [userId]);
    const orderCount = rows[0].order_count;

    let status = 'Bronse';
    if (orderCount >= 15) status = 'Diamond';
    else if (orderCount >= 10) status = 'Gold';
    else if (orderCount >= 5) status = 'Silver';

    res.json({ orderCount, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting status' });
  }
});





// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
