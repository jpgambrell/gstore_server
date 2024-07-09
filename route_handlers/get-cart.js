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
     // knex('cart')
     // .join('cart_detail', 'cart.id', 'cart_detail.cart_id')
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
          if (rows.length > 0) {
            console.log('existing cart rows: ' + JSON.stringify(rows))
            res.body = {
              id: rows[0].id, 
              promotion: rows[0].promotion,
              user_id: rows[0].user_id,
              items: items
            };
            next()
          } else {
            knex('cart').returning(['id', 'user_id']).insert({user_id: 1}).then(insertedrows => { 
              
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
            });

            
          }
        })
        .catch(err => {
          console.error(err);
        })
    };
  }