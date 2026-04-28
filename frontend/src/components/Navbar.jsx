import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, BookText, LogOut } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-brand">
                    <BookText size={28} />
                    NoteFlow
                </Link>
                <div className="nav-links">
                    <button onClick={toggleDarkMode} className="dark-toggle" aria-label="Toggle dark mode">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {user ? (
                        <>
                            <span style={{ fontWeight: 500 }}>Hello, {user.name}</span>
                            <button onClick={logout} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                                <LogOut size={20} />
                                <span style={{ marginLeft: '0.25rem' }}>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
