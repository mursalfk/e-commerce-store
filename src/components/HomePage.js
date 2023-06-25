import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Context from "../Context";
import image1 from "../Images/image1.jpg";

const Homepage = () => {
  const { user, isAdmin } = useContext(Context);

  // Generate random introduction paragraph
  const generateIntroduction = () => {
    const introduction =
      "Welcome to our online store. We offer a wide range of products to meet your needs and preferences. From trendy fashion items to essential home goods, we have it all. Our mission is to provide you with a seamless shopping experience and deliver high-quality products right to your doorstep. Whether you're looking for the latest fashion trends, home decor inspiration, or tech gadgets, we've got you covered. Start exploring our collection today and find the perfect items to enhance your lifestyle.";

    return introduction;
  };

  const introduction = generateIntroduction();

  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered">
            <div className="column">
              <h1 className="title is-size-1">Welcome to Ecommerce Store</h1>
              <p className="subtitle">{introduction}</p>
              <div className="buttons is-centered is-flex-direction-column-mobile">
                {user ? (
                  <>
                    {isAdmin ? (
                      <>
                        <Link to="/product-management" className="button is-primary is-rounded">
                          Product Management
                        </Link>
                        <Link to="/logout" className="button is-danger is-rounded">
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/products" className="button is-primary is-rounded">
                          Products
                        </Link>
                        <Link to="/cart" className="button is-info is-rounded">
                          Cart
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="button is-primary is-rounded">
                    Login
                  </Link>
                )}
              </div>
            </div>
            <div className="column">
              <div className="image-container">
                <img src={image1} alt="Image 1" className="homepage-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
