import express from 'express'
import path from 'path'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import {
    getNote,
    getNotes,
    createNote,
    updateNote,
    deleteNote
} from './database.js'
import { isModuleNamespaceObject } from 'util/types'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))
app.use(cookieParser())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhoomiii@2000',
    database: 'eye_clinic'
}).promise()

const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTc0OTk3MywiaWF0IjoxNzAxNzQ5OTczfQ.4udbW775eD-j9WqJBNzlmAeMx0C0QQEOaAeRgSyjc50'

app.get('/check', async (req, res) => {
    const doctorId = 'DOC00000'
    const [result] = await db.query("select * from doctor where doctorId = ?", [doctorId])
    res.send(result)
})

app.post("/login", async (req, res) => {
    // console.log(req.body)
    const { doctorId, password } = req.body;

    try {
        const [user] = await db.query("SELECT * FROM doctor WHERE doctorId = ?", [doctorId])
        // const [doctorPassword] = await db.query("select doctorPassword from doctor where doctorId = ?", [doctorId])
        const doctorPassword = user[0].doctorPassword

        if (password === doctorPassword) {
            res.send("Success")
        } else {
            res.send("Fail")
        }

        // console.log(doctorPassword)
        // console.log(password)

    } catch (error) {
        console.error(error);
        // Handle the error appropriately
        res.status(500).send('Internal Server Error');
    }
})

app.post("/register", async (req, res) => {
    // console.log(req.body)
    const { doctorId, doctorFirstname, doctorLastname, doctorPassword } = req.body;

    try {
        
        await db.query(`
        insert into doctor (doctorId, doctorFirstname, doctorLastname, doctorPassword)
        values (?, ?, ?, ?)
        `, [doctorId, doctorFirstname, doctorLastname, doctorPassword])
        const [newDoctor] = await db.query("select * from doctor where doctorId = ?", [doctorId])
        res.send(newDoctor)

    } catch (error) {
        console.error(error);
        
        res.status(500).send('Internal Server Error');
    }
})

app.get("/notes", async (req, res) => {
    const notes = await getNotes()
    res.send(notes)
})

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const note = await getNote(id)
    res.send(note)
})

app.post("/create", async (req, res) => {
    console.log(req.body)
    const {
        title,
        contents
    } = req.body
    const newNote = await createNote(title, contents)
    const notes = await getNotes()
    res.send(notes)
})

app.put('/notes/:id', async (req, res) => {
    const id = req.params.id
    const {title, contents} = req.body

    try {
        await updateNote(id, title, contents)
        const updatedNotes = await getNotes()
        res.json(updatedNotes)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
});

app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id
    try {
        await deleteNote(id)
        const updatedNote = await getNotes()
        res.send("deleted Successfully")
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke')
})

app.listen(8080, () => {
    console.log(`Server is running on port 8080`)
})