const express = require('express')
const {getCartItems} = require('./knex-helper-queries')

exports.deleteFromCart = knex =>  {
    //TODO better error handling that calls next() to not hang the server
  return (req, res, next) => {
    console.log('deleteFromCart called for' + req.params.product_id + ' cart_id: ' + req.params.cart_id)
     knex('cart_detail')
     .where('cart_id', req.params.cart_id)
  .andWhere('product_id', req.params.product_id).del()//.where('cart_id', req.params.cart_id, 'product_id', req.params.product_id).del()
     .then(rowsAffected => {
        console.log(`${rowsAffected} row(s) deleted.`);
        res.statusCode = (rowsAffected == 0 ? 404 : 201)
  })
  .then(async function()  {
      const cart = await getCartItems(knex,"id", req.params.cart_id)
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