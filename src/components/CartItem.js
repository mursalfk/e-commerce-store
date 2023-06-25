import React, { useState } from "react";

const CartItem = (props) => {
  const { cartItem, cartKey } = props;
  const { product, amount } = cartItem;
  const [showNotification, setShowNotification] = useState(false);

  const handleRemoveFromCart = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      props.removeFromCart(cartKey);
    }, 3000);
  };

  return (
    <div className="column is-half">
      <div className="box">
        <div className="media">
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-primary">${product.price}</span>
            </b>
            <div>{product.shortDesc}</div>
            <small>{`${amount} in cart`}</small>
          </div>
          <div className="media-right" onClick={handleRemoveFromCart}>
            <span className="delete is-large"></span>
          </div>
        </div>
      </div>
      {showNotification && (
        <div className="notification is-success">
          Item removed from the cart!
        </div>
      )}
    </div>
  );
};

export default CartItem;
