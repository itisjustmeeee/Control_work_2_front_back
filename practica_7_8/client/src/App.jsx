import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Registration from './RegistrPage';
import Login from './LoginPage';
import ProductForm from './ProductForm';

function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [token, setToken] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLoginSuccess = (data) => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    }
    setIsLoginOpen(false);
  };

// загрузка продуктов
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err);
    }
  };

  const handleRegister = (data) => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      setToken(data.token)
    }
    setIsRegisterOpen(false);
  };
  
// создание продукта
  const createProduct = async (product) => {
    try {
      const res = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Ошибка создания');
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Ошибка создания:', err);
      alert('Не удалось добавить товар');
    }
  };
// изменение продукта
  const updateProduct = async (id, updatedProduct) => {
    console.log('Id товара для обновления: ', id);
    console.log('Данные, которые отправляем: ', updateProduct);
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
         },
        body: JSON.stringify(updatedProduct),
      });

      console.log('Статус ответа сервера: ', res.status);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Ошибка от сервера: ', errData);
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setProducts(products.map(p => (p.id === id ? data : p)));
      setIsProductFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Ошибка обновления:', err);
      alert('Не удалось обновить товар' + err.message);
    }
  };
// удаление продукта
  const deleteProduct = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить товар');
    }
  };

  // Открытие формы для добавления
  const openAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  // Открытие формы для редактирования
  const openEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  // Закрытие формы
  const closeProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    }
    else {
      createProduct(productData);
    }
    closeProductForm();
  };

  return (
    <BrowserRouter>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '37rem'}}>
          <h1 style={{ marginTop: '0.7rem'}}>Electronics Store</h1>
          <div>
            <button onClick={() => setIsRegisterOpen(true)} style={{marginRight: '1rem', padding: '0.6rem 1.2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px'}}>
              Регистрация
            </button>
            <button onClick={() => setIsLoginOpen(true)} style={{padding: '0.6rem 1.2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', marginRight: '0.5rem', cursor: 'pointer,'}}>
              Войти
            </button>
          </div>
        </header>

        <Registration
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          register={handleRegister}
        />

        <Login
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <ProductList
          products={products}
          onEdit={openEditProduct}
          onDelete={deleteProduct}
          onAdd={openAddProduct}
          token={token}
        />

        <ProductForm
          isOpen={isProductFormOpen}
          onSubmit={handleProductSubmit}
          initialData={editingProduct}
          onCancel={closeProductForm}
        />

        <Routes>
          <Route
            path="/product/:id"
            element={<ProductDetail products={products} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;