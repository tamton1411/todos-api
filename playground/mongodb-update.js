const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to mongodb server")
    }
    console.log("connected to mongodb")

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c628d133c39de5bfb4a222a')
    // }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     }).then(res => {
    //         console.log(JSON.stringify(res, undefined, 2))
    //     })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c6276c1df6a6a589d81e17e')
    }, {
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then(res => {
            console.log(JSON.stringify(res, undefined, 2))
        })

    db.close()
})