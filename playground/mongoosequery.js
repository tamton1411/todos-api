const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/Todo');
const { User } = require('../server/models/User')
const id = '5c63b787b41d5322b2351d29';

// Todo.find({ _id: id }).then(todos => {
//     console.log("Todos ", todos)
// })

// Todo.findOne({ _id: id })
//     .then(todo => {
//         console.log("Todo ", todo)
//     })

// Todo.findById(id)
//     .then(todo => {
//         console.log("Todo By Id ", todo)
//     })

User.findById('5c62bed86b9d3b6ac534d762')
    .then((user) => {
        if (!user) {
            console.log("Unable to find the user")
        }
        console.log(JSON.stringify(user, undefined, 2))
    }, e => {
        console.log(e)
    })