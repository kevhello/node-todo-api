require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    console.log(req.body); // the body is stored by body parser

    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });

    todo.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    })
});

// Get all todos!
app.get('/todos', authenticate, (req, res) => {
    // Get everything w/o authentication
    Todo.find({
        _creator: req.user._id,
    }).then((todos) => {
        // Send back an object in-case we want to send additional properties
        // in the future
        res.send({todos})
    }, e => {
        res.status(400).send(e);
    })
});

// GET /todos/1234324
app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    // Validate id using ObjectID.isValid(id)
    if(!ObjectID.isValid(id)){
        // 404 - send back empty send
        return res.status(404).send();
    }

    // findById
    Todo.findOne({
        _id: id,
        _creator: req.user._id,
    }).then( todo => {
        if(!todo){
            res.status(404).send()
        }
        res.send({todo});

    }).catch( e => { res.status(400).send() })

});

app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    // validate the id -> not valid? return 404
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id,
        });

        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    } catch(e) {
        res.status(400).send();
    }
    // Todo.findOneAndRemove({
    //     _id: id,
    //     _creator: req.user._id
    // }).then( todo => {
    //     if(!todo){
    //         return res.status(404).send()
    //     }
    //
    //     res.send({todo});
    // }).catch(e => { res.status(400).send()});

});

// Update todo items
app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({_id: id, _creator: req.user.id}, {$set: body}, {new: true}).then(todo => {
        if(!todo){
            return res.status(404).send();
        }

        res.send(todo)
    }).catch(e => {
        res.status(400).send();
    });

});

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
    // user.save()
    //     .then( () => {
    //         return user.generateAuthToken();
    //     })
    //     .then((token) => {
    //         // Prefixing a header with 'x-' means its a custom header.
    //         res.header('x-auth', token).send(user);
    //     })
    //     .catch(e => {
    //         res.status(400).send(e);
    //     });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e){
        res.status(400).send();
    }

    // User.findByCredentials(body.email, body.password).then( user => {
    //     return user.generateAuthToken().then(token => {
    //         res.header('x-auth', token).send(user);
    //     });
    // }).catch(e => {
    //     res.status(400).send();
    // });
});

app.delete('/users/me/token', authenticate, async (req, res) => {

    try{
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
    // req.user.removeToken(req.token).then(() => {
    //     res.status(200).send();
    // }, () => {
    //     res.status(400).send();
    // });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}; // export for testing