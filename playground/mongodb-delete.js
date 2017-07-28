const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // deleteMany
    db.collection('Todos').deleteMany({text: 'Eat lunch'})
        .then( result => {
            console.log(result);
        })
        .catch( err => {
            console.log(err)
        });

    // deleteOne - deletes the first one it sees and stops
    db.collection('Todos').deleteOne({text: 'Eat lunch'})
        .then( result => {
            console.log(result);
        })
        .catch( err => {
            console.log(err)
        });

    // findOneAndDelete - it gets the document back as well as delete it
    db.collection('Todos').findOneAndDelete({completed: false})
        .then(result => {
            console.log(result);
        })

});