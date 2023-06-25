import React from "react";

const ProductItem = (props) => {
  const { product } = props;

  return (
    <div className="column is-one-third">
      <div className="card">
        <div className="card-content">
          <p className="title is-5 has-text-centered">{product.name}</p>
          <p className="subtitle is-6 has-text-centered">${product.price}</p>
          <p>{product.shortDesc}</p>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            {product.stock > 0 ? (
              <span className="tag is-success">In Stock</span>
            ) : (
              <span className="tag is-danger">Out Of Stock</span>
            )}
          </div>
          <div className="card-footer-item">
            <button
              className="button is-primary is-small"
              onClick={() =>
                props.addToCart({
                  id: product.name,
                  product,
                  amount: 1,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductItem;
