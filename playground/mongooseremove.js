const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/Todo');
const { User } = require('../server/models/User')


Todo.findByIdAndRemove('5c63de382c801b32be3b8731')
    .then(res => {
        console.log(res)
    })