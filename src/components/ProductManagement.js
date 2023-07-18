import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Context from "../Context";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal is-active">
    <div className="modal-background" />
    <div className="modal-content">
      <div className="box">
        <p>{message}</p>
        <div className="buttons">
          <button className="button is-primary" onClick={onConfirm}>
            Yes
          </button>
          <button className="button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ProductManagement = () => {
  const { products, setProducts } = useContext(Context);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://xw7qzi3dgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/products"
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();

    return () => {
      // Cleanup function (if necessary)
    };
  }, [setProducts]);

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(
        `https://xw7qzi3dgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/deleteProduct?id=${productId}`
      );
      window.location.reload();
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  const editProduct = (productId) => {
    setEditingProductId(productId);
    const productToEdit = products.find((product) => product.id === productId);
    setEditedProduct(productToEdit);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const saveProduct = async (productId) => {
    try {
      await axios.put(
        `https://xw7qzi3dgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/updateProduct?id=${productId}`,
        editedProduct
      );
      setEditingProductId(null);
      setEditedProduct({});
      window.location.reload();
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  const handleDeleteConfirmation = (productId) => {
    setShowDeleteConfirmation(true);
    setEditingProductId(productId);
  };

  const handleUpdateConfirmation = (productId) => {
    setShowUpdateConfirmation(true);
    setEditingProductId(productId);
  };

  const handleDeleteConfirm = (productId) => {
    deleteProduct(productId);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setEditingProductId(null);
  };

  const handleUpdateConfirm = (productId) => {
    saveProduct(productId);
    setShowUpdateConfirmation(false);
  };

  const handleUpdateCancel = () => {
    setShowUpdateConfirmation(false);
    setEditingProductId(null);
  };
  const url = window.location.href;

  return (
    <div className="container">
      <h2 className="title">Product Management Portal</h2>
      <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {editingProductId === product.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingProductId === product.id ? (
                  <textarea
                    name="description"
                    value={editedProduct.description || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.description
                )}
              </td>
              <td>
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.price
                )}
              </td>
              <td>
                {editingProductId === product.id ? (
                  <input
                    type="number"
                    name="stock"
                    value={editedProduct.stock || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td>
                {editingProductId === product.id ? (
                  <>
                    <button
                      className="button is-primary"
                      onClick={() => handleUpdateConfirmation(product._id)}
                    >
                      Save
                    </button>
                    <button className="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {/* <button
                      className="button is-info"
                      onClick={() => editProduct(product._id)}
                    >
                      Edit
                    </button> */}
                    <button
                      className="button is-danger"
                      onClick={() => handleDeleteConfirmation(product._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* If local host url then */}
      { }
      <Link to="/" className="button is-link">
        Go Back
      </Link>
      {showDeleteConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this product?"
          onConfirm={() => handleDeleteConfirm(editingProductId)}
          onCancel={handleDeleteCancel}
        />
      )}
      {showUpdateConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to save this product?"
          onConfirm={() => handleUpdateConfirm(editingProductId)}
          onCancel={handleUpdateCancel}
        />
      )}
    </div>
  );
};

export default ProductManagement;
