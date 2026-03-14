import React from 'react';
import { useParams, Link } from 'react-router-dom';

// детали о каждом продукте
function ProductDetail({ products }) {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div>
        <h2>Товар не найден</h2>
        <Link to="/">← Вернуться к списку</Link>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '700px',
      margin: '2rem auto',
      background: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1>{product.name}</h1>
      <p><strong>Категория:</strong> {product.category}</p>
      <p><strong>Описание:</strong></p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#007bff' }}>
        ${product.price}
      </p>
      <p style={{ fontSize: '1.3rem' }}>
        <strong>На складе:</strong>{' '}
        <span style={{ color: product.stock > 10 ? 'green' : 'darkred' }}>
          {product.stock} шт.
        </span>
      </p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/" style={{
          padding: '0.8rem 1.6rem',
          background: '#007bff',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          ← Назад к списку товаров
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail;
