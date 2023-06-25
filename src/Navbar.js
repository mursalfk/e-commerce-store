import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, logout, cart }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <b className="navbar-item is-size-4">ecommerce</b>
        </Link>
        <button
          className={`navbar-burger burger ${showMenu ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded={showMenu}
          onClick={toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div className={`navbar-menu ${showMenu ? "is-active" : ""}`}>
        <div className="navbar-start">
          <Link to="/products" className="navbar-item">
            Products
          </Link>
          <Link to="/about" className="navbar-item">
            About
          </Link>
          {user && user.accessLevel < 1 && (
            <>
              <Link to="/add-product" className="navbar-item">
                Add Product
              </Link>
              <Link to="/project-management" className="navbar-item">
                Product Management
              </Link>
            </>
          )}
          <Link to="/orders" className="navbar-item">
            Orders
          </Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            {user ? (
              <button className="button is-danger" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="button is-primary">
                Login
              </Link>
            )}
            <Link to="/cart" className="navbar-item">
              <span className="icon is-small">
                <i className="fas fa-shopping-cart"></i>
              </span>
              <span className="tag is-primary">{Object.keys(cart).length}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
