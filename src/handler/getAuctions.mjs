import aws from 'aws-sdk';
const dynamodbClient = new aws.DynamoDB.DocumentClient(
  {region: 'eu-north-1' }
);
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';


 const getAuction = async (event, context) => {
  console.log("hello world")
  let auctions 

  try {
    const result = await dynamodbClient.scan({TableName : process.env.Table_Name}).promise()
    console.log("after result")
    auctions = result.Items
  } catch (error) {
    console.error("error",error)
    throw new createHttpError.InternalServerError(error)
  }
  console.log("bottom")
    // Return a valid JSON response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({auctions}),
    };
  } 

   
  


export const handler = middy(getAuction).use(httpEventNormalizer()).use(httpErrorHandler())