const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument} = require("@aws-sdk/lib-dynamodb")


const region = "us-east-1" // your preferred region
const dynamo = DynamoDBDocument.from(new DynamoDB({ region }));
//const client = new DynamoDB({ region })



const getAllPosts = async () => {
    // const params = {
    //     TableName: "guidepost"
    // }
    // const posts = await client.scan(params)
    // console.log(JSON.stringify(posts))

    const posts = await dynamo.get({
      TableName: "guidepost",
      Key: {
        id: "36A7CC40-18C1-48E5-BCD8-3B42D43BEAEE"
      }
    })
    //const posts = await dynamo.scan({ TableName: "guidepost" });
    console.log(JSON.stringify(posts))
}

getAllPosts()