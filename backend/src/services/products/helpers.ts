import { APIGatewayProxyResult } from "aws-lambda"

/**
 * Wrapper function to generate API Gateway response for success and error scenarios.
 * @param statusCode - HTTP status code for the response.
 * @param body - Response body as an object.
 * @returns - API Gateway response object.
 */
export const generateResponse = (statusCode: number, body: object): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://mursalfk.github.io/",
    },
  }
}
