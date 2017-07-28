const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} =  require('../server/models/user');

// Todo.remove deletes multiple records
Todo.remove({}).then(result => {
    // Also tells you how many were removed
    console.log(result);
});

// Will return the document
Todo.findOneAndRemove({_id: '597b05cb6afec505641ddcd5'}).then(todo => {
    console.log(todo);
});

Todo.findByIdAndRemove('597b05cb6afec505641ddcd5').then(todo => {
    console.log(todo);
});