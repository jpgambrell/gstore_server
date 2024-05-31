const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument} = require("@aws-sdk/lib-dynamodb")

const prodCat = require('./data/output.json')

//const region = "us-east-1" // your preferred region
const dynamo = DynamoDBDocument.from(new DynamoDB());
//const client = new DynamoDB({ region })



const getAllPosts = async () => {
    // const params = {
    //     TableName: "guidepost"
    // }
    // const posts = await client.scan(params)
    // console.log(JSON.stringify(posts))

    const posts = await dynamo.get({
      TableName: "gstore_product_catalog",
      Key: {
        id: "2479a8ce-bc93-4577-a8f7-a20e2ab5f313"
      }
    })
    //const posts = await dynamo.scan({ TableName: "guidepost" });

    const item = posts.Item
    console.log(JSON.stringify(item.description.trim()))
}

getAllPosts()

const uploadProductCatalogJSON = async () => {
    prodCat.forEach(async (p) => {
        console.log(JSON.stringify(p.id + 'added'))
        await dynamo.put({
            TableName: "gstore_product_catalog",
            Item: {
                id: p.id,
                name: p.name.trim(),
                brand: p.brand,
                sku: p.sku,
                price: p.price,
                availability: p.availability,
                category: p.category.trim(),
                sub_category: p.sub_category.trim(),
                images: p.images,
                description: p.description.trim(),
                average_rating: p.average_rating,
                specs : p.specs.trim(),
            }

  })
});

}
//uploadProductCatalogJSON()
