import { useEffect, useState } from 'react';
import { menuApi } from '../api/client';
import styles from './Inventory.module.css';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState(''); // '', 'available', 'unavailable'

  const load = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getAll();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = [...new Set(items.map((i) => i.category))].sort();
  const filtered = items.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (availabilityFilter === 'available' && !item.available) return false;
    if (availabilityFilter === 'unavailable' && item.available) return false;
    return true;
  });

  const handleToggle = async (item) => {
    setToggling(item._id);
    try {
      const updated = await menuApi.toggleAvailability(item._id);
      setItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setToggling(null);
    }
  };

  const availableCount = items.filter((i) => i.available).length;
  const unavailableCount = items.length - availableCount;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>
            Toggle availability for menu items. Unavailable items won’t appear for customers.
          </p>
        </div>
      </header>

      <div className={styles.stats}>
        <span className={styles.stat}>
          <strong>{availableCount}</strong> available
        </span>
        <span className={styles.stat}>
          <strong>{unavailableCount}</strong> unavailable
        </span>
      </div>

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
        <label>
          Availability
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading inventory…</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>No items match the filters.</p>
      ) : (
        <ul className={styles.list}>
          {filtered.map((item) => (
            <li key={item._id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.category}>{item.category}</span>
                <span className={styles.price}>${Number(item.price).toFixed(2)}</span>
              </div>
              <div className={styles.actions}>
                <span
                  className={
                    item.available
                      ? `${styles.badge} ${styles.badgeAvailable}`
                      : `${styles.badge} ${styles.badgeUnavailable}`
                  }
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => handleToggle(item)}
                  disabled={toggling === item._id}
                  title={item.available ? 'Mark unavailable' : 'Mark available'}
                >
                  {toggling === item._id ? '…' : item.available ? 'Mark unavailable' : 'Mark available'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
