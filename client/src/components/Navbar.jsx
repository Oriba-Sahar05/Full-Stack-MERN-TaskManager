import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <CheckSquare size={15} strokeWidth={2.5} />
        </span>
        Task Manager
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : '')}>
              Tasks
            </NavLink>
            <span className="user-greeting">{user?.name}</span>
            <button className="btn-link" onClick={handleLogout} title="Log out">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Log In
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
