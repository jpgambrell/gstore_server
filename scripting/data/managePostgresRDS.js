console.log('connecting to PostgresRDs')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const {Client} = require('pg')


const executeQuery = async ()=> {
  const client = await new Client({
    "port": 5432,
    "user": "postgres",
    "password": "password1",
    "host": "gstore-database-1.c3qmtyytmzic.us-east-1.rds.amazonaws.com",
    "database": "cart",
    "ssl": true
  });
  await client.connect();
  let values = []
  const result = await client.query("select * from cart");
  console.log('anything in values? ' + values)
  console.log("query res: " + JSON.stringify(result.rows))
  await client.end();
  return result;
}
executeQuery()

