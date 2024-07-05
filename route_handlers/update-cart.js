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

    // knex.select().from('cart')
    // .then(rows => {
    //   res.body = rows
    // })
    knex('cart')
    .join('cart_detail', 'cart.id', 'cart_detail.cart_id')
    .orderBy('cart_detail.update_dt', 'desc')
      .then(rows => {
        const items = []
        rows.forEach(element => {
          console.log(element)
          items.push({id: element.id, product_id: element.product_id, product_name: element.product_name, quantity: element.quantity, 
            price: element.price, product_image_url: element.product_image_url, promotion: element.promotion});  
        });
        const result = {
          id: rows[0].cart_id, 
          promotion: rows[0].promotion,
          user_id: rows[0].user_id,
          items: items
        };
        res.body = result;
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