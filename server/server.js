const _app = require('./app.js')
const {getDoctor, login, register, searchPatient, addLens, viewappointmentdetails} = require('./database.js')
const express = require('express')

const database = {
    getDoctor, login, register, searchPatient, addLens, viewappointmentdetails
}

const app = _app(database)

app.listen(8080, () => {
    console.log(`Server is running on port 8080`)
})