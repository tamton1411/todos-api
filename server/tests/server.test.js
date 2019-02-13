const request = require('supertest');
const expect = require('expect');

const { app } = require('../server');
const { Todo } = require('../models/Todo')

beforeEach(done => {
    Todo.deleteMany({}).then(() => done());
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

                Todo.find().then(todos => {
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
            .expect(res => {
                expect(res.body.text).toBe(undefined)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find().then(todos => {
                    expect(todos.length).toBe(0)
                    done()
                }).catch(e => done(e))
            })
    })
})