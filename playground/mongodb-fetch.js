const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to mongodb server")
    }
    console.log("connected to mongodb")
    db.collection('Todos').find(
        // {
        //     _id: ObjectID('5c62885687d9535b1aa82511')
        // }
    ).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log("Unable to fetch data")
    })

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count : ${count}`)
    // }, (err) => {
    //     console.log("Unable to fetch data")
    // })

    db.close()
})