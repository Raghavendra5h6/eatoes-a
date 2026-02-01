import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuApi, ordersApi } from '../api/client';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    menuCount: 0,
    availableCount: 0,
    ordersToday: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [menu, orders] = await Promise.all([
          menuApi.getAll(),
          ordersApi.getAll(),
        ]);
        const today = new Date().toDateString();
        const ordersToday = orders.filter(
          (o) => new Date(o.createdAt).toDateString() === today
        ).length;
        const pending = orders.filter(
          (o) => ['pending', 'confirmed', 'preparing'].includes(o.status)
        ).length;
        setStats({
          menuCount: menu.length,
          availableCount: menu.filter((m) => m.available).length,
          ordersToday,
          pendingOrders: pending,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard…</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Overview of your restaurant</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Menu items</span>
          <span className={styles.cardValue}>{stats.menuCount}</span>
          <Link to="/menu" className={styles.cardLink}>
            Manage menu →
          </Link>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Available now</span>
          <span className={styles.cardValue}>{stats.availableCount}</span>
          <Link to="/inventory" className={styles.cardLink}>
            Toggle inventory →
          </Link>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Orders today</span>
          <span className={styles.cardValue}>{stats.ordersToday}</span>
          <Link to="/orders" className={styles.cardLink}>
            View orders →
          </Link>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Pending orders</span>
          <span className={styles.cardValue}>{stats.pendingOrders}</span>
          <Link to="/orders?status=pending" className={styles.cardLink}>
            Handle orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
