// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server")
    }
    console.log("Successfully connected to MongoDB server")
    db.collection('Todos').insertOne({
        text: 'something to dos',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log("Unable to insert todos", err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    // db.collection('Users').insertOne({
    //     name: 'fuad',
    //     age: 21,
    //     location: 'kannur kerala'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log("Unable to insert users")
    //     }
    //     console.log(res.ops[0]._id.getTimestamp())
    //     console.log(JSON.stringify(res.ops, undefined, 2))
    // })

    db.close();
})
