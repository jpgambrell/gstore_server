
const { getCartItems } = require('./knex-helper-queries')

exports.checkout =  knex => {
    return async (req, res, next) => {
        console.log('call the rows')
        const rows =  await getCartItems(knex,req.params.cart_id )
        console.log('rows count: ' + rows.length)
        res.body = rows
        next()
    }
}


// async function getRows(knex) {
//      return () {
//         knex
// .select('cart.id', 'cart.user_id', 'cart.promotions', 'cart.update_dt', {cdid: 'cart_detail.id'}, 'cart_detail.product_id','cart_detail.quantity', 'cart_detail.price', 'cart_detail.product_name', 'cart_detail.product_image_url')
//         .from('cart')
//         .leftJoin('cart_detail', 'cart.id', 'cart_detail.cart_id')
//         .orderBy('cart_detail.update_dt', 'desc').then(rows => {
//             console.log('rows count: ' + rows.length)
//             arows = rows
                
//         })
//     }
// }