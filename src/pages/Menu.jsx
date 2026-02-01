import { useEffect, useState } from 'react';
import { menuApi } from '../api/client';
import MenuItemForm from '../components/MenuItemForm';
import Modal from '../components/Modal';
import styles from './Menu.module.css';

export default function Menu() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getAll();
      setAllItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = [
    ...new Set(allItems.map((i) => i.category).filter(Boolean)),
  ].sort();

  const items = categoryFilter
    ? allItems.filter((i) => i.category === categoryFilter)
    : allItems;

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setError('');
    try {
      if (editing) {
        await menuApi.update(editing._id, values);
      } else {
        await menuApi.create(values);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    setError('');
    try {
      await menuApi.delete(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Menu</h1>
          <p className={styles.subtitle}>Add, edit, and remove menu items</p>
        </div>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={handleCreate}
        >
          Add item
        </button>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.filters}>
        <label>
          Category
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading menu…</p>
      ) : items.length === 0 ? (
        <p className={styles.empty}>
          No menu items yet. Add one to get started.
        </p>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{item.category}</span>
                <span
                  className={
                    item.available
                      ? styles.badgeAvailable
                      : styles.badgeUnavailable
                  }
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{item.name}</h3>

              {item.description && (
                <p className={styles.cardDesc}>{item.description}</p>
              )}

              <p className={styles.cardPrice}>
                ${Number(item.price).toFixed(2)}
              </p>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit item' : 'Add item'}
      >
        <MenuItemForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
