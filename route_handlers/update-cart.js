const express = require('express')

exports.updateCart = knex =>  {
    //TODO better error handling that calls next() to not hang the server
  return (req, res, next) => {
    console.log('updateCart called for' + req.body.product_id)
     knex('cart').where('product_id', req.body.product_id).update({
        quantity: req.body.quantity
     })
     .then(rowsAffected => {
        console.log(`${rowsAffected} row(s) updated.`);
        res.statusCode = (rowsAffected == 0 ? 404 : 201)
  })
  .then(function()  {
    knex.select().from('cart')
    .then(rows => {
      res.body = rows
    })
    .catch(err => {
        console.error(err);
        res.statusCode = 501
      })
      .finally(() => {
        next()
      });
   
  })
  


    
    
  }
}