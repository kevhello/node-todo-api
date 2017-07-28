const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());



app.post('/todos', (req, res) => {
    console.log(req.body); // the body is stored by body parser

    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    })
});

// Get all todos!
app.get('/todos', (req, res) => {
    // Get everything w/o authentication
    Todo.find().then((todos) => {
        // Send back an object in-case we want to send additional properties
        // in the future
        res.send({todos})
    }, e => {
        res.status(400).send(e);
    })
});

// GET /todos/1234324
app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    // Validate id using ObjectID.isValid(id)
    if(!ObjectID.isValid(id)){
        // 404 - send back empty send
        res.status(404).send();
    }

    // findById
    Todo.findById(id).then( todo => {
        if(!todo){
            res.status(404).send()
        }
        res.send({todo});

    }).catch( e => { res.status(400).send() })

});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}; // export for testing