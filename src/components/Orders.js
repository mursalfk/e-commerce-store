import React, { useEffect, useState } from "react";
import axios from "axios";
import withContext from "../withContext";

const Orders = (props) => {
    const user = props.context.user;
    const [isAdmin, setIsAdmin] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user && user.accessLevel < 1) {
            console.log(2)
            setIsAdmin(true);
        } else if (user && user.accessLevel >= 1) {
            setIsAdmin(false);
            console.log(1)
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "https://zm06kfxmx0.execute-api.ap-south-1.amazonaws.com/dev/api/v1/getAllOrders?page=1&limit=10"
                );
                if (isAdmin === true) {
                    setOrders(response.data.Orders);
                } else {
                    setOrders(response.data.Orders.filter((order) => order.checkoutCart.user === user.email));
                }

            } catch (error) {
                console.log("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const calculateTotalPrice = (items) => {
        return items.reduce(
            (total, item) => total + item.product.price * item.amount,
            0
        );
    };

    const formatLocalTime = (timestamp) => {
        const localTime = new Date(timestamp).toLocaleString();
        return localTime;
    };

    const markCompleted = (orderId) => {
        // Implement the logic to mark an order as completed
        console.log("Marked as completed:", orderId);
    };

    const deleteOrder = (orderId) => {
        // Implement the logic to delete an order
        console.log("Deleted order:", orderId);
    };

    return (
        <div className="container">
            {user ? (
                <>
                    {isAdmin ? (
                        <h2 className="title">Admin Orders Page</h2>
                    ) : (
                        <h2 className="title">My Orders</h2>
                    )}

                    {orders && orders.length ? (
                        <>
                            <table className="table is-bordered is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Serial Number</th>
                                        <th>Order ID</th>
                                        <th>User</th>
                                        <th>Products</th>
                                        <th>Total Price</th>
                                        <th>Order Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order._id}>
                                            <td>{index + 1}</td>
                                            <td>{order._id}</td>
                                            <td>{order.checkoutCart.user}</td>
                                            <td>
                                                {order.checkoutCart.items.map((item) => (
                                                    <p key={item.id}>{item.product.name}</p>
                                                ))}
                                            </td>
                                            <td>${calculateTotalPrice(order.checkoutCart.items)}</td>
                                            <td>{formatLocalTime(order.checkoutCart.timestamp)}</td>
                                            <td>{order.checkoutCart.status}</td>
                                            <td>
                                                <button
                                                    className="button is-success"
                                                    onClick={() => markCompleted(order._id)}
                                                >
                                                    Mark Completed
                                                </button>
                                                <button
                                                    className="button is-danger"
                                                    onClick={() => deleteOrder(order._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <>
                            <div className="title has-text-grey-light">
                                No orders found!
                            </div>
                        </>
                    )}

                </>
            ) : (
                <div className="title has-text-grey-light">Login to view orders!</div>
            )}
        </div>
    );
};

export default withContext(Orders);
