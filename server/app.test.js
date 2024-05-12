const request = require('supertest')
const _app = require('./app.js')
const bcrypt = require('bcrypt')

const {
    jest,
    describe,
    beforeEach,
    expect
} = require('@jest/globals')

const getDoctor = jest.fn()
const login = jest.fn()
const register = jest.fn()
const searchPatient = jest.fn()
const addLens = jest.fn()
const viewappointmentdetails = jest.fn()

const db = require('./database.js')

const app = _app({
    getDoctor,
    login,
    register,
    searchPatient,
    addLens,
    viewappointmentdetails
})

describe("GET /getDoctor", () => {
    beforeEach(() => {
        getDoctor.mockReset()
        getDoctor.mockResolvedValue(0)
    })

    describe("given a doctorId", () => {
        test("should retrieve the doctor details", async () => {
            const doctorId = 'MBBS.00003'
            getDoctor.mockReset()
            await request(app).get('/getDoctor').send(doctorId)
            expect(getDoctor.mock.calls.length).toBe(1)
            expect(getDoctor.mock.calls[0][0]).toBe(doctorId)
        })
    })
})

describe("POST /login", () => {
    beforeEach(() => {
        login.mockReset()
        login.mockResolvedValue(0)
    })

    describe("given a doctorId and a password", () => {
        test("should respond with a string", async () => {
            const bodyData = [{
                    username: "username1",
                    password: "password1"
                },
                {
                    username: "username2",
                    password: "password2"
                },
                {
                    username: "username3",
                    password: "password3"
                },
            ]
            for (const body of bodyData) {
                login.mockReset()
                await request(app).post("/login").send(body)
                expect(login.mock.calls.length).toBe(1)

                login.mockResolvedValueOnce('Success')
                const response = await request(app).post("/login").send(body)
                expect(response.text).toBe('Success')
            }
        })
    })
})

describe("POST /register", () => {
    beforeEach(() => {
        register.mockReset()
        register.mockResolvedValue(0)
    })

    describe("given a doctor credentials", () => {
        test("should register a new doctor and return success message", async () => {
            const testData = {
                doctorId: 'MBBS.12345',
                doctorFirstname: 'John',
                doctorLastname: 'Doe',
                doctorPassword: '$2a$10$1ehYoCoRGLvwDPBjUFLB/OgXZi3W7B/M9Fh5syziLsBfZPcY1VLV2'
            }

            register.mockReset()
            await request(app).post("/register").send(testData)
            expect(register.mock.calls.length).toBe(1)

            register.mockResolvedValueOnce('Doctor added successfully')
            const response = await request(app).post("/register").send(testData)
            expect(JSON.parse(response.text).message).toBe('Doctor added successfully')
        })
    })
})

