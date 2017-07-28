// The MongoClient lets you connect to a mongo server and issue commands
// to manipulate the database.

const { MongoClient, ObjectID } = require('mongodb');


// Connect to the database.
// 1st arg (string): the url where your database lives.
// 2nd arg (callback): Runs after the connection has either succeeded or failed.
//       The callback is passed two args: the error and the db object to be used
//       to read/write data.
// URL format: <mongodb_protocol><url><port>/<database>
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // insertOne takes two args:
    // 1. The object to insert
    // 2. The callback which is given two args: error and the result
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (error, result) => {
    //     if(err) {
    //         return console.log('Unable to insert Todo', err);
    //     }
    //     // ops stores all of the docs that were inserted
    //     // Note: results.ops is an array of all the documents that got inserted
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // });

    db.collection('Users').insertOne({
        name: 'KEV',
        age: 24,
        location: 'Cali'
    }).then( result => {
        // Note: results.ops is an array of all the documents that got inserted
        console.log(JSON.stringify(result.ops, undefined, 2));

        console.log(result.ops[0]._id.getTimestamp());
    }).catch(err =>
        console.log('Unable to insert User', err)
    );

    db.close(); // closes connection w/ MongoDB server.
});