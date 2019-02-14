// const { SHA256 } = require("crypto-js");


// const msg = "fuad tamton";
// const hash = SHA256(msg).toString()
// console.log("Message ", msg)
// console.log("Hash ", hash)




// const jwt = require('jsonwebtoken');
// const data = {
//     id: 10
// }
// console.log(data)

// const en = jwt.sign(data, 'fuadtamton')
// console.log(en)

// const de = jwt.verify(en, 'fuadtamton')

// console.log(de)




const bcrypt = require('bcryptjs');

const password = "123abc!";

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash)
//     })
// })

const hashpass = '$2a$10$OVPuFJ7T6W2eMCiSySOYD.xkkUjgHOAR3Xv/fzWY7PFIKC6E8.INS';
bcrypt.compare(password, hashpass, (err, res) => {
    console.log(res)
})