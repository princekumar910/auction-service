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
  const {email} = JSON.parse(event.requestContext.authorizer.claims)
  if(!amount){
    throw new createHttpError.Forbidden('amount will be required')
  }
  
  let UpdateAuction 
  let auction = await getAuctionById(id)
  if(auction.seller === email){
    throw new createHttpError.Forbidden(`You can't bid on you Auction`)
  }
  if(auction.highestBid.bidder === email){
    throw new createHttpError.Forbidden(`You have the highest bid till now`)
  }

   if(auction.status === 'closed'){
      throw new createHttpError.Forbidden(`Bidding is closed. You can't bid`)
    }
  if(auction.highestBid.amount >= amount){
    throw new createHttpError.Forbidden(`amount should be greater than ${auction.highestBid.amount}`)
  }
  try {
    const params =  {
     TableName : process.env.Table_Name,
     Key : {Id : id} ,
     UpdateExpression : "SET highestBid.amount = :Amount , highestBid.bidder = :Bidder",
     ExpressionAttributeValues: {
        ":Amount": amount,
        ":Bidder" : email
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