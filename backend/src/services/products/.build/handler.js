"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
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
const getProducts = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const { page = "1", limit = "20" } = event.queryStringParameters;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await client
            .db(process.env.DATABASE_NAME)
            .collection("products")
            .find({})
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();
        const nextSkip = skip + parseInt(limit);
        const count = await client.db(process.env.DATABASE_NAME).collection("products").countDocuments();
        const nextPageUrl = count > nextSkip ? `${event.path}?page=${parseInt(page) + 1}&limit=${limit}` : null;
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Success", products, nextPageUrl });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Error" });
    }
};
exports.getProducts = getProducts;
const addProduct = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const product = JSON.parse(event.body);
        const productObject = await client.db(process.env.DATABASE_NAME).collection("products").insertOne(product);
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Product added successfully", objectId: productObject.insertedId });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Failed to add product" });
    }
};
exports.addProduct = addProduct;
const updateProduct = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const product = JSON.parse(event.body);
        await client.db(process.env.DATABASE_NAME).collection("products").updateOne({ _id: product._id }, { $set: product });
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Product updated successfully" });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (event) => {
    try {
        const client = await mongoDBConnection();
        await client.connect();
        // Delete the listing from the database
        const productId = event.pathParameters.id;
        await client
            .db(process.env.DATABASE_NAME)
            .collection("products")
            .deleteOne({ _id: new mongodb_1.ObjectId(productId) });
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Product deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
const getProductById = async (event) => {
    console.log(event);
    try {
        const client = await mongoDBConnection();
        await client.connect();
        const { id } = event.queryStringParameters;
        const product = await client.db(process.env.DATABASE_NAME).collection("products").findOne({ _id: new mongodb_1.ObjectId(id) });
        await client.close();
        return (0, helpers_1.generateResponse)(200, { message: "Success", product });
    }
    catch (err) {
        console.error(err);
        return (0, helpers_1.generateResponse)(500, { message: "Error" });
    }
};
exports.getProductById = getProductById;
//# sourceMappingURL=handler.js.map