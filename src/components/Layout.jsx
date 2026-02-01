import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/menu', label: 'Menu' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/orders', label: 'Orders' },
];

export default function Layout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.logo}>Restaurant Admin</h1>
        <nav className={styles.nav}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
