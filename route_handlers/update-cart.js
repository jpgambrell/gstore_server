const express = require('express')

exports.updateCart = knex =>  {
    //TODO better error handling that calls next() to not hang the server
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
  .then(function()  {
    knex
    .select('cart.id', 'cart.user_id', 'cart.promotions', 'cart.update_dt', {cdid: 'cart_detail.id'}, 'cart_detail.product_id','cart_detail.quantity', 'cart_detail.price', 'cart_detail.product_name', 'cart_detail.product_image_url')
    .from('cart')
    .leftJoin('cart_detail', 'cart.id', 'cart_detail.cart_id')
     .orderBy('cart_detail.update_dt', 'desc')
       .then(rows => {
         //console.log('getCart left join called: ' )
         const items = []
         rows.forEach(element => {
           if (element.product_id != null) {
           items.push({id: element.cdid, product_id: element.product_id, product_name: element.product_name, quantity: element.quantity, 
             price: element.price, product_image_url: element.product_image_url, promotion: element.promotion});  
           }
         });
         console.log('rows count: ' + rows.length)
           
           res.body = {
             id: rows[0].id, 
             promotion: rows[0].promotion,
             user_id: rows[0].user_id,
             items: items
           };
           console.log('existing cart rows: ' + JSON.stringify(res.body))
          // next()
       }).finally(() => {
        console.log('calling finally next()')
        next();
      })
       .catch(err => {
         console.error(err);
       })      
  })
  


    
    
  }
}