# Простой сайт с товарами на React

> [!NOTE]
> Этот проект является простой реализацией сайта с товарами.
> В нем реализованы функции создания, редактирования и удаления товара. Также присутствует поиск товара по id
> На сайте присутствует возможность регистрации с качестве продавца или обычного пользователя. Также реализован вход

## Возможности пользователей

1. **Гость**: регистрация, просмотр товаров, поиск товара по id
2. **Пользователь**: вход, просмотр товаров, поиск товара по id
3. **Продавец**: вход, просмотр товаров, поиск товара по id, добавление нового товара, редактирование товара
4. **Администратор**: вход, просмотр товаров, поиск товара по id, добавление нового товара, удаление товара, просмотр списка пользователей, блокировка / разблокировка пользователя

## Использованные языки

> [!IMPORTANT]
> <span style="color:yellow">JavaScript</span>
> <span style="color:purple">CSS</span>
> <span style="color:green">SCSS</span>
> <span style="color:red">HTML</span>

## Установка и запуск проекта

1. **__Установите Node.js__**
2. **Клонируйте репозиторий и перейдите в папку проекта**
```
git clone https://github.com/itisjustmeeee/Control_work_2_front_back
cd <название папки проекта>
```
3. **Установите зависимости**
```
npm install
// или
yarn install
```
4. **Запустите проект** (проект автоматически откроется в браузере)
```
npm run start
// или 
yarn run start
```

## Структура проекта

- [practica_7-10/client](practica_7-10/client): папка с фронтэндом
- [practica_7-10/server](practica_7-10/server): папка с бэкэнд
- [practica_7-10/server/index.js](practica_7-10/server/index.js): файл, инициализирующий работу сервера
- [practica_7-10/server/users.json](practica_7-10/server/users.json): файл с сохраненными пользователями
- [practica_7-10/client/src](practica_7-10/client/src): папка с основными файлами фронэнда
- [practica_7-10/client/App.jsx](practica_7-10/client/App.jsx): основной файл приложения
- [practica_7-10/client/Header.jsx](practica_7-10/client/Header.jsx): файл с шапкой проекта + регистрация / вход + просмотр списка пользователей у админа
- [practica_7-10/client/LoginPage.jsx](practica_7-10/client/LoginPage.jsx): файл с модалкой логина пользователя
- [practica_7-10/client/ProductDetail.jsx](practica_7-10/client/ProductDetail.jsx): файл с карточкой продукта
- [practica_7-10/client/ProductForm.js](practica_7-10/client/ProductForm.js): файл с формой для создания нового продукта
- [practica_7-10/client/ProductList.jsx](practica_7-10/client/ProductList.jsx): файл со списком товаров
- [practica_7-10/client/Profile.jsx](practica_7-10/client/Profile.jsx): файл с профилем пользователя
- [practica_7-10/client/RegistrPage.jsx](practica_7-10/client/RegistrPage.jsx): файл с модалкой регистрации пользователя
- [practica_7-10/client/UserDetail.jsx](practica_7-10/client/UserDetail.jsx): файл с карточкой пользователя в списке
- [practica_7-10/client/UsersList.jsx](practica_7-10/client/UsersList.jsx): файл со списком пользователей

## Аспекты, на которые стоит обратить внимание

> [!WARNING]
> - Некоторые функции в проекте могут быть не достаточно оптимизированы
> - Могут возникать ошибки при запуске проекта (npm run start). Можно посмотреть в файл [файл README.md в проекте](practica_7-10/client/README.md), там могут быть указаны более подробные инструкции к запуску