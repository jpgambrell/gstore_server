const express = require('express')

exports.deleteFromCart = knex =>  {
    //TODO better error handling that calls next() to not hang the server
  return (req, res, next) => {
    console.log('deleteFromCart called for' + req.params.product_id)
     knex('cart').where('product_id', req.params.product_id).del()
     .then(rowsAffected => {
        console.log(`${rowsAffected} row(s) deleted.`);
        res.statusCode = (rowsAffected == 0 ? 404 : 201)
  })
  .then(function()  {
    knex.select().from('cart')
    .then(rows => {
      res.body = rows
      console.log('this should finish before send' + JSON.stringify(res.body))
    })
    .catch(err => {
        console.error(err);
        res.statusCode = 501
      })
      .finally(() => {
          console.log('calling next()')
        next()
      });
   
  })
  


    
    
  }
}