import aws from 'aws-sdk'
const dynamodbClient = new aws.DynamoDB.DocumentClient()
export async function getEndedAuction(){

  const now = new Date();
  const params = {
    TableName : process.env.Table_Name,
    IndexName : statusAndEndingDate,
    KeyConditionExpression : '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues : {
        ':status' : 'open',
        ':now' : now.toISOString()
    },
    ExpressionAttributeName:{
        '#status' : 'status'
    }
  }

  const result = await dynamodbClient.query(params).promise()
  return result.Items;

}