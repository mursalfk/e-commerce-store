"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.deleteOrder = exports.updateOrder = exports.addOrder = exports.getOrders = void 0;
const mongodb_1 = require("mongodb");
const helpers_1 = require("./helpers");
const mongoDBConnection = async () => {
    const mongoDBUrl = "mongodb+srv://mursalfk:Mursal-50@cluster0.kvh56je.mongodb.net/?retryWrites=true&w=majority";
    const client = new mongodb_1.MongoClient(mongoDBUrl, {
        serverApi: {
            version: mongodb_1.ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    return client;
};
const getOrders = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const { page = "1", limit = "20" } = event.queryStringParameters;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const Orders = await client
            .db(process.env.DATABASE_NAME)
            .collection("Orders")
            .find({})
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();
        const nextSkip = skip + parseInt(limit);
        const count = await client.db(process.env.DATABASE_NAME).collection("Orders").countDocuments();
        const nextPageUrl = count > nextSkip ? `${event.path}?page=${parseInt(page) + 1}&limit=${limit}` : null;
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Success", Orders, nextPageUrl });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Error" });
    }
};
exports.getOrders = getOrders;
const addOrder = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const Order = JSON.parse(event.body);
        const OrderObject = await client.db(process.env.DATABASE_NAME).collection("Orders").insertOne(Order);
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Order added successfully", objectId: OrderObject.insertedId });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Failed to add order" });
    }
};
exports.addOrder = addOrder;
const updateOrder = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const Order = JSON.parse(event.body);
        await client.db(process.env.DATABASE_NAME).collection("Orders").updateOne({ _id: Order._id }, { $set: Order });
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Order updated successfully" });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Failed to update order" });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        // Delete the order from the database
        const OrderId = event.pathParameters.id;
        await client
            .db(process.env.DATABASE_NAME)
            .collection("Orders")
            .deleteOne({ _id: new mongodb_1.ObjectId(OrderId) });
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Order deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Failed to delete order" });
    }
};
exports.deleteOrder = deleteOrder;
const getOrderById = async (event) => {
    console.log(event);
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const { id } = event.queryStringParameters;
        const Order = await client.db(process.env.DATABASE_NAME).collection("Orders").findOne({ _id: new mongodb_1.ObjectId(id) });
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Success", Order });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Error" });
    }
};
exports.getOrderById = getOrderById;
//# sourceMappingURL=handler.js.map