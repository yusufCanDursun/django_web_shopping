import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🛍️ E-Shop</div>
      <ul className="navbar-links">
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/categories">Kategoriler</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
