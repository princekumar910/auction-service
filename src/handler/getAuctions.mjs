import aws from 'aws-sdk';
const dynamodbClient = new aws.DynamoDB.DocumentClient({
  'region' : 'eu-north-1'
});
import middy from '@middy/core';
import validator from '@middy/validator';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import getAuctionSchema from '../../lib/getAuctionsSchema.mjs'

 const getAuction = async (event, context) => {
  console.log("inside getAuctions function")

  const {status = 'open'} = event.queryStringParameters || {}
  const params = {
    TableName : process.env.Table_Name,
    IndexName : "statusAndEndingDate",
    KeyConditionExpression : "#status = :status",
    ExpressionAttributeValues : {
      ":status" : status
    },
    ExpressionAttributeNames : {
      "#status" : "status"
    }
  }
  let auctions 
  
  try {
    const result = await dynamodbClient.query(params).promise()
    auctions = result.Items
  } catch (error) {
    console.error("error",error)
    throw new createHttpError.InternalServerError(error)
  }
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