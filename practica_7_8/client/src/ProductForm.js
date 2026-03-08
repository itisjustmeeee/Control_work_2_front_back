import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';


// создание нового продукта
function ProductForm({ isOpen, onSubmit, initialData, onCancel }) {
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
    else {
      setName('');
      setCategory('');
      setDescription('');
      setPrice(0);
      setStock(0);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, category, description, price: parseFloat(price), stock: parseInt(stock, 10),});
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      style={{overlay: {backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1000,}, content: {top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '500px', padding: '2rem', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',},}}>
      <h2 style={{margin: '0 0 1.5rem 0', textAlign: 'center'}}>
        {initialData ? 'Изменить продукт' : 'Добавить продукт'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.4rem'}}>
            Название:
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
        </div>
        <div style={{marginBotton: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.4rem'}}>
            Категория:
          </label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.4rem'}}>
            Описание:
          </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.4rem'}}>
            Цена:
          </label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
        </div>
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', marginBottom: '0.4rem'}}>
            Количество на складе:
          </label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc'}}/>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
          <button type="button" onClick={onCancel} style={{flex: 1, padding: '0.8rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',}}>
            Отмена
          </button>
          <button type='submit' style={{flex: 1, padding: '0.8rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',}}>
            {initialData ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductForm;