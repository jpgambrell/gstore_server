const express = require('express')

exports.addToCart = knex =>  {
    
  return (req, res, next) => {
    //console.log('addToCart called for' + req.body.product_name)
    knex('cart').insert({product_id: req.body.product_id, product_name: req.body.product_name, quantity: req.body.quantity, price: req.body.price})
      .then(rows => {
        res.body = {"rowCount": rows.rowCount, "command": rows.command}
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        next()
      });

  }
}
