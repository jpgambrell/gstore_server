const express = require('express')
const {getCartItems} = require('./knex-helper-queries')
exports.updateCart = knex =>  {
  return (req, res, next) => {
    console.log('updateCart called for' + req.body.product_id)
     knex('cart_detail').where('product_id', req.body.product_id)
     .andWhere('cart_id', req.body.cart_id).update({
        quantity: req.body.quantity
     })
     .then(rowsAffected => {
        console.log(`${rowsAffected} row(s) updated.`);
        res.statusCode = (rowsAffected == 0 ? 404 : 201)
  })
  .then(async function()  {
    const cart = await getCartItems(knex,"id", req.body.cart_id)
    console.log('cart retrived - cartID: ' + cart.id)
    res.body = cart

       }).finally(() => {
        next();
      })
       .catch(err => {
         console.error(err);
       })      
  }    
  }
