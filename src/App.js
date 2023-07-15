import React from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
// Import db.json file
import db from './users_db.json';

import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import './App.css';
import ProjectManagement from './components/ProductManagement';
import About from './components/About';

import Context from "./Context";
import Navbar from "./Navbar";
import Orders from "./components/Orders";

const App = () => {
  const [user, setUser] = React.useState(null);
  const [cart, setCart] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [popupVisible, setPopupVisible] = React.useState(false);

  const routerRef = React.useRef();

  React.useEffect(() => {
    const fetchData = async () => {
      let user = localStorage.getItem("user");
      let cart = localStorage.getItem("cart");

      const productsResponse = await axios.get('https://xw7qzi3dgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/getAllProducts?page=1&limit=10');
      user = user ? JSON.parse(user) : null;
      cart = cart ? JSON.parse(cart) : {};

      setUser(user);
      setProducts(productsResponse.data.products);
      setCart(cart);
    };

    fetchData();
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Perform login logic here
      // If login is successful, resolve(true), otherwise resolve(false)
      // Example implementation:
      const user = db.users.find((user) => user.email === email && user.password === password);
      if (user) {
        const { email } = user;
        const token = ""; // Generate token if needed
        const accessLevel = email === 'admin@example.com' ? 0 : 1;
        const authenticatedUser = {
          email,
          token,
          accessLevel
        };

        setUser(authenticatedUser);
        localStorage.setItem("user", JSON.stringify(authenticatedUser));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };


  const addToCart = (cartItem) => {
    let updatedCart = { ...cart };
    if (updatedCart[cartItem.id]) {
      updatedCart[cartItem.id].amount += cartItem.amount;
    } else {
      updatedCart[cartItem.id] = cartItem;
    }
    if (updatedCart[cartItem.id].amount > cartItem.product.stock) {
      updatedCart[cartItem.id].amount = cartItem.product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    // Show popup notification
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 2000);
  };

  const removeFromCart = (cartItemId) => {
    let updatedCart = { ...cart };
    delete updatedCart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const clearCart = () => {
    let updatedCart = {};
    localStorage.removeItem("cart");
    setCart(updatedCart);
  };

  const checkout = async () => {
    const url = window.location.href;
    if (!user) {
      if (url.includes('localhost')) {
        routerRef.current.history.push("/login");
      }
      else {
        routerRef.current.history.push("/e-commerce-store/login");
      }
      return;
    }

    const checkoutCart = {}
    const updatedCart = { ...cart };
    checkoutCart.items = Object.values(updatedCart);
    checkoutCart.timestamp = Date.now();
    checkoutCart.user = user.email;
    checkoutCart.status = "Ordered";

    await axios.post(
      "https://zm06kfxmx0.execute-api.ap-south-1.amazonaws.com/dev/api/v1/addOrder",
      { checkoutCart }
    );

    const updatedProducts = products.map(p => {
      if (updatedCart[p.name]) {
        p.stock = p.stock - updatedCart[p.name].amount;
      }
      return p;
    });

    setProducts(updatedProducts);
    clearCart();
  };

  const logout = (e) => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
  };

  const addProduct = (product, callback) => {
    let updatedProducts = [...products];
    updatedProducts.push(product);
    setProducts(updatedProducts);
    if (callback) {
      callback();
    }
  };
  const url = window.location.href;

  return (
    <Context.Provider
      value={{
        user,
        cart,
        products,
        removeFromCart,
        addToCart,
        login,
        addProduct,
        clearCart,
        checkout
      }}
    >
      <Router ref={routerRef}>
        <Navbar user={user} logout={logout} cart={cart} />
        <div className="App">
          <Switch>
            {/* If url is of local host, then*/}
            {url.includes('localhost') ? (
              <>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/cart" component={Cart} />
                <Route exact path="/add-products" component={AddProduct} />
                <Route exact path="/products" component={ProductList} />
                <Route exact path="/project-management" component={ProjectManagement} />
                <Route exact path="/orders" component={Orders} />
                <Route exact path="/about" component={About} />
              </>
            ) : (
              <>
                <Route exact path="/e-commerce-store" component={HomePage} />
                <Route exact path="/e-commerce-store/login" component={Login} />
                <Route exact path="/e-commerce-store/cart" component={Cart} />
                <Route exact path="/e-commerce-store/add-products" component={AddProduct} />
                <Route exact path="/e-commerce-store/products" component={ProductList} />
                <Route exact path="/e-commerce-store/project-management" component={ProjectManagement} />
                <Route exact path="/e-commerce-store/orders" component={Orders} />
                <Route exact path="/e-commerce-store/about" component={About} />
              </>
            )}
          </Switch>
        </div>
      </Router>
      {popupVisible && (
        <div className="popup">
          Item added to cart!
        </div>
      )}
    </Context.Provider>
  );
};

export default App;
