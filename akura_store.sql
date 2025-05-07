-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Май 07 2025 г., 12:39
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
(8, 'Jegor Jakovlev', 'tetst@gmail.com', 'Narva Astri', 'Narca', '2442242', 'Pickup', '[{\"id\":\"3\",\"name\":\"AKURA SHORTS BLACK\",\"price\":35,\"quantity\":1,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/shortsblack.png\",\"size\":\"L\"}]', '2025-05-04 19:37:09', 5),
(0, 'Artem', 'admin@it.com', 'krenholmi 34', 'narva', '40122', 'Courier', '[{\"id\":\"1\",\"name\":\"AKURA HOODIE BLACK\",\"price\":75,\"quantity\":1,\"image_url\":\"http://127.0.0.1:5500/frontend/assets/img/hoodie%20black.png\",\"size\":\"L\"}]', '2025-05-06 19:00:23', 6);

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
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `size`, `image_url`, `description`) VALUES
(1, 'AKURA HOODIE BLACK', 75.00, 'Худи', 'XX', 'assets/img/hoodie black.png', 'Premium black hoodie with AKURA branding. Perfect for urban looks.'),
(2, 'AKURA PANTS BLACK', 45.00, 'Штаны', 'L', 'assets/img/pantsblack.png', 'Relaxed fit black pants. Clean silhouette. Urban-inspired design.'),
(3, 'AKURA SHORTS BLACK', 35.00, 'Шорты', 'M', 'assets/img/shortsblack.png', 'Relaxed black shorts. Perfect for daily wear. Soft cotton blend.');

-- --------------------------------------------------------

--
-- Структура таблицы `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount` decimal(5,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('User','Admin','Manager') NOT NULL DEFAULT 'User'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `role`) VALUES
(6, 'Artem', 'artem@it.com', '$2b$10$S/T/bHvZWfxZPXuMl9WU/Oq8cswmHWkwTlchSmluwZVH1oYJProwG', '2025-05-06 08:37:13', 'Admin');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `promo_codes`
--
ALTER TABLE `promo_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

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
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `promo_codes`
--
ALTER TABLE `promo_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
