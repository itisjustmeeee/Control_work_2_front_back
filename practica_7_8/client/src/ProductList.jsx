import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/ProductCard.module.scss';

function ProductList({
  products,
  onEdit,
  onDelete,
  onAdd,
  token
}) {
  const [searchId, setSearchId] = useState('');

  const filteredProducts = searchId.trim()
    ? products.filter(p => String(p.id) === searchId.trim())
    : products;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSearchId(value);
    }
  };

  const clearSearch = () => {
    setSearchId('');
  };

  return (
    <div>
      {/* Поиск */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-start', gap: '1rem', alignItems: 'center' }}>
        <div>
          <label htmlFor="search-id" style={{ marginRight: '0.8rem', fontWeight: 500 }}>
            Поиск по ID:
          </label>
          <input
            id="search-id"
            type="text"
            value={searchId}
            onChange={handleSearchChange}
            placeholder="введите номер товара"
            style={{
              padding: '0.6rem 1rem',
              width: '180px',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
        </div>

        {searchId && (
          <button
            onClick={clearSearch}
            style={{
              padding: '0.6rem 1.2rem',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Очистить
          </button>
        )}

        <div style={{ marginLeft: 'auto', color: '#666', fontSize: '0.95rem' }}>
          Показано товаров: {filteredProducts.length}
        </div>
      </div>

      {/* Кнопка добавления*/}
      <button
        className={`${styles.onAdd} onAdd`}
        onClick={() => {
          if (!token) {
            alert('Войдите в аккаунт, чтобы добавить товар');
            return;
          }
          onAdd();
        }}
        disabled={!token}
        style={{
          padding: '0.7rem 1.4rem',
          marginBottom: '2rem',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          opacity: token ? 1 : 0.6
        }}
      >
        + Добавить товар
      </button>

      {/* Список товаров */}
      {filteredProducts.length === 0 && searchId ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Товар с ID <strong>{searchId}</strong> не найден
          <br />
          <button
            onClick={clearSearch}
            style={{
              marginTop: '1rem',
              padding: '0.7rem 1.4rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Показать все товары
          </button>
        </div>
      ) : (
        <div>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.card}>
              <h3>
                <Link
                  to={`/product/${product.id}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {product.name}
                </Link>
                <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.8rem' }}>
                  ID: {product.id}
                </span>
              </h3>

              <p><strong>Категория:</strong> {product.category}</p>
              <p><strong>Описание:</strong> {product.description}</p>
              <p className={styles.price}>${product.price}</p>
              <p className={styles.stock}>
                На складе: <span style={{ color: product.stock > 10 ? 'green' : 'darkred' }}>
                  {product.stock} шт.
                </span>
              </p>

              <div style={{ marginTop: '1rem' }}>
                <button
                  className={`${styles.edit} edit`}
                  onClick={() => {
                    if (!token) {
                      alert('Войдите в аккаунт, чтобы редактировать товар');
                      return;
                    }
                    onEdit(product);
                  }}
                  disabled={!token}
                  style={{ opacity: token ? 1 : 0.6 }}
                >
                  Редактировать
                </button>
                <button
                  className={`${styles.delete} delete`}
                  onClick={() => {
                    if (!token) {
                      alert('Войдите в аккаунт, чтобы удалить товар');
                      return;
                    }
                    onDelete(product.id);
                  }}
                  disabled={!token}
                  style={{ marginLeft: '0.8rem', opacity: token ? 1 : 0.6 }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;