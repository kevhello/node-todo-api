const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    // User with valid authentication token
    _id: userOneId,
    email: 'kev@example.com',
    password: 'userOneWord',
    tokens: [ {
        access: 'auth',
        token: jwt.sign({_id : userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    // User w/o any authentication token
    _id: userTwoId,
    email: 'kevo@example.com',
    password: ' userTwoPass',
    tokens: [ {
        access: 'auth',
        token: jwt.sign({_id : userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo',
        _creator: userOneId,
    },
    {
        _id: new ObjectID(),
        text: 'Second text todo',
        completed: true,
        completedAt: 333,
        _creator: userTwoId,
    }
];

const populateTodos = (done) => {
    // Wipe all todos before running the tests
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());

};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};