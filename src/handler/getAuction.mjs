import aws from 'aws-sdk';
const dynamodbClient = new aws.DynamoDB.DocumentClient({
  'region' : 'eu-north-1'
});
import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';

export async function getAuctionById(id){
  console.log("hello world")
  let auction 
  const params = {
    TableName : process.env.Table_Name,
    Key : {Id : id}
  }
  console.log("params" , params)
  try {
    console.log("inside of try block")
    const result = await dynamodbClient.get(params).promise()
    auction = result.Item
  } catch (error) {
    console.error(error)
    throw new createHttpError.InternalServerError(error)
  }
  if(!auction){
    throw new createHttpError.NotFound(`No auction find with ${id}`)
  }
  return auction
}


 const getAuction = async (event, context) => {
   const {id} = event.pathParameters
   let auction = await getAuctionById(id); 
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(auction),
    };
  } 

   


export const handler = middy(getAuction).use(httpEventNormalizer()).use(httpErrorHandler())