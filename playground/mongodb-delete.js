const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to mongodb server")
    }
    console.log("connected to mongodb")

    // deleteMany -- delete all from result
    // db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then(res => {
    //     console.log(JSON.stringify((res, undefined, 2))
    // })

    // deleteOne -- delete first one of result
    // db.collection('Todos').deleteOne({ text: 'something to dos' }).then(res => {
    //     console.log(JSON.stringify(res, undefined, 2))
    // })

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({ _id: new ObjectID('5c626ee92b578c574b25209c') }).then(res => {
        console.log(JSON.stringify(res, undefined, 2))
    })

    db.close()
})