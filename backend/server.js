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
    res.json({ token });
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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
