import React, { useState } from "react";
import withContext from "../withContext";
import CartItem from "./CartItem";

const Cart = (props) => {
  const { cart } = props.context;
  const cartKeys = Object.keys(cart || {});
  const [showNotification, setShowNotification] = useState(false);

  const handleClearCart = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      props.context.clearCart();
    }, 3000);
  };

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">My Cart</h4>
        </div>
      </div>
      <br />
      <div className="container">
        {cartKeys.length ? (
          <div className="column columns is-multiline">
            {cartKeys.map((key) => (
              <CartItem
                cartKey={key}
                key={key}
                cartItem={cart[key]}
                removeFromCart={props.context.removeFromCart}
              />
            ))}
            <div className="column is-12 is-clearfix">
              <br />
              <div className="is-pulled-right">
                <button
                  onClick={handleClearCart}
                  className="button is-warning"
                >
                  Clear cart
                </button>{" "}
                <button
                  className="button is-success"
                  onClick={props.context.checkout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="column">
            <div className="title has-text-grey-light">No item in cart!</div>
          </div>
        )}
      </div>
      {showNotification && (
        <div className="notification is-success cart-notification">
          Cart cleared successfully!
        </div>
      )}
    </>
  );
};

export default withContext(Cart);
