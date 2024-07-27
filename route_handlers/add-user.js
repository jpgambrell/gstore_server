exports.addUser =  knex => {
    return async (req, res, next) => {
        knex('user').returning(['id', 'first_name', 'last_name', 'email', 'address', 'city', 'state', 'zip', 'mobile'])
        .insert({first_name: req.body.first_name, last_name: req.body.last_name,email: req.body.email, 
            address: req.body.address, city: req.body.city, state: req.body.state, zip: req.body.zip, mobile: req.body.mobile})
            .then(insertedrow => { 
              
                res.body = insertedrow

            console.log('user created: ' + JSON.stringify(insertedrow))
            next();
            })
    }
}