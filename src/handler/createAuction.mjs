import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';
const dynamodbClient = new aws.DynamoDB.DocumentClient();
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
 const createAuction = async (event, context) => {
  const {title} = event.body
  try {
    const params = {
      TableName: 'AuctionTable', 
      Item: {
        Id: uuid(), 
        userName : title
      },
    };
try {
  
  
  await dynamodbClient.put(params).promise();
  console.log("Data inserted successfully");
} catch (error) {
  console.error(error);
  throw new createHttpError.InternalServerError(error)
}

    // Return a valid JSON response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Data inserted successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "An error occurred",
        error: error.message,
      }),
    };
  }
};

export const handler = middy(createAuction).use(jsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler())