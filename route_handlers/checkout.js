
const { getCartItems, deleteCartItems } = require('./knex-helper-queries')
const {getCart} = require('./get-cart')

exports.checkout =  knex => {
    return async (req, res, next) => {
        const user_id = req.params.user_id
        const cart_id = req.params.cart_id
        const invoice_number = 'INV' + user_id + cart_id +  Date().slice(0,3).toUpperCase()
        
        knex('order').returning(['id']).insert({user_id: user_id, invoice_number: invoice_number, status: "IN PROGRESS"})
        .then(async insertedrows => {
            const order_id = insertedrows[0].id
            
            console.log('order id: ' + order_id)
            knex.raw("INSERT INTO order_detail (order_id,product_id, product_name, product_image_url,quantity, price) " +
                "select ?, product_id, product_name, product_image_url, quantity, price from cart_detail " +
                "where cart_id = ?", [order_id, cart_id]).then(async function() {
                    await deleteCartItems(knex, cart_id)

                }).finally(() => {
                    //create new cart for next transation
                    knex('cart').returning(['id', 'user_id']).insert({user_id: user_id}).then(insertedrows => { 
              
                        res.body = {
                          id: insertedrows[0].id, 
                          promotion: "",
                          user_id: insertedrows[0].user_id,
                          items: []
                        }; 

                    console.log('calling checkout finally next()')
                    next();
                    })
                })
        }).catch(err => {
            console.error(err);
        })
}
}