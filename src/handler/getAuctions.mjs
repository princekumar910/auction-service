import aws from 'aws-sdk';
const dynamodbClient = new aws.DynamoDB.DocumentClient();
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
 const getAuction = async (event, context) => {
  let auctions 

  try {
    const result = await dynamodbClient.scan({TableName : process.env.Table_Name}).promise()
    auctions = result.Items
  } catch (error) {
    console.error(error)
    throw new createHttpError.InternalServerError(error)
  }
    // Return a valid JSON response
    return {
      statusCode: 200,
      body: JSON.stringify({auctions}),
    };
  } 

   
  


export const handler = middy(getAuction).use(httpEventNormalizer()).use(httpErrorHandler())