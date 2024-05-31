const express = require('express')
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const knex = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: 5432,
      ssl: true
    },
    pool: { min: 2, max: 10 }
  });

exports.addToCart = async function  addToCart( req, res, next) { 
    console.log('addToCart called: ' + req.body)
    knex('cart').insert({product: req.body.product, quantity: req.body.quantity, price: req.body.price})
  .then(rows => {
    res.body = {"rowCount": rows.rowCount, "command": rows.command}
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    knex.destroy();
    //console.log(res.body);
    next()
  });
}