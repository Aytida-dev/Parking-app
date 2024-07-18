import { RiArrowRightUpLine, RiCloseLargeLine, RiMenuLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav container">
      <NavLink to="/" className="nav__logo" onClick={closeMenu}>
        Parking App
      </NavLink>

      <div className={`nav__menu ${isMenuOpen ? 'show-menu' : ''}`} id="nav-menu">
        <ul className="nav__list">
          <li className="nav__item">
            <NavLink
              to="/createTicket"
              className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <RiArrowRightUpLine />
              <span>Create Ticket</span>
            </NavLink>
          </li>

          <li className="nav__item">
            <NavLink
              to="/startTicket"
              className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <RiArrowRightUpLine />
              <span>Start Ticket</span>
            </NavLink>
          </li>

          <li className="nav__item">
            <NavLink
              to="/endTicket"
              className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <RiArrowRightUpLine />
              <span>End Ticket</span>
            </NavLink>
          </li>
        </ul>

        <div className="nav__close" id="nav-close" onClick={toggleMenu}>
          <RiCloseLargeLine />
        </div>

        <div className="nav__social">
          {/* Add your social links here */}
        </div>
      </div>

      <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
        <RiMenuLine />
      </div>
    </nav>
  );
}
