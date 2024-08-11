//npm run devStart

console.log('Server started for Gstore')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const {addToCart} = require('./route_handlers/add-to-cart')
const {updateCart} = require('./route_handlers/update-cart')
const {getCart} = require('./route_handlers/get-cart')
const {deleteFromCart} = require('./route_handlers/delete-from-cart') 
const {checkout} = require('./route_handlers/checkout')
const {addUser} = require('./route_handlers/add-user')
const {login, refresh} = require('./route_handlers/login')
const {signup} = require('./route_handlers/signup')

const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument} = require("@aws-sdk/lib-dynamodb")

const { CognitoJwtVerifier } = require('aws-jwt-verify')


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

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.CLIENT_ID
});

try {
  
  console.log("Verifying token..." + req.header('Authorization'));
  const payload = await verifier.verify(req.header('Authorization'));
  console.log("Token is valid. Payload:", payload);
} catch(err) {
  console.log("Token not valid! Error:", err);
}




  console.log('getProductCatalog called')
  const posts = await dynamo.scan({ TableName: "gstore_product_catalog" });
  const smallPaylout = posts.Items.slice(0, 20)
  res.body = smallPaylout
  //res.body = posts.Items
  next()
}

//----------------cart routes
app.get('/cart/:cart_by/:id', getCart(knex), (req, res)=> {
    res.status(200).send(res.body)
})

app.post('/addToCart', addToCart(knex), (req, res)=> {
    res.status(200).send(res.body)
})
app.post('/deleteFromCart/:cart_id/:product_id', deleteFromCart(knex), (req, res)=> {
  
  console.log('req parms: ' + req.params.product_id)
  res.send(res.body)
})

app.post('/updateCart', updateCart(knex), (req, res)=> {
  res.send(res.body)
})

app.post('/checkout/:user_id/:cart_id', checkout(knex), (req, res)=> {
  console.log('checkout done')
  res.send(res.body)
})

app.post('/addUser', addUser(knex), (req, res)=> {
  res.send(res.body)
})

app.post('/login', login, (req, res)=> {
  res.send(res.body)
})

app.post('/refresh', refresh, (req, res)=> {
  res.send(res.body)
})

app.post('/signup', signup, (req, res)=> {
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
