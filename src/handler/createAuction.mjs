import aws from 'aws-sdk';

const dynamodbClient = new aws.DynamoDB.DocumentClient();

export const lambdaHandler = async (event, context) => {
  try {
    // Correctly structure the DynamoDB put request
    const params = {
      TableName: 'AuctionTable', // Replace with your actual table name
      Item: {
        id: "princekumar007p", // Example key-value pair
      },
    };

    // Perform the DynamoDB put operation
    await dynamodbClient.put(params).promise();
    console.log("Data inserted successfully");

    // Return a valid JSON response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data inserted successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    // Return a valid JSON response even in case of an error
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred",
        error: error.message, // Optional: Include the error message for debugging
      }),
    };
  }
};