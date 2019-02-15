const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb')

const { app } = require('../server');
const { Todo } = require('../models/Todo')
const { User } = require('../models/User')
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
describe("POST /todos", () => {
    it("Should create a new todo", (done) => {
        const text = "Test todo text";

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({ text }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch(err => done(err))
            })
    })
    it("Should not create todo ", (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find().then(todos => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch(e => done(e))
            })
    })
})

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe("GET /todos:id", () => {
    it("Should get todo of the id", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })
    it("Should return 404 error if todo not found", (done) => {
        const hexid = new ObjectID().toHexString;
        request(app)
            .get(`/todos/${hexid}`)
            .expect(404)
            .end(done)
    })
    it("should return 404 for non-object ids", (done) => {
        request(app)
            .get('/todos/123asd')
            .expect(404)
            .end(done)
    })
})

describe("DELETE todo/:id ", () => {
    const id = todos[0]._id.toHexString()
    it("Should delete todo by id ", (done) => {
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id).then(todo => {
                    expect(todo).toBe(null);
                    done();
                }).catch(e => done(e))
            })
    })
    it("should return 404 if todo not found", (done) => {
        request(app)
            .delete(`/todo/${id}`)
            .expect(404)
            .end(done)
    })
    it("should return 404 if object id is invalid", (done) => {
        request(app)
            .delete(`/todo/132zcs`)
            .expect(404)
            .end(done)
    })
})

describe("PATH /todos/:id", () => {
    it("should update the todo", done => {
        const hexid = todos[0]._id.toHexString();
        const text = "this is new text";
        request(app)
            .patch(`/todos/${hexid}`)
            .send({
                completed: true,
                text: text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true)
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done)
    })
    it("Should clear completedAt when todo is not completed", (done) => {
        const hexid = todos[1]._id.toHexString();
        const text = "this is text 2";
        request(app)
            .patch(`/todos/${hexid}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo._id).toBe(hexid);
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done)
    })
})

describe("GET users/me", () => {
    it("Should return user if authenticated", (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
            })
            .end(done)
    })
    it("Should return 401 if not authenticated ", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe("POST /users", () => {
    it("Should create a user", done => {
        const email = "fuadtamtonn@gmail.com";
        const password = "somethinundefined"
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(email)
                expect(res.header['x-auth']).toBeTruthy()
                expect(res.body._id).toBeTruthy()
            })
            .end(err => {
                if (err) {
                    return done(err)
                }
                User.findOne({ email }).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password).toNotBe(password)
                })
                done()
            })

    })
    it("should return validation error if request invalid", done => {
        request(app)
            .post('/users')
            .send({
                email: "fff",
                password: "dfsdfsdf"
            })
            .expect(400)
            .end(done)
    })
    it("Should not create user if email in use", done => {
        const password = "somethinundefined"
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password
            })
            .expect(400)
            .end(done)
    })
})

describe("POST users/login", () => {
    it("should login user and return auth token ", (done) => {
        const email = 'fuad@gmail.com';
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect(user => {
                expect(user.header['x-auth']).toBeTruthy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.header['x-auth']
                    })
                    done()
                }).catch(e => done())
            })

    })
    it("Should reject invalid login", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: "fuadtamton@gmail.com",
                password: 'userpsasw'
            })
            .expect(400)
            .expect(user => {
                expect(user.header['x-auth']).toBeFalsy()
            })
            .end(done)
    })

})

describe("DELETE /users/me/token", () => {
    it("should remove auth token on logout", (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch(err => done(err))
            })
    })
})