const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second text todo'
    }
];

beforeEach((done) => {
    // Wipe all todos before running the tests
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())

});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        // Make POST request via supertest
        // Arg: the express app we want to make the request on.
        request(app)
            .post('/todos') // sets up a post request
            .send({text}) // Arg is converted to JSON by supertest
            .expect(200)
            .expect((res) => { // custom expect
                expect(res.body.text).toBe(text);
        })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err))
            });

    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });

    describe('GET /todos', () => {

        it('should get all todos', done => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect(res => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        })

    });

    describe('GET /todos/:id', () => {
        it('should return todo doc', done => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should return 404 if todo not found', done => {
            const hexId = new ObjectID().toHexString();
            request(app)
                .get(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .get('/todos/123abc')
                .expect(404)
                .end(done);
        });
    });

});