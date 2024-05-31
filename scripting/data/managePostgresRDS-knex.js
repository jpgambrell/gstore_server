console.log('connecting to PostgresRDs')
require('dotenv').config({path: '../../.env'})

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
    ssl: true
  }
});

const executeInsertQuery = async ()=> {

  knex('cart').insert({product: 'Cheeseburger', quantity: 2, price: 5.99})
  .then(rows => {
    console.log(rows);
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    knex.destroy();
  });
}


const executeSelectQuery = async ()=> {
  console.log("host: " + process.env.HOST)
 

knex.select('*').from('cart')
  .then(rows => {
    console.log(rows);
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    knex.destroy();
  });
}
//executeInsertQuery()
executeSelectQuery()

// const executeQuery = async ()=> {
//   const client = await new Client({
//     "port": 5432,
//     "user": "postgres",
//     "password": "password1",
//     "host": "gstore-database-1.c3qmtyytmzic.us-east-1.rds.amazonaws.com",
//     "database": "cart",
//     "ssl": true
//   });
//   await client.connect();
//   let values = []
//   const result = await client.query("select * from cart");
//   console.log('anything in values? ' + values)
//   console.log("query res: " + JSON.stringify(result.rows))
//   await client.end();
//   return result;
// }
// executeQuery()

