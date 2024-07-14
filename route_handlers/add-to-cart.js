const express = require('express')
const {getCartItems} = require('./knex-helper-queries')

exports.addToCart = knex =>  {
  return  (req, res, next) => {
    console.log('addToCart called for' + req.body.product_name)
    knex('cart_detail').insert({cart_id: req.body.cart_id, product_id: req.body.product_id, product_name: req.body.product_name, quantity: req.body.quantity, price: req.body.price, product_image_url: req.body.image})
    .then(async function() {
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

