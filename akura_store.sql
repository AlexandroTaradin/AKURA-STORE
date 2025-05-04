-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Май 04 2025 г., 23:51
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `akura_store`
--

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `delivery_method` varchar(50) DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `full_name`, `email`, `address`, `city`, `zip`, `delivery_method`, `items`, `created_at`, `user_id`) VALUES
(5, 'Test', 'ifsshfhsh@gmail.com', 'fsjksjll', 'fsfa', '35453', 'Courier', '[{\"id\":\"3\",\"name\":\"AKURA SHORTS BLACK\",\"price\":35,\"quantity\":1,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/shortsblack.png\",\"size\":\"XL\"}]', '2025-05-04 18:47:13', 5),
(6, 'Oleksandr Taradin', 'taradin@gmail.com', 'Narva,Tempo 19/2', 'Narva', '5333', 'Courier', '[{\"id\":\"4\",\"name\":\"AKURA T-SHIRT BLACK\",\"price\":35,\"quantity\":4,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/t-shirt-black.png\",\"size\":\"XL\"},{\"id\":\"4\",\"name\":\"AKURA T-SHIRT BLACK\",\"price\":35,\"quantity\":2,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/t-shirt-black.png\",\"size\":\"L\"}]', '2025-05-04 19:15:34', 5),
(7, 'Tdaada', 'dad@gmail.com', 'kjfshfjksha', 'Narva', '425525', 'Pickup', '[{\"id\":\"4\",\"name\":\"AKURA T-SHIRT BLACK\",\"price\":35,\"quantity\":3,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/t-shirt-black.png\",\"size\":\"M\"}]', '2025-05-04 19:24:55', NULL),
(8, 'Jegor Jakovlev', 'tetst@gmail.com', 'Narva Astri', 'Narca', '2442242', 'Pickup', '[{\"id\":\"3\",\"name\":\"AKURA SHORTS BLACK\",\"price\":35,\"quantity\":1,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/shortsblack.png\",\"size\":\"L\"}]', '2025-05-04 19:37:09', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `size`, `image_url`, `description`, `color`) VALUES
(3, 'AKURA SHORTS BLACK', 35.00, 'Шорты', 'M', 'assets/img/shortsblack.png', 'Relaxed black shorts. Perfect for daily wear. Soft cotton blend.', 'Black'),
(4, 'AKURA T-SHIRT BLACK', 35.00, 'Футболка', 'L', 'assets/img/t-shirt-black.png', 'Oversized fit. 100% cotton 200gsm. Silkscreen printing. High quality rhinestones.', 'Black');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(2, 'Nato', 'auverekaamera@gmail.com', '$2b$10$x8MlPJTfcPm5waXh14f0QO4nu4mZKIDuGpijV2qQCaBFgGg5Zxq5e', '2025-04-22 06:32:53'),
(3, 'test', 'test@gmail.com', '$2b$10$S6AY2Sgt/0QuNO6tdNZ1weO4Pr70MiSz9/5aWrfUpp3m08RO7tYe2', '2025-04-22 07:09:34'),
(4, 'JEGOR JAKOVLEV', 'yegor.yakovlev.05@gmail.com', '$2b$10$hvWOQEnzk1RaDdzkd8LMFe8/jEQfLeJxtA.z1mW8KS7ByBiJQViny', '2025-04-28 18:44:26'),
(5, 'taradin', 'taradin@gmail.com', '$2b$10$5ofQYxVupi6wL/CjZI6w5egloi92qmobS5Ah7L4vMbTATq9zqpLYu', '2025-05-04 16:32:32');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
