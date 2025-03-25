import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';
const dynamodbClient = new aws.DynamoDB.DocumentClient({
  'region' : 'eu-north-1'
});
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { getAuctionById } from './getAuction.mjs';
 const placeBid = async (event, context) => {
  const {id} = event.pathParameters 
  const {amount} = event.body
  
  let UpdateAuction 

  let auction = await getAuctionById(id)
  if(auction.highestBid.amount >= amount){
    throw new createHttpError.Forbidden(`amount should be greater than ${auction.highestBid.amount}`)
  }
  try {
    const params =  {
     TableName : process.env.Table_Name,
     Key : {Id : id} ,
     UpdateExpression : "SET highestBid.amount = :Amount",
     ExpressionAttributeValues: {
        ":Amount": amount,
      },
      ReturnValues : "ALL_NEW"
     
    }
    const result = await dynamodbClient.update(params).promise()
    UpdateAuction = result.Attributes
  } catch (error) {
     console.error(error);
      throw new createHttpError.InternalServerError(error)
  }

  
     return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(UpdateAuction),
    };
  
   

  } 


export const handler = middy(placeBid).use(jsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler())