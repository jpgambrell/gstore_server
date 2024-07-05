// exports.getCart = knex => {
//     return (req, res, next) => {
//       console.log('getCart called')
//       //knex.select().from('cart')
//       knex('cart').orderBy('update_dt', 'desc')
//         .then(rows => {
//           res.body = rows
//         })
//         .catch(err => {
//           console.error(err);
//         })
//         .finally(() => {
//           next()
//         });
//     }
//   }

  exports.getCart = knex => {
    return (req, res, next) => {
      console.log('getCart called')
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
        })
        .finally(() => {
          next();
        });
    };
  }