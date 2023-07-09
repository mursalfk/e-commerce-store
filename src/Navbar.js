import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, logout, cart }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const url = window.location.href;

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to={url.includes("localhost") ? "/" : "/e-commerce-store"} className="navbar-item">
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
          <Link to={url.includes("localhost") ? "/products" : "/e-commerce-store/products"} className="navbar-item">
            Products
          </Link>
          <Link to={url.includes("localhost") ? "/about" : "/e-commerce-store/about"} className="navbar-item">
            About
          </Link>
          {user && user.accessLevel < 1 && (
            <>
              <Link to={url.includes("localhost") ? "/add-products" : "/e-commerce-store/add-products"} className="navbar-item">
                Add Product
              </Link>
              <Link to={url.includes("localhost") ? "/project-management" : "/e-commerce-store/project-management"} className="navbar-item">
                Product Management
              </Link>
            </>
          )}
          <Link to={url.includes("localhost") ? "/orders" : "/e-commerce-store/orders"} className="navbar-item">
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
              <Link to={url.includes("localhost") ? "/login" : "/e-commerce-store/login"} className="button is-primary">
                Login
              </Link>
            )}
            <Link to={url.includes("localhost") ? "/cart" : "/e-commerce-store/cart"} className="navbar-item">
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
