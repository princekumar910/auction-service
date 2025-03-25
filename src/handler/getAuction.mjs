import aws from 'aws-sdk';
const dynamodbClient = new aws.DynamoDB.DocumentClient();
import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
 const getAuction = async (event, context) => {
  let auction; 
  try {
    const {id} = event.pathParameters
    const params = {
        TableName : process.env.Table_Name,
        Key : {Id : id}
    }
    
    const result =  await dynamodbClient.get(params).promise()
    
    auction = result.Item
  } catch (error) {
    console.error(error)
    throw new createHttpError.InternalServerError(error)
  } 
  
  if(!auction){
   throw new createHttpError.NotFound(`No auciton find with ${id}`)
  }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(auction),
    };
  } 

   


export const handler = middy(getAuction).use(httpEventNormalizer()).use(httpErrorHandler())