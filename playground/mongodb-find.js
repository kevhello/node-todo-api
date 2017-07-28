const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // find() returns a MongoDB cursor (a pointer to those documents)
    // A cursor has methods.
    // find() accepts a query object as an argument.
    db.collection('Todos').find({
        _id: new ObjectID('5979d47f99d6831b140b6776')
    }).toArray().then(docs => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch(err => {
        console.log('Unable to fetch todos', err);
    });

    db.close();
});