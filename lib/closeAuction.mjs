import aws from 'aws-sdk'
const dynamodbClient = new aws.DynamoDB.DocumentClient({
    'region' : 'eu-north-1'
})


export async function closeAuction(auction) {

    const params = {
        TableName : process.env.Table_Name,
        Key : {Id : auction.Id},
        UpdateExpression : "set #status = :status",
        ExpressionAttributeValues : {
            ':status' : "closed"
        },
        ExpressionAttributeNames:{
            '#status' : 'status'
        },
    }
    const result = await dynamodbClient.update(params).promise()
    
}