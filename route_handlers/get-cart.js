exports.getCart = knex => {
    return (req, res, next) => {
      console.log('getCart called')
      //knex.select().from('cart')
      knex('cart').orderBy('update_dt', 'desc')
        .then(rows => {
          res.body = rows
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          next()
        });
    }
  }