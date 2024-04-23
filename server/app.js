import express from 'express'
import path from 'path'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cors from 'cors'
import pdfkit from 'pdfkit'
import fs from 'fs'
import PDFTable from 'pdfkit-table'

const app = express()
const currentDirectory = process.cwd()

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
                res.send({
                    status: 'Success',
                    doctorId: _doctorId
                })
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

app.get("/searchpatientcomplaints/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const response = await db.query(`select * from patientComplaint where patientId = ?`, [patientId])
        res.send(response[0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.get("/searcheyeexamination/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const response = await db.query(`select * from examination where patientId = ?`, [patientId])
        res.send(response[0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.get("/searchpatient/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const response = await db.query(`select * from patient where patientId = ?`, [patientId])
        res.send(response[0])
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

app.get("/admin/viewappointmentdetails/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const patientRes = await db.query(`select patientFirstName, patientLastName, phoneNumber, patient_image from patient where patientId = ?`, [patientId])
        const surgeryRes = await db.query(`select * from surgery where patientId = ?`, [patientId])
        if (patientRes[0][0] && surgeryRes[0][0]) {
            const appointmentDetails = {
                patientFirstname: patientRes[0][0].patientFirstName,
                patientLastname: patientRes[0][0].patientLastName,
                patientContactNo: patientRes[0][0].phoneNumber,
                patientImage: patientRes[0][0].patient_image,
                surgeryDate: surgeryRes[0][0].surgeryDate,
                surgeryTime: surgeryRes[0][0].surgeryTime,
                description: surgeryRes[0][0].description
            }
            res.send(appointmentDetails)
        } else {
            res.status(404).send({
                error: "Patient appointment details not found"
            });
        }
    } catch (error) {
        console.log(error)
    }
})

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // January is 0
    const year = date.getFullYear();

    // Pad day and month with leading zeros if necessary
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${year}`;
}

app.get('/admin/generatereport/:patientId', async (req, res) => {
    const patientId = req.params.patientId
    try {
        const patientRes = await db.query(`select * from patient where patientId = ?`, [patientId])
        const examRes = await db.query(`select * from examination where patientId = ?`, [patientId])
        const compRes = await db.query(`select * from patientComplaint where patientId = ?`, [patientId])
        const surgeryRes = await db.query(`select * from surgery where patientId = ?`, [patientId])
        const reportDetails = {
            patientId: patientId,
            patientFirstname: patientRes[0][0].patientFirstname,
            patientLastname: patientRes[0][0].patientLastname,
            patientDOB: formatDate(patientRes[0][0].dateOfBirth),
            patientGender: patientRes[0][0].gender,
            patientImage: patientRes[0][0].patient_image,
            patientContactNo: patientRes[0][0].phoneNumber,
            examId: examRes[0][0].examId,
            examDate: formatDate(examRes[0][0].examDate),
            examTime: examRes[0][0].examTime,
            rightLids: examRes[0][0].rightLids,
            rightConjuitive: examRes[0][0].rightConjuitive,
            rightAC: examRes[0][0].rightAC,
            rightIris: examRes[0][0].rightIris,
            rightVitereous: examRes[0][0].rightVitereous,
            rightCornea: examRes[0][0].rightCornea,
            rightRetina: examRes[0][0].rightRetina,
            leftLids: examRes[0][0].leftLids,
            leftConjuitive: examRes[0][0].leftConjuitive,
            leftAC: examRes[0][0].leftAC,
            leftIris: examRes[0][0].leftIris,
            leftVitereous: examRes[0][0].leftVitereous,
            leftCornea: examRes[0][0].leftCornea,
            leftRetina: examRes[0][0].leftRetina,
            allergies: compRes[0][0].allergies,
            medicalHistory: compRes[0][0].medicalHistory,
            rightEyeImage: compRes[0][0].rightEyeImage,
            leftEyeImage: compRes[0][0].leftEyeImage,
            surgeryId: surgeryRes[0][0].surgeryId,
            surgeryDate: formatDate(surgeryRes[0][0].surgeryDate),
            surgeryTime: surgeryRes[0][0].surgeryTime,
            surgeryDoctor: surgeryRes[0][0].doctorId,
            surgeryLens: surgeryRes[0][0].lensId,
            description: surgeryRes[0][0].description
        }
        // res.send(reportDetails)

        const margin = 28.35
        const padding = -5

        const contentX = margin + padding
        const contentY = margin + padding

        const report = new pdfkit({
            info: {
                Title: 'Medical Report'
            },
            margin: margin,
            size: 'A4'
        })

        const contentWidth = report.page.width - 2 * (margin + padding)
        const contentHeight = report.page.height - 2 * (margin + padding)

        report.rect(contentX, contentY, contentWidth, contentHeight)
            .lineWidth(1)
            .stroke()

        report.restore()

        report.moveDown()
        report.fontSize(20);
        report.text('Medical Report', {
            align: 'center'
        }).moveDown()

        const leftColumnX = 50
        const rightColumnX = 300
        const columnY = report.y

        report.fontSize(14)
        report.text('Patient Details', leftColumnX, columnY)
        report.moveDown()

        report.fontSize(12).text(`Patient ID: ${reportDetails.patientId}`, leftColumnX, columnY + 30).moveDown()
        report.fontSize(12).text(`Patient Name: ${reportDetails.patientFirstname} ${reportDetails.patientLastname}`, leftColumnX, columnY + 50).moveDown()
        report.fontSize(12).text(`Date of Birth: ${reportDetails.patientDOB}`, leftColumnX, columnY + 70).moveDown()
        report.fontSize(12).text(`Gender: ${reportDetails.patientGender}`, leftColumnX, columnY + 90).moveDown()
        report.fontSize(12).text(`Phone Number: ${reportDetails.patientContactNo}`, leftColumnX, columnY + 110).moveDown()
        // report.fontSize(12).text(`Patient Image: ${reportDetails.patient_image}`).moveDown()

        const imageWidth = 100
        const imageHeight = 100
        const imageX = rightColumnX + (rightColumnX - imageWidth) / 2
        report.image('patientImageSample.jpeg', imageX, columnY + 15, {
            width: imageWidth,
            height: imageHeight
        })

        report.fontSize(14)
        report.text('Eye Exams Details', leftColumnX, columnY + 140)
        report.moveDown()

        report.font('Helvetica')

        const table = new PDFTable(report, {
            bottomMargin: 30
        })

        const tableData = [
            [{
                text: 'Name',
                style: 'tableHeader'
            }, {
                text: 'Age',
                style: 'tableHeader'
            }],
            ['John Doe', 30],
            ['Jane Smith', 25]
        ]

        table.addPlugin(new(require('pdfkit-table/plugin/fitcolumn'))({
            column: 'Age',
        }))

        table
            .setColumnsDefaults({
                headerBorder: ['T'],
                align: 'right'
            })
            .addTable(tableData)

        // report.table(table, {
        //     prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        //     prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        //         doc.font("Helvetica").fontSize(8)
        //         indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15)
        //     },
        // })

        // const rightEyeData = [
        //     ['Right Lids:', reportDetails.rightLids],
        //     ['Right Conjuitive:', reportDetails.rightConjuitive],
        //     ['Right AC:', reportDetails.rightAC],
        //     ['Right Iris:', reportDetails.rightIris],
        //     ['Right Vitereous:', reportDetails.rightVitereous],
        //     ['Right Cornea:', reportDetails.rightCornea],
        //     ['Right Retina:', reportDetails.rightRetina]
        // ]

        // const leftEyeData = [
        //     ['Left Lids:', reportDetails.leftLids],
        //     ['Left Conjuitive:', reportDetails.leftConjuitive],
        //     ['Left AC:', reportDetails.leftAC],
        //     ['Left Iris:', reportDetails.leftIris],
        //     ['Left Vitereous:', reportDetails.leftVitereous],
        //     ['Left Cornea:', reportDetails.leftCornea],
        //     ['Left Retina:', reportDetails.leftRetina]
        // ]

        // report.table(
        //     [['Right Eye Diagnosis']],
        //     rightEyeData,
        //     {
        //         prepareHeader: () => report.font('Helvetica-Bold').fontSize(12),
        //         prepareRow: (row, i) => report.font('Helvetica').fontSize(12),
        //         align: 'center'
        //     }
        // )

        // report.fontSize(12).text(`Eye Exam ID: ${reportDetails.examId}`, leftColumnX, columnY + 170).moveDown()
        // report.fontSize(12).text(`Conducted Date: ${reportDetails.examDate}`, leftColumnX, columnY + 190).moveDown()
        // report.fontSize(12).text(`Conducted Time: ${reportDetails.examTime}`, rightColumnX, columnY + 190).moveDown()
        // report.fontSize(12).text(`Right Lids: ${reportDetails.rightLids}`).moveDown()
        // report.fontSize(12).text(`Right Conjuitive: ${reportDetails.rightConjuitive}`).moveDown()
        // report.fontSize(12).text(`Right AC: ${reportDetails.rightAC}`).moveDown()
        // report.fontSize(12).text(`Right Iris: ${reportDetails.rightIris}`).moveDown()
        // report.fontSize(12).text(`Right Vitereous: ${reportDetails.rightVitereous}`).moveDown()
        // report.fontSize(12).text(`Right Cornea: ${reportDetails.rightCornea}`).moveDown()
        // report.fontSize(12).text(`Right Retina: ${reportDetails.rightRetina}`).moveDown()
        // // report.fontSize(12).text(`Patient Image: ${reportDetails.rightEyeImage}`).moveDown()

        // report.fontSize(12).text(`Left Lids: ${reportDetails.leftLids}`).moveDown()
        // report.fontSize(12).text(`Left Conjuitive: ${reportDetails.leftConjuitive}`).moveDown()
        // report.fontSize(12).text(`Left AC: ${reportDetails.leftAC}`).moveDown()
        // report.fontSize(12).text(`Left Iris: ${reportDetails.leftIris}`).moveDown()
        // report.fontSize(12).text(`Left Vitereous: ${reportDetails.leftVitereous}`).moveDown()
        // report.fontSize(12).text(`Left Cornea: ${reportDetails.leftCornea}`).moveDown()
        // report.fontSize(12).text(`Left Retina: ${reportDetails.leftRetina}`).moveDown()
        // // report.fontSize(12).text(`Patient Image: ${reportDetails.leftEyeImage}`).moveDown()

        report.fontSize(12).text(`Allergies: ${reportDetails.allergies}`).moveDown()
        report.fontSize(12).text(`Medical History: ${reportDetails.medicalHistory}`).moveDown()

        report.fontSize(14);
        report.text('Surgery Details', {})
        report.moveDown();
        report.fontSize(12).text(`Surgery Id: ${reportDetails.surgeryId}`).moveDown()
        report.fontSize(12).text(`Date: ${reportDetails.surgeryDate}`).moveDown()
        report.fontSize(12).text(`Time: ${reportDetails.surgeryTime}`).moveDown()
        report.fontSize(12).text(`Doctor Id: ${reportDetails.surgeryDoctor}`).moveDown()
        report.fontSize(12).text(`Lens Id: ${reportDetails.surgeryLens}`).moveDown()
        report.fontSize(12).text(`description: ${reportDetails.description}`).moveDown()

        const filePath = `patient_report_${patientId}.pdf`
        report.pipe(fs.createWriteStream(filePath))
        report.end()

        res.sendFile(filePath, {
            root: currentDirectory
        })

    } catch (error) {
        console.log(error)
    }
})

app.get("/viewpatients/:doctorId", async (req, res) => {
    const doctorId = req.params.doctorId
    try {
        const response = await db.query(`select * from patient where doctorInChargeId = ?`, [doctorId])
        res.send(response[0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.get("/admin/viewlens", async (req, res) => {
    try {
        const response = await db.query(`select * from lens`)
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
                rightLids, rightConjuitive, rightAC, rightIris, rightVitereous, rightCornea, rightRetina
            ]
        )
        res.send("Successfully added eye examination details")
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.get("/admin/viewexamdetails/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const response = await db.query(`select * from examination where patientId = ?`, [patientId])
        res.send(response[0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})

app.get("/admin/viewexamId/:patientId", async (req, res) => {
    const patientId = req.params.patientId
    try {
        const response = await db.query(`select examId from examination where patientId = ?`, [patientId])
        res.send(response[0])
    } catch (error) {
        console.log(`${error.message}`)
    }
})


app.post("/addsurgery/:doctorId", async (req, res) => {
    const {
        patientId,
        surgeryDate,
        surgeryHours,
        surgeryMinutes,
        surgeryAMPM,
        lensId,
        description,
        docReport
    } = req.body

    const doctorId = req.params.doctorId

    const extractedPart = doctorId.split('.')[1]
    const surgeryId = `SG-${extractedPart}-${patientId}`

    const pending = true
    const nurseId = 'NR.00000'

    // date format modification
    const date = new Date(surgeryDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`

    // time format modification
    let hours = Number(surgeryHours);
    if (surgeryAMPM === "PM" && hours !== 12) {
        hours += 12;
    }
    if (surgeryAMPM === "AM" && hours === 12) {
        hours = 0;
    }
    const formattedTime = `${String(hours).padStart(2, "0")}:${surgeryMinutes}:00`;

    try {

        const examId = await db.query(`select examId from examination where patientId = ?`, [patientId])
        const compId = await db.query(`select patientComplaintId from patientComplaint where patientId = ?`, [patientId])

        const [newSurgery] = await db.query(`
        insert into surgery (
            surgeryId,
            surgeryDate,
            surgeryTime,
            pending,
            patientId,
            examId,
            compId, 
            nurseId,
            lensId,
            doctorId,
            description,
            docReport
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            surgeryId, formattedDate, formattedTime, pending, patientId, examId[0][0].examId, compId[0][0].patientComplaintId, nurseId, lensId, doctorId, description, docReport
        ])

        res.send("Successfully inserted the surgery record")

    } catch (error) {
        console.error(error)
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