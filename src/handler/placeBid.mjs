import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';
const dynamodbClient = new aws.DynamoDB.DocumentClient();
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
 const placeBid = async (event, context) => {
  const {id} = event.pathParameters 
  const {amount} = event.body
  
  let UpdateAuction 
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