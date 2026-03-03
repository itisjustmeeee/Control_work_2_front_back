const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// Создание базовых 11 продуктов
let products = [
  { id: 1, name: 'iPhone 14', category: 'Smartphones', description: 'Latest Apple smartphone with A15 chip.', price: 999, stock: 50 },
  { id: 2, name: 'Samsung Galaxy S23', category: 'Smartphones', description: 'High-end Android phone with Snapdragon processor.', price: 899, stock: 30 },
  { id: 3, name: 'MacBook Pro', category: 'Laptops', description: 'Powerful laptop for professionals.', price: 1999, stock: 20 },
  { id: 4, name: 'Dell XPS 13', category: 'Laptops', description: 'Compact ultrabook with InfinityEdge display.', price: 1299, stock: 15 },
  { id: 5, name: 'Sony WH-1000XM5', category: 'Headphones', description: 'Noise-cancelling over-ear headphones.', price: 399, stock: 100 },
  { id: 6, name: 'AirPods Pro', category: 'Headphones', description: 'Wireless earbuds with active noise cancellation.', price: 249, stock: 80 },
  { id: 7, name: 'Google Pixel Watch', category: 'Smartwatches', description: 'Wear OS smartwatch with Fitbit integration.', price: 349, stock: 40 },
  { id: 8, name: 'Apple Watch Series 8', category: 'Smartwatches', description: 'Advanced health tracking smartwatch.', price: 399, stock: 60 },
  { id: 9, name: 'Kindle Paperwhite', category: 'E-readers', description: 'Waterproof e-reader with high-resolution display.', price: 129, stock: 200 },
  { id: 10, name: 'Nintendo Switch', category: 'Gaming Consoles', description: 'Hybrid gaming console for home and portable play.', price: 299, stock: 25 },
  { id: 11, name: 'PlayStation 5', category: 'Gaming Consoles', description: 'Next-gen console with ray tracing.', price: 499, stock: 10 }
];

let nextId = 12;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API управления товарами',
      version: '1.0.0',
      description: 'Дополнение простого приложения React + Express',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный порт',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'category', 'description', 'price', 'stock'],
          properties: {
            id: {
              type: 'integer',
              description: 'Автогенерируемый уникальный идентификатор товара',
              example: 100,
            },
            name: {
              type: 'string',
              description: 'Название товара',
              example: 'poco 14',
            },
            category: {
              type: 'string',
              description: 'категория товара',
              example: 'smartphones',
            },
            description: {
              type: 'string',
              description: 'подробное описание',
              example: 'latest and very expensive version of poco smartphone',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'цена товара',
              example: 999.09,
            },
            stock: {
              type: 'integer',
              description: 'количество товара на складе',
              example: 500,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'product not found',
            },
          },
        },
      },
    },
  },
  apis: [__filename],
};

let users = [];

async function hash_password(password) {
  const rounds = 12;
  return bcrypt.hash(password, rounds);
}

