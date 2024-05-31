//npm run devStart

console.log('Server started for Gstore')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const {addToCart} = require('./route_handlers/add-to-cart')

const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument} = require("@aws-sdk/lib-dynamodb")
const express = require('express')


const dynamo = DynamoDBDocument.from(new DynamoDB());

require('dotenv').config()


const app = express()

const knex = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: 5432,
      ssl: true
    },
    pool: { min: 2, max: 10 }
  });

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

//==================================================


app.post('/addToCart', addToCart(knex), (req, res)=> {
    res.status(200).send(res.body)
})


// async function  addToCart( req, res, next) { 
//     console.log('addToCart called: ' + req.body)
//     knex('cart').insert({product: req.body.product, quantity: req.body.quantity, price: req.body.price})
//   .then(rows => {
//     res.body = {"rowCount": rows.rowCount, "command": rows.command}
//   })
//   .catch(err => {
//     console.error(err);
//   })
//   .finally(() => {
//     knex.destroy();
//     //console.log(res.body);
//     next()
//   });
// }


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
