"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = void 0;
/**
 * Wrapper function to generate API Gateway response for success and error scenarios.
 * @param statusCode - HTTP status code for the response.
 * @param body - Response body as an object.
 * @returns - API Gateway response object.
 */
const generateResponse = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://mursalfk.github.io/",
        },
    };
};
exports.generateResponse = generateResponse;
//# sourceMappingURL=helpers.js.map