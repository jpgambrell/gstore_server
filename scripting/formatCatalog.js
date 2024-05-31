console.log('hello from data formating')

const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const prodCat = require('./data/csvjson.json')

// let images = prodCat[0].images
// console.log(images)
// let imagesArr = []
// imagesArr = images.split('~')


prodCat.forEach((p) => {
    p.id = uuidv4()
    p.description = stripHTMLTags( p.description)
    p.specs = stripHTMLTags( p.specs)
    p.sku = p.sku.toString()
    p.images = p.images.split('~')
    console.log(p.images)
})
fs.writeFileSync('./data/output.json', JSON.stringify(prodCat))


function stripHTMLTags(str) {
    if ((str === null) || (str === ''))
    return false;
else
    str = str.toString();

// Regular expression to identify HTML tags in
// the input string. Replacing the identified
// HTML tag with a null string.
return str.replace(/(<([^>]+)>)/ig, '').replace(/[\r\n]+/gm, " ");;
}