import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda"
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb"
import { generateResponse } from "./helpers"
import fetch from "node-fetch"


const mongoDBConnection = async () => {
  const mongoDBUrl = "mongodb+srv://mursalfk:Mursal-50@cluster0.kvh56je.mongodb.net/?retryWrites=true&w=majority"
  const client = new MongoClient(mongoDBUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  return client
}

export const getProducts: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const client = await mongoDBConnection()
    await client.connect()

    const { page = "1", limit = "20" } = event.queryStringParameters
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await client
      .db(process.env.DATABASE_NAME)
      .collection("products")
      .find({})
      .skip(skip)
      .limit(parseInt(limit))
      .toArray()

    const nextSkip = skip + parseInt(limit)
    const count = await client.db(process.env.DATABASE_NAME).collection("products").countDocuments()
    const nextPageUrl = count > nextSkip ? `${event.path}?page=${parseInt(page) + 1}&limit=${limit}` : null

    await client.close()

    return generateResponse(200, { message: "Success", products, nextPageUrl })
  } catch (err) {
    console.error(err)
    return generateResponse(500, { message: "Error" })
  }
}

export const addProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const client = await mongoDBConnection()
    await client.connect()
    const product = JSON.parse(event.body)
    const productObject = await client.db(process.env.DATABASE_NAME).collection("products").insertOne(product)

    await client.close()

    return generateResponse(200, { message: "Product added successfully" , objectId: productObject.insertedId})
  } catch (err) {
    console.error(err)
    return generateResponse(500, { message: "Failed to add listing" })
  }
}

export const updateProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const client = await mongoDBConnection()
    await client.connect()

    const product = JSON.parse(event.body)
    await client.db(process.env.DATABASE_NAME).collection("products").updateOne({ _id: product._id }, { $set: product })
    await client.close()
    return generateResponse(200, { message: "Product updated successfully" })
  } catch (err) {
    console.error(err)
    return generateResponse(500, { message: "Failed to update listing" })
  }
}

export const deleteProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const client = await mongoDBConnection()
    await client.connect()

    // Delete the listing from the database
    const productId = event.pathParameters.id
    await client
      .db(process.env.DATABASE_NAME)
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) })
    await client.close()

    return generateResponse(200, { message: "Product deleted successfully" })
  } catch (err) {
    console.error(err)
    return generateResponse(500, { message: "Failed to delete listing" })
  }
}

export const getProductById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log(event)
  try {
    const client = await mongoDBConnection()
    await client.connect()
    const { id } = event.queryStringParameters
    const product = await client.db(process.env.DATABASE_NAME).collection("products").findOne({ _id: new ObjectId(id) })
    await client.close()

    return generateResponse(200, { message: "Success", product })
  } catch (err) {
    console.error(err)
    return generateResponse(500, { message: "Error" })
  }
}

