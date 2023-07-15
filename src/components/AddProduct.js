import React, { Component } from "react";
import withContext from "../withContext";
import { Redirect } from "react-router-dom";
import axios from "axios";

const initState = {
  name: "",
  price: "",
  stock: "",
  shortDesc: "",
  description: "",
};

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
  }

  save = async (e) => {
    e.preventDefault();
    const { name, price, stock, shortDesc, description } = this.state;

    if (name && price) {
      const id =
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      await axios.post(
        "https://xw7qzi3dgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/addProduct",
        { id, name, price, stock, shortDesc, description }
      );

      this.props.context.addProduct(
        {
          name,
          price,
          shortDesc,
          description,
          stock: stock || 0,
        },
        () => this.setState(initState)
      );
      this.setState({
        flash: { status: "is-success", msg: "Product created successfully" },
      });
    } else {
      this.setState({
        flash: { status: "is-danger", msg: "Please enter name and price" },
      });
    }
  };

  handleChange = (e) =>
    this.setState({ [e.target.name]: e.target.value, error: "" });

  render() {
    const { name, price, stock, shortDesc, description } = this.state;
    const { user } = this.props.context;
    const url = window.location.href;
    console.log('aedsadasdasdas')
    return !(user && user.accessLevel < 1) ? (
      <Redirect to={url.includes("localhost") ? "/" : "/e-commerce-store"} />
    ) : (
      <section className="section">
        <div className="container">
          <h1 className="title has-text-centered">Add Product</h1>
          <form onSubmit={this.save}>
            <div className="columns is-centered">
              <div className="column is-one-third">
                <div className="field">
                  <label className="label">Product Name:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Price:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      name="price"
                      value={price}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Available in Stock:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      name="stock"
                      value={stock}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Short Description:</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name="shortDesc"
                      value={shortDesc}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Description:</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      rows="2"
                      style={{ resize: "none" }}
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                {this.state.flash && (
                  <div
                    className={`notification ${this.state.flash.status}`}
                  >
                    {this.state.flash.msg}
                  </div>
                )}
                <div className="field is-clearfix">
                  <button
                    className="button is-primary is-outlined is-pulled-right"
                    type="submit"
                    onClick={this.save}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withContext(AddProduct);
