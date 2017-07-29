require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

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
        return res.status(404).send();
    }

    // findById
    Todo.findById(id).then( todo => {
        if(!todo){
            res.status(404).send()
        }
        res.send({todo});

    }).catch( e => { res.status(400).send() })

});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    // validate the id -> not valid? return 404
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then( todo => {
        if(!todo){
            return res.status(404).send()
        }

        res.send({todo});
    }).catch(e => { res.status(400).send()});

});

// Update todo items
app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    // pick takes an object
    // Takes an array of properties you want to pull off.
    const body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
                                            // returns the new, updated object
                                            // with the option.
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if(!todo){
            return res.status(404).send();
        }

        res.send(todo)
    }).catch(e => {
        res.status(400).send();
    });

});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    // create new instance of the user model
    const user = new User(body);

    // save the doc to the database
    // Set up authentication here
    user.save()
        .then( () => {
            return user.generateAuthToken();
        })
        .then((token) => {
            // Prefixing a header with 'x-' means its a custom header.
            res.header('x-auth', token).send(user);
        })
        .catch(e => {
            res.status(400).send(e);
        });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}; // export for testing