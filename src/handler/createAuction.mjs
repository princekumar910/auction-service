import aws from 'aws-sdk';

const dynamodbClient = new aws.DynamoDB.DocumentClient();

export const lambdaHandler = async (event, context) => {
  const {title} = JSON.parse(event.body)
  try {
    const params = {
      TableName: 'AuctionTable', 
      Item: {
        Id: "princekumar007p", 
        userName : title
      },
    };

    
    await dynamodbClient.put(params).promise();
    console.log("Data inserted successfully");

    // Return a valid JSON response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Data inserted successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "An error occurred",
        error: error.message,
      }),
    };
  }
};