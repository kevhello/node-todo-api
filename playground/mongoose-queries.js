const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const  id = '697ac9306d87f742144edda4';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}

// get an array of docs
Todo.find({
    _id: id, // mongoose will take the string and convert to ObjectID
}).then((todos) => {
    console.log('Todos', todos);
});

// get a single document
Todo.findOne({
    _id: id, // mongoose will take the string and convert to ObjectID
}).then((todo) => {
    if(!todo){
        return console.log('Id not found')
    }
    console.log('Todos', todo);
});

// Find a document by its _id
Todo.findById(id)
    .then((todo) => {
    if(!todo){
        return console.log('Id not found')
    }
    console.log('Todo by Id', todo);
}).catch( e => console.log(e));

User.findById('597aadea4086c7385843fdb2').then(user => {
    if(!user){
        return console.log('Unable to find user');
    }

    console.log(JSON.stringify(user, undefined, 2));
}, e => {
    console.log(e)
});