async function verify_password(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /authentication/registration:
 *  post:
 *    summary: Регистрация нового пользователя
 *    description: Сайт создает нового пользователя с хэшированием паролей
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - first_name
 *              - last_name
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: ivan@example.com
 *              first_name:
 *                type: string
 *                example: Alexey
 *              last_name:
 *                type: string
 *                example: Bonorev
 *              password:
 *                type: string
 *                format: password
 *                example: H1l8Kms45R
 *    responses:
 *      201:
 *        description: Пользователь успешно создан и добавлен в систему
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *              id:
 *                type: string
 *                example: "a12"
 *              email:
 *                type: string
 *                example: ivam@example.com
 *              first_name:
 *                type: string
 *                example: Alexey
 *              last_name:
 *                type: string
 *                example: Bonorev
 *              hashedPassword:
 *                type: string
 *                example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
 *      400:
 *        description: Данные введены некорректно или отсутствуют
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Error'
 *      409:
 *        description: Введенные данные уже существуют
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      500:
 *        description: Внутренняя ошибка сервера
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */

app.post('/authentication/registration', async (req, res) => {
  const {email, first_name, last_name, password} = req.body;

  if (!email || !first_name || !last_name || !password) {
    res.status(400).json({error: "Поля: почта, имя, фамилия и пароль обязательны для заполнения"});
  }

  if (users.some(u => u.email === email)) {
    res.status(409).json({error: "Пользователь с таким email уже существует"});
  }

  const hasedPassword = await hash_password(password);
  
  const new_user = {
    id: nanoid(10),
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: hasedPassword
  };

  users.push(new_user);

  const safe_user = {
    id: new_user.id,
    email: new_user.email,
    first_name: new_user.first_name,
    last_name: new_user.last_name,
  };
  res.status(201).json(safe_user);
});

/**
 * @swagger
 * /authentication/login:
 *  post:
 *    summary: Авторизация пользователя на сайте
 *    description: Проверка логина и пароля пользователя
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                fromat: email
 *                example: ivan@example.com
 *              password:
 *                type: string
 *                format: password
 *                example: Hw35Lo2XaJf1
 *    responses:
 *      200:
 *        description: Вход выполнен успешно
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                login:
 *                  type: boolean
 *                  example: true
 *      400:
 *        description: Отсутствуют обязательные поля (email или password)
 *        content:
 *          application\json:
 *            schema:
 *              $ref: '#/components/schema/Error'
 *      401:
 *        description: Неверные учетные данные (email или password)
 *        content:
 *          application\json:
 *            schema:
 *              $ref: '#/components/schema/Error'
 *      404:
 *        description: Пользователь не найден
 *        content:
 *          application\json:
 *            schema:
 *              $ref: '#/components/schema/Error'
 *      500:
 *        description: Внутренняя ошибка сервера
 *        content:
 *          application\json:
 *            schema:
 *              $ref: '#/components/schema/Error'
 */

app.post('/authentication/login', async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    res.status(400).json({error: "Поля: email и password обязательны для заполнения"});
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(401).json({error: "Пользователь не найден. Неверный email или пароль"});
  }

  const isCorrect = await verify_password(password, user.password);
  if (isCorrect) {
    res.status(200).json({login: true});
  }
  else {
    res.status(401).json({error: "Неверный email или пароль"});
  }
});

/**
 * @swagger
 * /products:
 *  get:
 *    summary: Возвращение списка всех продуктов
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: Список всех товаров
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */
// получение всех продуктов
app.get('/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /products:
 *  post:
 *    summary: Создание нового продукта
 *    tags: [Products]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *            example:
 *              name: "Новый товар"
 *              category: "Gadgets"
 *              description: "Описание нового товара"
 *              price: 199.99
 *              stock: 100
 *    responses:
 *      201:
 *        description: Товар успешно создан
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Некорректные данные
 */

// создание нового продукта
app.post('/products', (req, res) => {
  const newProduct = { id: nextId++, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *  get:
 *    summary: Нахождение продукта по id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: id товара
 *    responses:
 *      200:
 *        description: Данные товара
 *        content:
 *          application/json:
 *            schemas:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Товар с данным id не найден
 *        content:
 *          application/json:
 *            schemas:
 *              $ref: '#/components/schemas/Error'
 */

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить товар (полное обновление)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */

// поиск продукта
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).send('Product not found');
  }
});

/**
 * @swagger
 * /products/{id}:
 *  patch:
 *    summary: Частичное обновление товара
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              category:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: number
 *              stock:
 *                type: integer
 *    responses:
 *      200:
 *        description: Товар частично обновлен
 *      404:
 *        description: Товар не найден
 */

app.patch('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *  delete:
 *    summary: удалить товар
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      204:
 *        description: Товар успешно удален
 *      404:
 *        description: Товар не найден
 */

// удаление продукта
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length < initialLength) {
    res.status(204).send();
  }
  else {
    res.status(404).json({error: 'Product not found'});
  }
});

// Обработка 404 для остальных маршрутов
app.use((req, res) => {
  res.status(404).json({error: "Not found"});
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: 'Internal server error'});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI is avaliable on http://localhost:${port}/api-docs`);
});

// [Authentication]