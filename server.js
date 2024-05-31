console.log('Server started for Gstore')

const express = require('express')
const app = express()

app.use(express.json())

app.post('/format', formatBody, (req, res) => {
   // const body = req.body
    res.status(200).send(res.body)
})

function formatBody(req, res, next){
    var resArr = []
    var body = req.body
    body.forEach((product) => {
        const input = product.product_complete_description.toString() 
        output = input.replace(/(<([^>]+)>)/ig, '')
        //output = input.replace(/(<([^>]+)>)/ig, '')
        console.log(output)
        resArr.push(output)
    })
    res.body = resArr
    next()
}
app.listen(3000)
