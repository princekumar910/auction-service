import aws from 'aws-sdk';
import { getAuctionById } from './getAuction.mjs';
import uploadImageToS3 from '../../lib/uploadImageToS3.mjs'
const s3Client = new aws.S3({
    region: 'eu-north-1',
});
const dynamodbClient = new aws.DynamoDB.DocumentClient({
    region: 'eu-north-1',
})

async function uploadAuctionImage(event) {
    const { id } = event.pathParameters; 
    const {email} = JSON.parse(event.requestContext.authorizer.claims)
//  handle the case where auction does not exist
try {
    
    const auction = await getAuctionById(id) ;
    if(auction.seller !== email){
        return {
            statusCode:404,
            body: JSON.stringify({ Error: "You are not authorize !" }),
        };
    }
    // check if auction exists apply the logic to upload image
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
    if(!base64Regex.test(event.body)){
        return {
            statusCode: 400,
            body: JSON.stringify({ Error: "Invalid base64 string" }),
        };
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, ''); 
    
    const buffer = Buffer.from(base64, 'base64');
    const result = await uploadImageToS3(`images/${id}.jpg`, buffer); 
    const params =  {
        TableName : process.env.Table_Name,
        Key : {Id : id} ,
        UpdateExpression : "SET imageUrl = :ImageUrl",
        ExpressionAttributeValues: {
            ":ImageUrl": result,
        },
        ReturnValues : "ALL_NEW"
    }
    const uploadedImage = await dynamodbClient.update(params).promise()
    console.log("uploaded image" , uploadedImage)
} catch (error) {
    return {
        statusCode: 201,
        body: JSON.stringify({ Error: error }),
    };
}
return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Image uploaded successfully' }),
};
}
    

export const handler = uploadAuctionImage