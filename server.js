//npm run devStart

console.log('Server started for Gstore')

const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument} = require("@aws-sdk/lib-dynamodb")
const express = require('express')


const dynamo = DynamoDBDocument.from(new DynamoDB());
const app = express()

app.use(express.json())

app.get('/catalog', getProductCatalog, (req, res)=> {
    res.status(200).send(res.body)
})

async function  getProductCatalog( req, res, next) {
    console.log('getProductCatalog called')
    const posts = await dynamo.scan({ TableName: "gstore_product_catalog" });
    const smallPaylout = posts.Items.slice(0, 20)
    res.body = smallPaylout
    //res.body = posts.Items
    next()
}



app.listen(3000)
