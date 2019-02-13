const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb')

const { app } = require('../server');
const { Todo } = require('../models/Todo')


const todos = [{
    _id: new ObjectID(),
    text: "Test todo1"
}, {
    _id: new ObjectID(),
    text: "test todo2"
}]
beforeEach(done => {
    Todo.remove().then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
})

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