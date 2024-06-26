const express = require('express')

exports.deleteFromCart = knex =>  {
    
  return (req, res, next) => {
    console.log('deleteFromCart called for' + req.body.product_id)
     knex('cart').where('product_id', req.body.product_id).del()
     .then(rowsAffected => {
        console.log(`${rowsAffected} row(s) deleted.`);
        res.statusCode = (rowsAffected == 1 ? 200 : 404)
  })
  .then(function()  {
    //console.log('getCartAfterDel called' + res.statusCode)
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