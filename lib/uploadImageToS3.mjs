import aws from 'aws-sdk'
const s3Client = new aws.S3({
    region: 'eu-north-1',
});
async function uploadImageToS3(key , data) {
    console.log("inside upload image" , key)
    const params = {
        Bucket: process.env.BucketName,
        Key: key, 
        Body: data, 
        ContentType: 'image/jpeg', 
        ContentEncoding : 'base64' 
    }
    const result = await s3Client.upload(params).promise()
    return result.Location ;
}

export default uploadImageToS3 ;