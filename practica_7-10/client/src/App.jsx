import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import ProductForm from './ProductForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import Profile from './Profile';
import Header from './Header';
import api from './api';

function ProtectedRoute({children}) {
  const {user, loading} = useAuth();

  if (loading) return <div style={{textAlign: 'center', padding: '4rem'}}>Загрузка...</div>

  return user ? children : <Navigate to="/" replace/>;
}

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

// загрузка продуктов
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err);
    }
  };
  
// создание продукта
  const createProduct = async (product) => {
    try {
      const response = await api.post('/products', product);
      setProducts([...products, response.data]);
    } catch (err) {
      console.error('Ошибка создания:', err);
      alert('Не удалось добавить товар' + (err.response?.data?.error || err.message));
    }
  };
// изменение продукта
  const updateProduct = async (id, updatedProduct) => {
    console.log('Id товара для обновления: ', id);
    console.log('Данные, которые отправляем: ', updateProduct);
    try {
      const response = await api.put(`/products/${id}`, updatedProduct);
      setProducts(products.map(p => (p.id === id ? response.data : p)));
    } catch (err) {
      console.error('Ошибка обновления:', err);
      alert('Не удалось обновить товар' + (err.response?.data?.error || err.message));
    }
  };
// удаление продукта
  const deleteProduct = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      await api.delete(`/products/${id}`);
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
    <AuthProvider>
      <BrowserRouter>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Header />

          <Routes>
            <Route
              path='/'
              element = {
                <ProductList
                  products={products}
                  onEdit={openEditProduct}
                  onDelete={deleteProduct}
                  onAdd={openAddProduct}
                />
              }
            />

            <Route
              path="/product/:id"
              element={<ProductDetail products={products} />}
            />

            <Route
              path='/profile'
              element = {
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              }
            />

            <Route
              path='*'
              element={
                <Navigate to="/" replace/>
              }
            />
          </Routes>

          <ProductForm
            isOpen={isProductFormOpen}
            onSubmit={handleProductSubmit}
            initialData={editingProduct}
            onCancel={closeProductForm}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
