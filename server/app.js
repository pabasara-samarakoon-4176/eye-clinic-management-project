import express from 'express'
import path from 'path'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cors from 'cors'


import {
    isModuleNamespaceObject
} from 'util/types'

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhoomiii@2000',
    database: 'eye_clinic'
}).promise()

db.connect((err) => {
    if (err) {

        return console.error('Error connecting to database:', err)
    }
    console.log('Database connected successfully')
})

const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTc0OTk3MywiaWF0IjoxNzAxNzQ5OTczfQ.4udbW775eD-j9WqJBNzlmAeMx0C0QQEOaAeRgSyjc50'

app.get('/check', async (req, res) => {
    const doctorId = 'DOC00000'
    const [result] = await db.query("select * from doctor where doctorId = ?", [doctorId])
    res.send(result)
})

app.post("/login", async (req, res) => {

    const {
        doctorId,
        password
    } = req.body;

    try {
        const [user] = await db.query("SELECT * FROM doctor WHERE doctorId = ?", [doctorId])
        // const [doctorPassword] = await db.query("select doctorPassword from doctor where doctorId = ?", [doctorId])
        const _doctorPasswordHashed = user[0].doctorPassword
        const _doctorId = user[0].doctorId

        if (doctorId === _doctorId) {
            if (await bcrypt.compare(password, _doctorPasswordHashed)) {
                res.send("Success")
            } else {
                res.send("Fail")
            }
        } else {
            res.send("Fail")
        }



    } catch (error) {
        console.error(error);
        // Handle the error appropriately
        res.status(500).send('Internal Server Error');
    }
})

app.post("/register", async (req, res) => {
    // console.log(req.body)
    const {
        doctorId,
        doctorFirstname,
        doctorLastname,
        doctorPassword
    } = req.body;

    const adminId = 'MBBS.12345';

    try {

        const hashedPassword = await bcrypt.hash(req.body.doctorPassword, 10)

        await db.query(`
        insert into doctor (doctorId, doctorFirstname, doctorLastname, doctorPassword, adminId)
        values (?, ?, ?, ?, ?)
        `, [doctorId, doctorFirstname, doctorLastname, hashedPassword, adminId])
        const [newDoctor] = await db.query("select * from doctor where doctorId = ?", [doctorId])
        res.send(newDoctor)

    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
})

app.get("/viewlens/:nurseId", async (req, res) => {
    try {
        const [stock] = await db.query("select * from lens")
        res.send(stock)
    } catch (error) {

        res.send(error)
    }
})

app.delete("/removelens/:nurseId", async (req, res) => {
    const {
        lensId
    } = req.body
    const nurseId = req.params.nurseId;
    const [stkMgr] = await db.query("select * from nurse where nurseId = ?", [nurseId]);
    try {
        if (stkMgr[0].stockMgr.toString() === '1') {

            await db.query(`delete from lens where lensId = ?`, [lensId])
            res.send("deleted")
        } else {
            res.send("not allowed")
        }
    } catch (error) {
        console.error(error)
        res.send(error)
    }
})

function dateConverter(dateString) {
    
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

app.post("/addlens/:nurseId", async (req, res) => {
    const {
        lensType,
        manufacturerId,
        surgeryType,
        model,
        lensPower,
        placementLocation,
        manufactureDate,
        expiryDate,
        batchNo,
        remarks
    } = req.body;

    try {

        const adminId = 'MBBS.12345';
        const nurseId = req.params.nurseId;
        const [stkMgr] = await db.query("select * from nurse where nurseId = ?", [nurseId]);
        const formattedExpiryDate = dateConverter(expiryDate)
        const formattedManufactureDate = dateConverter(manufactureDate)

        if (stkMgr[0].stockMgr.toString() === '1') {
            const manuId = manufacturerId.toString()
            const year = Number(formattedManufactureDate.split("-")[0]).toString()
            const serialNo = Number(batchNo.split("-")[1]).toString()
            const lensId = `${manuId}-${year}-${serialNo}`;
            const [newLens] = await db.query(`
            INSERT INTO lens (lensId, lensType, surgeryType, model, lensPower, placementLocation, expiryDate, batchNo, remarks, adminId, stockMgrNurse, manufactureDate, manufacturerId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [lensId, lensType, surgeryType, model, lensPower, placementLocation, formattedExpiryDate, batchNo, remarks, adminId, nurseId, formattedManufactureDate, manufacturerId])
            // dateConverter(expiryDate)
            res.send("active")
        } else {
            res.send("not active")
        }
    } catch (error) {
        console.error(error)
        res.send(error)
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke')
})

app.listen(8080, () => {
    console.log(`Server is running on port 8080`)
})