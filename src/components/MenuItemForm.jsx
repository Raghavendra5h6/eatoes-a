import { useState, useEffect } from 'react';

export default function MenuItemForm({ initial, onSubmit, onCancel }) {
  // 🔹 Access passed data safely
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name);       // 👈 access data
      setPrice(initial.price);
      setCategory(initial.category);
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, price, category });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initial ? 'Edit Item' : 'Add Item'}</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
