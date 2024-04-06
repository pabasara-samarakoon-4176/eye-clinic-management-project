import express from 'express'
import path from 'path'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cors from 'cors'

import multer from 'multer';



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

app.get("/viewmanu/:manuId", async (req, res) => {
    const manuId = req.params.manuId
    try {
        const [manu] = await db.query("select manuName from manufacturer where manuId = ?", [manuId])
        res.send(manu[0])
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

app.post("/admin/addmanufacturer", async (req, res) => {
    const {
        manuId,
        manuName,
        address,
        contactNo,
        country,
        adminApproval
    } = req.body
    try {
        await db.query(`insert into manufacturer (manuId, manuName, address, contactNo, country, adminApproval)
        values (?, ?, ?, ?, ?, ?)`, [manuId, manuName, address, contactNo, country, adminApproval])
        res.send('Success')
    } catch (error) {
        res.send(error)
    }
})

app.delete("/admin/deletemanufacturer", async (req, res) => {
    const {
        manuId
    } = req.body
    try {
        await db.query(`delete from manufacturer where manuId = ?`, [manuId])
        res.send('deleted')
    } catch (error) {
        res.send(error)
    }
})

app.get("/getManufacturer/:manuId", async (req, res) => {
    const manuId = req.params.manuId
    try {
        const [response] = await db.query(`select * from manufacturer where manuId = ?`, [manuId])
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

app.get("/searchlens/:lensId", async (req, res) => {
    const lensId = req.params.lensId
    try {
        const [response] = await db.query(`select * from lens where lensId = ?`, [lensId])
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

app.get("/admin/viewmanufacturers", async (req, res) => {
    try {
        const response = await db.query(`select * from manufacturer`)
        res.send(response[0])
    } catch (error) {
        res.send(error)
    }
})

app.get("/searchclinicdetails/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const response = await db.query(`select * from clinic where patientId = ?`, [patientId])
        res.send(response[0][0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.post("/addlens/:nurseId/addmanufacturer", async (req, res) => {

    const nurseId = req.params.nurseId;
    const [stkMgr] = await db.query("select * from nurse where nurseId = ?", [nurseId]);
    const [adminKey] = await db.query(`select adminKey from admin`)

    const {
        manuId,
        manuName,
        address,
        contactNo,
        country,
        _adminKey
    } = req.body
    try {
        if (stkMgr[0].stockMgr.toString() === '1') {

            if (adminKey[0].adminKey.toString() === _adminKey.toString()) {

                const adminApproval = 1
                await db.query(`insert into manufacturer (manuId, manuName, address, contactNo, country, adminApproval)
                values (?, ?, ?, ?, ?, ?)`, [manuId, manuName, address, contactNo, country, adminApproval])

            } else {
                res.send("not allowed")
            }
        } else {
            res.send("not active")
        }

    } catch (error) {
        res.send(error)
    }
})

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
            const year = Number(formattedManufactureDate.split("-")[0]).toString()
            const serialNo = (batchNo.split("-")[1]).toString()
            const lensId = `${manufacturerId}-${year}-${serialNo}`;
            const [newLens] = await db.query(`
            INSERT INTO lens (lensId, lensType, surgeryType, model, lensPower, placementLocation, expiryDate, batchNo, remarks, adminId, stockMgrNurse, manufactureDate, manufacturerId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [lensId, lensType, surgeryType, model, lensPower, placementLocation, formattedExpiryDate, batchNo, remarks, adminId, nurseId, formattedManufactureDate, manufacturerId])
            console.log("Successfully added lens")
            res.send("active")
        } else {
            res.send("not active")
        }
    } catch (error) {
        console.error(error)
        res.send(error)
    }
})

app.post("/addpatient/:doctorId", async (req, res) => {
    const {
        patientFirstname,
        patientLastname,
        patientGender,
        patientDOB,
        patientIdNIC,
        patientPhoneNumber,
        patientAddress,
        patientDescription,
        patientImagePath
        
    } = req.body

    const date = new Date(patientDOB);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const doctorInChargeId = req.params.doctorId
    const admittedNurse = 'NR.00000'

    try {
        const [newPatient] = await db.query(`
        insert into patient (patientId, patientFirstname, patientLastname, dateOfBirth, gender, address, phoneNumber, admittedNurse, patientDescription, doctorInChargeId, patient_image)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [patientIdNIC, patientFirstname, patientLastname, formattedDate, patientGender, patientAddress, patientPhoneNumber, admittedNurse, patientDescription, doctorInChargeId, patientImagePath])
        
        res.send("Successfully inserted patient")
    } catch (error) {
        console.log(`${error.message}`)
    }
})



app.post("/addclinic/:doctorId", async (req, res) => {
    const {
        clinicDate,
        clinicHours,
        clinicMinutes,
        clinicAMPM,
        clinicConsultantId,
        patientId
    } = req.body

    try {
        // date format modification
        const date = new Date(clinicDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        // doctorId serial number
        const extractedPart = clinicConsultantId.split('.')[1];

        // clinicId generation
        const clinicId = `CL-${extractedPart}-${patientId}`;

        // time format modification
        let hours = Number(clinicHours);
        if (clinicAMPM === "PM" && hours !== 12) {
            hours += 12;
        }
        if (clinicAMPM === "AM" && hours === 12) {
            hours = 0;
        }
        const formattedTime = `${String(hours).padStart(2, "0")}:${clinicMinutes}:00`;

        const [newClinic] = await db.query(`
        insert into clinic (clinicId, clinicDate, clinicTime, consultantId, patientId)
        values (?, ?, ?, ?, ?)
        `, [clinicId, formattedDate, formattedTime, clinicConsultantId, patientId])

        res.send("Successfully inserted clinic information for patient")
    } catch (error) {
        console.log(`${error.message}`)
        res.send(error)
    }
})

app.get("/admin/viewdoctors", async (req, res) => {
    try {
        const response = await db.query(`select * from doctor`)
        res.send(response[0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.post("/addexamdetails/:doctorId", async (req, res) => {
    const {
        examDate,
        examTime,
        patientId,
        // Right eye
        rightLids,
        rightConjuitive,
        rightAC,
        rightIris,
        rightVitereous,
        rightCornea,
        rightRetina,
        // left eye
        leftLids,
        leftConjuitive,
        leftAC,
        leftIris,
        leftVitereous,
        leftCornea,
        leftRetina
    } = req.body

    const doctorId = req.params.doctorId
    // examId generation
    const extractedPart = doctorId.split('.')[1]
    const examId = `EXM-${extractedPart}-${patientId}`

    try {
        const [newExamination] = await db.query(`
        insert into examination (
            examId, examDate, examTime, patientId, doctorId, leftLids, leftConjuitive, leftAC, leftIris, leftVitereous, leftCornea, leftRetina,
            rightLids, rightConjuitive, rightAC, rightIris, rightVitereous, rightCornea, rightRetina ) values (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [examId, examDate, examTime, patientId, doctorId, leftLids, leftConjuitive, leftAC, leftIris, leftVitereous, leftCornea, leftRetina,
            rightLids, rightConjuitive, rightAC, rightIris, rightVitereous, rightCornea, rightRetina]
        )
        res.send("Successfully added eye examination details")
    } catch (error) {
        console.log(error)
    }
})

app.post("/addpatientcomplaint/:doctorId", async (req, res) => {
    const {
        patientId,
        // Right eye
        rightPainBool,
        rightPain,
        rightDoubleVisionBool,
        rightDoubleVision,
        rightRedeyeBool,
        rightRedeye,
        rightPoorVisionBool,
        rightPoorVision,
        rightDescription,
        rightEyeImagePath,
        // Left eye
        leftPainBool,
        leftPain,
        leftDoubleVisionBool,
        leftDoubleVision,
        leftRedeyeBool,
        leftRedeye,
        leftPoorVisionBool,
        leftPoorVision,
        leftDescription,
        leftEyeImagePath,

        allergies,
        medicalHistory
    } = req.body

    const patientComplaintId = `PC-${patientId}`

    try {
        const [newPatientComplaint] = await db.query(`
        INSERT INTO patientComplaint (
            patientComplaintId,
            rightPainBool,
            rightDoubleVisionBool,
            rightRedeyeBool,
            rightPoorVisionBool,
            rightPain,
            rightDoubleVision,
            rightRedeye,
            rightPoorVision,
            rightDescription,
            rightEyeImage,
            leftPainBool,
            leftDoubleVisionBool,
            leftRedeyeBool,
            leftPoorVisionBool,
            leftPain,
            leftDoubleVision,
            leftRedeye,
            leftPoorVision,
            leftDescription,
            leftEyeImage,
            allergies,
            medicalHistory,
            patientId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [patientComplaintId, 
            rightPainBool, rightDoubleVisionBool, rightRedeyeBool, rightPoorVisionBool,
            rightPain, rightDoubleVision, rightRedeye, rightPoorVision, rightDescription, rightEyeImagePath,
            leftPainBool, leftDoubleVisionBool, leftRedeyeBool, leftPoorVisionBool,
            leftPain, leftDoubleVision, leftRedeye, leftPoorVision, leftDescription, leftEyeImagePath,
            allergies, medicalHistory, patientId
        ])
        res.send("Successfully created the patient comaplaint")
    } catch (error) {
        
        console.log(`${error.message}`)
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke')
})

app.listen(8080, () => {
    console.log(`Server is running on port 8080`)
})