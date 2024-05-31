console.log('Server started for Gstore')

const prodCat = require('./data/csvjson.json')
const express = require('express')
const app = express()

app.use(express.json())

app.get('/data', (req, res)=> {
    console.log(prodCat[0])
    res.status(200).send(prodCat[0])
})

app.post('/format', formatBody, (req, res) => {
   // const body = req.body
    res.status(200).send(res.body)
})

function formatBody(req, res, next){
    var resArr = []
    var body = req.body
    body.forEach((p) => {
        //const input = p.product_complete_description.toString() 
        p.description = stripHTMLTags( p.description)
        p.product_complete_description = stripHTMLTags( p.product_complete_description)
        p.product_specifications = stripHTMLTags( p.product_specifications)
        
        //output = input.replace(/(<([^>]+)>)/ig, '')
        console.log(stripHTMLTags(p).toString())
       // resArr.push(output)
    })
    res.body = body
    next()
}

function stripHTMLTags(str) {
    if ((str === null) || (str === ''))
    return false;
else
    str = str.toString();

// Regular expression to identify HTML tags in
// the input string. Replacing the identified
// HTML tag with a null string.
return str.replace(/(<([^>]+)>)/ig, '');
}
app.listen(3000)
