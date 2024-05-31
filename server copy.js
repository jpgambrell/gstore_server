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

app.post('/format', formatBody, (req, res) => {
   // const body = req.body
    res.status(200).send(res.body)
})

async function  getProductCatalog( req, res, next) {
    const posts = await dynamo.scan({ TableName: "gstore_product_catalog" });
    res.body = posts
    next()
}
function formatBody(req, res, next){
    var resArr = []
    var body = req.body
    body.forEach((p) => {
        //const input = p.product_complete_description.toString() 
        p.description = stripHTMLTags( p.description)
        p.product_complete_description = stripHTMLTags( p.product_complete_description)
        p.product_specifications = stripHTMLTags( p.product_specifications)
        
        //output = input.replace(/(<([^>]+)>)/ig, '')
        console.log(stripHTMLTags(p).toString())
       // resArr.push(output)
    })
    res.body = body
    next()
}


app.listen(3000)
