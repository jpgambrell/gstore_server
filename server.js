//npm run devStart

console.log('Server started for Gstore')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const {addToCart} = require('./route_handlers/add-to-cart')
const {getCart} = require('./route_handlers/get-cart')
const {deleteFromCart} = require('./route_handlers/delete-from-cart') 

const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument} = require("@aws-sdk/lib-dynamodb")
const express = require('express')


const dynamo = DynamoDBDocument.from(new DynamoDB());

require('dotenv').config()


const app = express()
var types = require('pg').types
types.setTypeParser(types.builtins.NUMERIC, value => parseFloat(value))

const knex = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: 5432,
      ssl: false
    },
    pool: { min: 2, max: 10 }
  });

app.use(express.json())
//--------------catalog routes
app.get('/catalog', getProductCatalog, (req, res)=> {
    res.status(200).send(res.body)
})
//TODO move to own file
async function  getProductCatalog( req, res, next) {
  console.log('getProductCatalog called')
  const posts = await dynamo.scan({ TableName: "gstore_product_catalog" });
  const smallPaylout = posts.Items.slice(0, 20)
  res.body = smallPaylout
  //res.body = posts.Items
  next()
}

//----------------cart routes
app.get('/cart', getCart(knex), (req, res)=> {
    res.status(200).send(res.body)
})

app.post('/addToCart', addToCart(knex), (req, res)=> {
    res.status(200).send(res.body)
})
app.post('/deleteFromCart', deleteFromCart(knex), (req, res)=> {
  
  //console.log('getCartAfterDelBeforeSend called: ' + JSON.stringify(res))
  res.send(res.body)
})






app.disable('etag');
app.listen(3000)

process.on("exit", (code) => {
    console.log("Process exit event with code: ", code);
    knex.destroy();
    console.log("knex has been destroyed.");
  });
  
  // just in case some user like using "kill"
  process.on("SIGTERM", (signal) => {
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    knex.destroy();
    console.log("knex has been destroyed.");
    process.exit(0);
  });
