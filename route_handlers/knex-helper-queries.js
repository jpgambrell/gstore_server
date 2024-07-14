
exports.getCartItems = async (knex, cart_by, query_id) => {
    try {
        const rows = await knex.select('cart.id', 'cart.user_id', 'cart.promotions', 'cart.update_dt', {cdid: 'cart_detail.id'}, 'cart_detail.product_id','cart_detail.quantity', 'cart_detail.price', 'cart_detail.product_name', 'cart_detail.product_image_url')
        .from('cart')
        .leftJoin('cart_detail', 'cart.id', 'cart_detail.cart_id')
        .andWhere('cart.'+cart_by, query_id)
         .orderBy('cart_detail.update_dt', 'desc')
     
         if (rows == null || rows.length == 0) {
            return null
         } else {   
         
         const items = []
             rows.forEach(element => {
               if (element.product_id != null) {
               items.push({id: element.cdid, product_id: element.product_id, product_name: element.product_name, quantity: element.quantity, 
                 price: element.price, product_image_url: element.product_image_url, promotion: element.promotion});  
               }
            })
               return {
                 id: rows[0].id, 
                 promotion: rows[0].promotion,
                 user_id: rows[0].user_id,
                 items: items
               };
            }
              
           
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
}



exports.deleteCartItems = async (knex, cart_id) => {
    try {
        // const rows = await knex.select('cart.id', 'cart.user_id', 'cart.promotions', 'cart.update_dt', {cdid: 'cart_detail.id'}, 'cart_detail.product_id','cart_detail.quantity', 'cart_detail.price', 'cart_detail.product_name', 'cart_detail.product_image_url')
        // .from('cart')
        // .leftJoin('cart_detail', 'cart.id', 'cart_detail.cart_id')
        // .andWhere('cart.'+cart_by, query_id)
        //  .orderBy('cart_detail.update_dt', 'desc')
         await knex('cart_detail')
        .where('cart_id', cart_id).del()

         await knex('cart')
        .where('id', cart_id).del()
    
    } catch (error) {
        console.error("Error deleting cart:", error);
        throw error;
    }
}




