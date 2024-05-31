console.log('connecting to PostgresRDs')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


const executeQuery = async ()=> {
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'gstore-database-1.c3qmtyytmzic.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'password1',
    database: 'cart',
    port: 5432,
    ssl: true
  }
});


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
executeQuery()

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

