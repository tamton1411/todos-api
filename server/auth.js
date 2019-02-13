const { mongoose } = require('./db/mongoose');
const { User } = require('./models/User')
const newUser = new User({
    email: 'fuadtamon@gmail.com ',
})

newUser.save()
    .then(res => {
        console.log(JSON.stringify(res, undefined, 2))
    })
    .catch(err => {
        console.log("Error ", err)
    })