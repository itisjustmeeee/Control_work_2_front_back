import React, { useState, useEffect } from 'react';

// создание нового продукта
function ProductForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setStock(initialData.stock);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, category, description, price: parseFloat(price), stock: parseInt(stock) });
    setName('');
    setCategory('');
    setDescription('');
    setPrice(0);
    setStock(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Product' : 'Add Product'}</h2>
      <label>
        Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
      </label><br />
      <label>
        Category:
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} required />
      </label><br />
      <label>
        Description:
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </label><br />
      <label>
        Price:
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
      </label><br />
      <label>
        Stock:
        <input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
      </label><br />
      <button type="submit">{initialData ? 'Update' : 'Create'}</button>
      {initialData && <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>}
    </form>
  );
}

export default ProductForm;