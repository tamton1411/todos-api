const { ObjectID } = require('mongodb');
const { Todo } = require('../../models/Todo');
const { User } = require('../../models/User');
const jwt = require('jsonwebtoken');

const user1id = new ObjectID();
const user2id = new ObjectID();
const users = [{
    _id: user1id,
    email: 'fuad@gmail.com',
    password: 'userpsasw',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: user1id, access: 'auth', }, 'abc123').toString()
    }]
},
{
    _id: user2id,
    email: 'fuadtamton@gmail.com',
    password: 'userpsdsfasw',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: user2id, access: 'auth', }, 'abc123').toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: "Test todo1",
    _creator: user1id
}, {
    _id: new ObjectID(),
    text: "test todo2",
    _creator: user2id,
    completed: true,
    completedAt: 123456
}]



const populateTodos = (done) => {
    Todo.remove().then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save()
        var user2 = new User(users[1]).save()

        return Promise.all([user1, user2])
    }).then(() => done());
}

module.exports = { populateTodos, todos, users, populateUsers }