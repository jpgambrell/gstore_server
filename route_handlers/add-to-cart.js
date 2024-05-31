const express = require('express')

exports.addToCart = knex =>  {
    
  return (req, res, next) => {
    knex('cart').insert({product: req.body.product, quantity: req.body.quantity, price: req.body.price})
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
