// const { SHA256 } = require("crypto-js");

// const msg = "fuad tamton";
// const hash = SHA256(msg).toString()

// console.log("Message ", msg)
// console.log("Hash ", hash)

const jwt = require('jsonwebtoken');

const data = {
    id: 10
}

console.log(data)

const en = jwt.sign(data, 'fuadtamton')
console.log(en)

const de = jwt.verify(en, 'fuadtamton')

console.log(de)