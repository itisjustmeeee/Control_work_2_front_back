import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';

function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);
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
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      const data = await res.json();
      setProducts(products.map(p => (p.id === id ? data : p)));
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Ошибка обновления:', err);
      alert('Не удалось обновить товар');
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
  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Открытие формы для редактирования
  const startEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Закрытие формы
  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <BrowserRouter>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1>
            <Link to="/">Electronics Store</Link>
          </h1>
          <nav>
            <Link to="/">Все товары</Link>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                products={products}
                onEdit={startEdit}
                onDelete={deleteProduct}
                onAdd={createProduct}
                onUpdate={(updated) => updateProduct(editingProduct?.id, updated)}
                onCancel={closeForm}
                onCancelEdit={closeForm}
                showForm={openAddForm}
                editingProduct={editingProduct}
                onToggleForm={() => setShowForm(!openAddForm)}
              />
            }
          />

          <Route
            path="/product/:id"
            element={<ProductDetail products={products} />}
          />

          <Route path="*" element={<h2>Страница не найдена (404)</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;