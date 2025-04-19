import aws from 'aws-sdk'
const dynamodbClient = new aws.DynamoDB.DocumentClient({
    'region' : 'eu-north-1'
})

const sqsClient = new aws.SQS({
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
    console.log("process" , process.env)
    await dynamodbClient.update(params).promise()
    
    const {Title , seller , highestBid} = auction
    const {amount , bidder} = highestBid
    if (!bidder) {
        const notifySeller = await sqsClient.sendMessage({
            QueueUrl : process.env.QUEUE_URL,
            MessageBody : JSON.stringify({
                Subject : "Auction Closed",
                Body : `Your auction ${Title} hasn't been Sold. The bid was closed`,
                recipient : seller
            })
        }).promise()
        return ;
    }
    const notifySeller = await sqsClient.sendMessage({
        QueueUrl : process.env.QUEUE_URL,
        MessageBody : JSON.stringify({
            Subject : "Auction Closed",
            Body : `Your auction ${Title} has been Sold. The highest bid was ${amount} by ${bidder}`,
            recipient : seller
        })
    }).promise()
    const notifyBidder =await sqsClient.sendMessage({
        QueueUrl : process.env.QUEUE_URL,
        MessageBody : JSON.stringify({
            Subject : "You Won an Auction",
            Body : `Your bid of ${amount} for auction ${Title} was successful`,
            recipient : bidder
        })
    }).promise()

    

    return Promise.all([notifySeller, notifyBidder])  
}