import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda"
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb"
import { generateResponse } from "./helpers"


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters
  const client = new MongoClient(process.env.MONGODB_URI!, {
    serverApi: ServerApiVersion.v1,
  })
  await client.connect()
  const db = client.db()
  const products = db.collection("products")
  const product = await products.findOne({ _id: new ObjectId(id) })
  await client.close()
  return generateResponse(200, product)
}