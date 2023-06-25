import React from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

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

  const login = async (email, password) => {
    const res = await axios.post(
      'http://localhost:3001/login',
      { email, password },
    ).catch((res) => {
      return { status: 401, message: 'Unauthorized' };
    });

    if (res.status === 200) {
      const { email } = jwt_decode(res.data.accessToken);
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === 'admin@example.com' ? 0 : 1
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
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

  const checkout = () => {
    if (!user) {
      routerRef.current.history.push("/login");
      return;
    }

    const updatedCart = { ...cart };

    const updatedProducts = products.map(p => {
      if (updatedCart[p.name]) {
        p.stock = p.stock - updatedCart[p.name].amount;

        axios.put(
          `http://localhost:3001/products/${p.id}`,
          { ...p },
        );
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
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/add-product" component={AddProduct} />
            <Route exact path="/products" component={ProductList} />
            <Route exact path="/project-management" component={ProjectManagement} />
            <Route exact path="/about" component={About} />
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
