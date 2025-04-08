import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';
const dynamodbClient = new aws.DynamoDB.DocumentClient({ region: 'eu-north-1'} );
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
 const createAuction = async (event, context) => {
  console.log("hello world" , event)
  const {title} = event.body
  if(!title){
       throw new createHttpError.Forbidden('title is required for Auction')
  }
  const now = new Date()
  const endDate = new Date()
  endDate.setHours(now.getHours() + 1);
  console.log("now time",now.getHours())
  console.log("end time" , endDate.toISOString())
  try {
    const params = {
      TableName: 'AuctionTable', 
      Item: {
        Id: uuid(), 
        Title : title ,
        status : "open",
        createdAt : now.toISOString(),
        endingAt : endDate.toISOString(),
        highestBid :{
          amount : 0
        }

      },
    };
    await dynamodbClient.put(params).promise();
    console.log("Data inserted successfully");
} catch (error) {
  console.error("error : ",error);
  throw new createHttpError.InternalServerError(error)
}

    // Return a valid JSON response
    return {
      statusCode: 200, 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Data inserted successfully",
      }),
    };
  } 


export const handler = middy(createAuction).use(jsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler())