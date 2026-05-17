import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-fit">Gym</span>
          <span className="brand-flow">Book</span>
        </div>
        <p className="org-label">{user?.nome} · Staff</p>
        <nav>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
            Calendario
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
            Prenotazioni
          </NavLink>
          <NavLink to="/members" className={({ isActive }) => (isActive ? 'nav active' : 'nav')}>
            Clienti
          </NavLink>
        </nav>
        <button type="button" className="logout" onClick={signOut}>
          Esci
        </button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
