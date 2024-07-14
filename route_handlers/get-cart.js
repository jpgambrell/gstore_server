const {getCartItems} = require('./knex-helper-queries')

  exports.getCart = knex => {
    return async (req, res, next) => {
      const cart_by = req.params.cart_by
      const query_id = req.params.id //this will always be the user_id when insert in needed
      
    const cart = await getCartItems(knex,cart_by, query_id)
          console.log('cart: ' + JSON.stringify(cart))
          if (cart != null) {
            res.body = cart
            next()
          } else {
            knex('cart').returning(['id', 'user_id']).insert({user_id: query_id}).then(insertedrows => { 
              
              res.body = {
                id: insertedrows[0].id, 
                promotion: "",
                user_id: insertedrows[0].user_id,
                items: []
              }; 
              console.log('ready to return')
            }).finally(() => {
              console.log('calling finally next()')
              next();
            })
            .catch(err => {
              console.error(err);
            })
          }
    };
  }