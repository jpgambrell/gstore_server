const express = require('express')

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