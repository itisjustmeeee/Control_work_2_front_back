const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 5000;
const jwt_secret = "roof_access_denied";
const refresh_secret = "get_the_axe";

const refreshTokens = new Set();

const authMiddleware = (req, res, next) => {
  const header = req.headers['authorization'];

  const token = header && header.split(' ')[1];

  if (!token) {
    return res.status(401).json({error: "Токен отсутствует. Авторизуйтесь повторно"});
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      console.error('Ошибка верификации токена: ',err.name ,err.message);
      return res.status(403).json({error: "Токен недействителен или просрочен"});
    }

    req.user = user;
    console.log('Полученный токен:', token);
    next();
  });
};

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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT-токен в формате: Bearer <token>'
        }
      },
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

function saveUsers() {
  try {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Ошибка записи users.json: ', err);
  }
}

let users = [];

try {
  if (fs.existsSync('users.json')) {
    const fileContent = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(fileContent);
  }
} catch (err) {
  console.error('Ошибка чтения users.json: ', err);
  users = [];
}

async function hash_password(password) {
  const rounds = 12;
  return bcrypt.hash(password, rounds);
}

async function verify_password(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function generate_access_token(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    },
    jwt_secret,
    { expiresIn: '60m'}
  );
}

function generate_refresh_token(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    },
    refresh_secret,
    { expiresIn: '48h'}
  );
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/authentication/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    first_name: req.user.first_name,
    last_name: req.user.last_name
  });
});

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

// создание аккаунта пользователя
app.post('/authentication/registration', async (req, res) => {
  const {email, first_name, last_name, password} = req.body;

  if (!email || !first_name || !last_name || !password) {
    res.status(400).json({error: "Поля: почта, имя, фамилия и пароль обязательны для заполнения"});
  }

  if (users.some(u => u.email === email)) {
    res.status(409).json({error: "Пользователь с таким email уже существует"});
  }

  const hashedPassword = await hash_password(password);
  
  const new_user = {
    id: nanoid(10),
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: hashedPassword
  };

  users.push(new_user);
  saveUsers();

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
 *                format: email
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
 *              $ref: '#/components/schemas/Error'
 *      401:
 *        description: Неверные учетные данные (email или password)
 *        content:
 *          application\json:
 *            schema:
 *              $ref: '#/components/schemas/Error'

 *      500:
 *        description: Внутренняя ошибка сервера
 *        content:
 *          application\json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */

// вход в аккаунт
app.post('/authentication/login', async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    res.status(400).json({error: "Поля: email и password обязательны для заполнения"});
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    res.status(401).json({error: "Пользователь не найден. Неверный email или пароль"});
  }

  if (!user.password) {
    console.error(`Пользователь ${email} без пароля в базе`);
    return res.status(500).json({ error: "Ошибка сервера: пользователь повреждён" });
  }

  const isCorrect = await verify_password(password, user.password);
  if (!isCorrect) {
    res.status(401).json({error: "Неверный email или пароль"});
  }

  const accessToken = generate_access_token(user);
  const refreshToken = generate_refresh_token(user);

  refreshTokens.add(refreshToken);

  res.json({
    login: true,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }
  });
});

/**
 * @swagger
 * /authentication/refresh:
 *  post:
 *    summary: Создание нового refresh токена
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: 
 *              - refreshToken
 *            properties:
 *              refreshToken:
 *                type: string
 *                example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
 *    responses:
 *      200:
 *        description: Новая пара токенов
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                  example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
 *                refreshToken:
 *                  type: string
 *                  example: $2b$10$kO6Hq7ZKfV4cPzGm8u7mEuR7r4Xx2p9mP0q3t1yZbCq9Lh5a8b1QW
 *      400:
 *        description: Необходим refresh токен
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      401:
 *        description: Не валидный или просроченный refresh токен
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: Пользователь не найден
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

app.post('/authentication/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({error: "Необходим refresh токен"});
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({error: "Не валидный refresh токен"});
  }

  try {
    const payload = jwt.verify(refreshToken, refresh_secret);

    const user = users.find((u) => u.id === payload.id);
    if (!user) {
      return res.status(404).json({error: "Пользователь не найден"});
    }

    refreshTokens.delete(refreshToken);

    const newAccessToken = generate_access_token(user);
    const newRefreshToken = generate_refresh_token(user);

    refreshTokens.add(newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  }
  catch (err) {
    console.error('Ошибка верификации refresh токена: ', err.name, err.message);
    res.status(401).json({error: "Токен не валиден или просрочен"});
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
 *    security:
 *      - bearerAuth: []
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

app.get('/products/:id', authMiddleware, (req, res) => {
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
 *     security:
 *      - bearerAuth: []
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
app.put('/products/:id', authMiddleware, (req, res) => {
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
 *    security:
 *      - bearerAuth: []
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
app.delete('/products/:id', authMiddleware, (req, res) => {
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
