import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ordersApi } from '../api/client';
import styles from './Orders.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status') || '';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(statusFromUrl);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getAll(statusFilter || undefined);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStatusFilter(statusFromUrl);
  }, [statusFromUrl]);

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>View and update incoming customer orders</p>
        </div>
      </header>

      <div className={styles.filters}>
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(e) => {
              const v = e.target.value;
              setStatusFilter(v);
              setSearchParams(v ? { status: v } : {});
            }}
            className={styles.select}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className={styles.empty}>No orders match the filter.</p>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <article key={order._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.customer}>{order.customerName}</h3>
                  {order.customerPhone && (
                    <p className={styles.phone}>{order.customerPhone}</p>
                  )}
                  <p className={styles.date}>{formatDate(order.createdAt)}</p>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.total}>
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <span
                    className={`${styles.status} ${styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <ul className={styles.items}>
                {order.items?.map((line, idx) => (
                  <li key={idx} className={styles.item}>
                    <span className={styles.itemName}>
                      {line.name} × {line.quantity}
                    </span>
                    <span className={styles.itemPrice}>
                      ${(Number(line.price) * line.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <p className={styles.notes}>Note: {order.notes}</p>
              )}
              <div className={styles.actions}>
                <label>
                  Update status
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={updating === order._id}
                    className={styles.statusSelect}
                  >
                    {STATUS_OPTIONS.filter((o) => o.value).map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                {updating === order._id && (
                  <span className={styles.updating}>Updating…</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
