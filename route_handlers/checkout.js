
const { getCartItems } = require('./knex-helper-queries')

exports.checkout =  knex => {
    return async (req, res, next) => {
        console.log('call the rows')
        const cart =  await getCartItems(knex,"id",req.params.cart_id )
        console.log('rows count: ' + rows.length)
        res.body = rows
        next()
    }
}


