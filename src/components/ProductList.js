import React from "react";
import ProductItem from "./ProductItem";
import withContext from "../withContext";

const ProductList = (props) => {
  const { products } = props.context;

  return (
    <section className="section">
      <div className="container">
        <h1 className="title has-text-centered">Our Products</h1>
        <div className="columns is-multiline">
          {console.log(products)}
          {products && products.length ? (
            products.map((product, index) => (
              <ProductItem
                product={product}
                key={index}
                addToCart={props.context.addToCart}
                removeFromCart={props.context.removeFromCart}
              />
            ))
          ) : (
            <div className="column">
              <h2 className="subtitle has-text-grey-light has-text-centered">
                No products found!
              </h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default withContext(ProductList);
