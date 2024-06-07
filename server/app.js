import express from 'express'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cors from 'cors'
import fs from 'fs'
import PDFDocument from 'pdfkit-table'
import multer from 'multer'

const app = express()
const currentDirectory = process.cwd()

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTc0OTk3MywiaWF0IjoxNzAxNzQ5OTczfQ.4udbW775eD-j9WqJBNzlmAeMx0C0QQEOaAeRgSyjc50'

const upload = multer({
    dest: 'uploads/'
})

const db = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise()

db.connect((err) => {
    if (err) {

        return console.error('Error connecting to database:', err)
    }
    console.log('Database connected successfully')
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.json({Error: "Not Authorized"})
    } else {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return res.json({Error: "Not Authorized"})
            } else {
                req.doctorId = decoded.doctorId
                next()
            }
        })
    }
}

app.get('/home/:doctorId', verifyUser, (req, res) => {
    try {
        if (req.params.doctorId !== req.doctorId) {
            return res.status(403).json({ Error: "Forbidden" })
        }
        return res.json({Status: "Success", doctorId: req.doctorId})
    } catch (error) {
        console.log(error)
    }
})

app.post('/logout', (req, res) => { 
    try {
        res.clearCookie('token')
        return res.json({ Status: "Success" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ Status: "Error", Error: error.message })
    }
})


app.post("/login", async (req, res) => {

    const {
        doctorId,
        password
    } = req.body;

    try {
        const [user] = await db.query("SELECT * FROM doctor WHERE doctorId = ?", [doctorId])
        const [doctorPassword] = await db.query("select doctorPassword from doctor where doctorId = ?", [doctorId])
        const _doctorPasswordHashed = user[0].doctorPassword
        const _doctorId = user[0].doctorId

        if (doctorId === _doctorId) {
            if (await bcrypt.compare(password, _doctorPasswordHashed)) {
                const token = jwt.sign({doctorId}, secretKey, {expiresIn: 60 * 60})
                res.cookie('token', token)
                res.send({
                    status: 'Success',
                    doctorId: _doctorId
                })
                // console.log(process.env.DATABASE)
            } else {
                res.send("Fail")
            }
        } else {
            res.send("Fail")
        }


    } catch (error) {
        if (error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'doctorPassword')")) {
            res.status(404).send("User not found");
        } else {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
})

app.get("/getadmin", async (req, res) => {
    try {
        const [admin] = await db.query(`select * from admin`)
        res.send([admin])
    } catch (error) {
        console.log(error)
    }
})

app.post("/register", async (req, res) => {
    const {
        doctorId,
        doctorFirstname,
        doctorLastname,
        doctorPassword
    } = req.body;

    const adminId = 'MBBS.00000';

    try {

        const hashedPassword = await bcrypt.hash(req.body.doctorPassword, 10)

        await db.query(`
        insert into doctor (doctorId, doctorFirstname, doctorLastname, doctorPassword, adminId)
        values (?, ?, ?, ?, ?)
        `, [doctorId, doctorFirstname, doctorLastname, hashedPassword, adminId])
        const [newDoctor] = await db.query("select * from doctor where doctorId = ?", [doctorId])
        res.status(200).json({
            message: "Doctor added successfully"
        })

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.json({
                message: "The doctor already exists"
            })
        } else {
            res.status(500).json({
                message: "An error occurred while adding the doctor"
            })
        }
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
    } = req.body
    try {
        await db.query(`insert into manufacturer (manuId, manuName)
        values (?, ?)`, [manuId, manuName])
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
        if (response.length === 0) {
            res.send("Lens not available");
        } else {
            res.send(response);
        }
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
        const patientComplaintDetails = response[0][0]
        const rightEyeImageData = response[0][0].rightEyeImage.toString('base64')
        const rightEyeImageBuffer = Buffer.from(rightEyeImageData, 'base64')
        const rightEyeImageFile = fs.writeFileSync('rightEyeImage.png', rightEyeImageBuffer)
        const leftEyeImageData = response[0][0].leftEyeImage.toString('base64')
        const leftEyeImageBuffer = Buffer.from(leftEyeImageData, 'base64')
        const leftEyeImageFile = fs.writeFileSync('leftEyeImage.png', leftEyeImageBuffer)
        const responseData = {
            patientComplaintDetails: patientComplaintDetails,
            rightImageBase64: rightEyeImageData,
            leftImageBase64: leftEyeImageData
        }
        res.send(responseData)
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
        const patientData = response[0][0]
        const patientImageData = response[0][0].patient_image.toString('base64')
        const patientImageBuffer = Buffer.from(patientImageData, 'base64')
        const patientImageFile = fs.writeFileSync('patientImage.png', patientImageBuffer)
        const responseData = {
            patient: patientData,
            imageBase64: patientImageData
        }
        res.send(responseData)
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
        manufactureDate,
        expiryDate,
        batchNo,
        remarks
    } = req.body;

    try {

        const adminId = 'MBBS.00000';
        const nurseId = req.params.nurseId;
        const [stkMgr] = await db.query("select * from nurse where nurseId = ?", [nurseId]);
        const formattedExpiryDate = dateConverter(expiryDate)
        const formattedManufactureDate = dateConverter(manufactureDate)

        if (stkMgr[0].stockMgr.toString() === '1') {
            const year = Number(formattedManufactureDate.split("-")[0]).toString()
            const serialNo = (batchNo.split("-")[1]).toString()
            const lensId = `${manufacturerId}-${year}-${serialNo}`;
            const [newLens] = await db.query(`
            INSERT INTO lens (lensId, lensType, surgeryType, model, lensPower, expiryDate, batchNo, remarks, adminId, stockMgrNurse, manufactureDate, manufacturerId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [lensId, lensType, surgeryType, model, lensPower, formattedExpiryDate, batchNo, remarks, adminId, nurseId, formattedManufactureDate, manufacturerId])
            res.status(200).json({
                message: "Successfully added lens"
            })
        } else {
            res.json({
                message: "Unable to access to lens database"
            })
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.json({
                message: "The lens already exists"
            })
        } else {
            res.status(500).json({
                message: "An error occurred while adding the lens"
            })
        }
    }
})

app.post("/addpatient/:doctorId", upload.single('patientImageFile'), async (req, res) => {
    const {
        patientFirstname,
        patientLastname,
        patientGender,
        patientDOB,
        patientIdNIC,
        patientPhoneNumber,
        patientAddress,
        patientDescription
    } = req.body

    const date = new Date(patientDOB);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const doctorInChargeId = req.params.doctorId
    const admittedNurse = 'NR.00000'

    try {
        const patientImageBuffer = fs.readFileSync(req.file.path)
        const [newPatient] = await db.query(`
        insert into patient (patientId, patientFirstname, patientLastname, dateOfBirth, gender, address, phoneNumber, admittedNurse, patientDescription, doctorInChargeId, patient_image)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [patientIdNIC, patientFirstname, patientLastname, formattedDate, patientGender, patientAddress, patientPhoneNumber, admittedNurse, patientDescription, doctorInChargeId, patientImageBuffer])
        fs.unlinkSync(req.file.path)
        res.status(200).json({
            message: "Patient added successfully"
        })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.json({
                message: "The patient already exists"
            })
        } else {
            res.status(500).json({
                message: "An error occurred while adding the patient"
            })
        }
        // console.log(error)
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
        const patientImageData = patientRes[0][0].patient_image.toString('base64')
        const patientImageBuffer = Buffer.from(patientImageData, 'base64')
        const patientImageFile = fs.writeFileSync('patientImage.png', patientImageBuffer)
        if (patientRes[0][0] && surgeryRes[0][0]) {
            const appointmentDetails = {
                patientFirstname: patientRes[0][0].patientFirstName,
                patientLastname: patientRes[0][0].patientLastName,
                patientContactNo: patientRes[0][0].phoneNumber,
                patientImage: patientImageData,
                surgeryDate: surgeryRes[0][0].surgeryDate,
                surgeryTime: surgeryRes[0][0].surgeryTime,
                surgeryLens: surgeryRes[0][0].lensId,
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

function formatGender(gender) {
    if (gender === 'male') {
        return 'Male'
    } else if (gender === 'female') {
        return 'Female'
    } else {
        return 'Unknown'
    }
}

app.get('/create-report/:patientId', async (req, res) => {
    const patientId = req.params.patientId
    try {
        const patientRes = await db.query(`select * from patient where patientId = ?`, [patientId])
        const examRes = await db.query(`select * from examination where patientId = ?`, [patientId])
        const compRes = await db.query(`select * from patientComplaint where patientId = ?`, [patientId])
        const surgeryRes = await db.query(`select * from surgery where patientId = ?`, [patientId])
        const patientImageData = patientRes[0][0].patient_image.toString('base64')
        const patientImageBuffer = Buffer.from(patientImageData, 'base64')
        const patientImageFile = fs.writeFileSync('patientImage.png', patientImageBuffer)
        const reportDetails = {
            patientId: patientId,
            patientFirstname: patientRes[0][0].patientFirstname,
            patientLastname: patientRes[0][0].patientLastname,
            patientDOB: formatDate(patientRes[0][0].dateOfBirth),
            patientGender: formatGender(patientRes[0][0].gender),
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

        const doctorRes = await db.query(`select doctorFirstname, doctorLastname from doctor where doctorId = ?`, [reportDetails.surgeryDoctor])

        const doctorDetails = {
            doctorFirstname: doctorRes[0][0].doctorFirstname,
            doctorLastname: doctorRes[0][0].doctorLastname
        }

        const margin = 28.35
        const padding = -5

        const contentX = margin + padding
        const contentY = margin + padding

        let doc = new PDFDocument({
            info: {
                Title: 'Medical Report'
            },
            margin: 30,
            size: 'A4'
        })

        const contentWidth = doc.page.width - 2 * (margin + padding)
        const contentHeight = doc.page.height - 2 * (margin + padding)

        doc.pipe(fs.createWriteStream(`./Patient_Report_${patientId}.pdf`))

        doc.rect(contentX, contentY, contentWidth, contentHeight)
            .lineWidth(1)
            .stroke()

        doc.restore()

        doc.moveDown()
        doc.fontSize(20);
        doc.text('Medical Report', {
            align: 'center'
        }).moveDown()

        const leftColumnX = 50
        const rightColumnX = 300
        const columnY = doc.y

        doc.fontSize(14)
        doc.text('Patient Details', leftColumnX, columnY - 10)
        doc.moveDown()

        doc.fontSize(10).text(`Patient ID         : ${reportDetails.patientId}`, leftColumnX, columnY + 30).moveDown()
        doc.fontSize(10).text(`Patient Name   : ${reportDetails.patientFirstname} ${reportDetails.patientLastname}`, leftColumnX, columnY + 50).moveDown()
        doc.fontSize(10).text(`Date of Birth     : ${reportDetails.patientDOB}`, leftColumnX, columnY + 70).moveDown()
        doc.fontSize(10).text(`Gender             :  ${reportDetails.patientGender}`, leftColumnX, columnY + 90).moveDown()
        doc.fontSize(10).text(`Phone Number : ${reportDetails.patientContactNo}`, leftColumnX, columnY + 110).moveDown()

        const imageWidth = 100
        const imageHeight = 100
        const imageX = rightColumnX + (rightColumnX - imageWidth) / 2
        doc.image(`data:image/png;base64,${patientImageData}`, imageX, columnY + 15, {
            width: imageWidth,
            height: imageHeight
        })

        doc.fontSize(14)
        doc.text('Eye Exam Details', leftColumnX, columnY + 150)
        doc.moveDown()

        const tableArray = {
            headers: ["", "Right Eye Diagnosis", "Left Eye Diagnosis"],
            rows: [
                ["Lids", `${reportDetails.rightLids}`, `${reportDetails.leftLids}`],
                ["Conjuitive", `${reportDetails.rightConjuitive}`, `${reportDetails.leftConjuitive}`],
                ["AC", `${reportDetails.rightAC}`, `${reportDetails.leftAC}`],
                ["Iris", `${reportDetails.rightIris}`, `${reportDetails.leftIris}`],
                ["Vitereous", `${reportDetails.rightVitereous}`, `${reportDetails.leftVitereous}`],
                ["Cornea", `${reportDetails.rightCornea}`, `${reportDetails.leftCornea}`],
                ["Retina", `${reportDetails.rightRetina}`, `${reportDetails.leftRetina}`],
            ]

        }
        doc.table(tableArray, {
            width: 400,
            height: 200,
            align: 'center',
            y: columnY + 190
        })
        doc.moveDown()

        doc.fontSize(10).text(`Allergies: ${reportDetails.allergies}`, leftColumnX, columnY + 330).moveDown()
        doc.fontSize(10).text(`Medical History: ${reportDetails.medicalHistory}`, leftColumnX, columnY + 350).moveDown()

        doc.fontSize(14);
        doc.text('Surgery Details', leftColumnX, columnY + 390).moveDown()
        doc.fontSize(10).text(`Surgery Id  : ${reportDetails.surgeryId}`, leftColumnX, columnY + 430).moveDown()
        doc.fontSize(10).text(`Date           : ${reportDetails.surgeryDate}`, leftColumnX, columnY + 450).moveDown()
        doc.fontSize(10).text(`Time           : ${reportDetails.surgeryTime}`, leftColumnX, columnY + 470).moveDown()
        doc.fontSize(10).text(`Doctor Id    : ${reportDetails.surgeryDoctor}`, leftColumnX, columnY + 490).moveDown()
        doc.fontSize(10).text(`Lens Id       : ${reportDetails.surgeryLens}`, leftColumnX, columnY + 510).moveDown()
        doc.fontSize(10).text(`Description : ${reportDetails.description}`, leftColumnX, columnY + 530).moveDown()

        doc.fontSize(10).text('Doctor In Charge', leftColumnX, columnY + 620)
        doc.fontSize(10).text(`Dr. ${doctorDetails.doctorFirstname} ${doctorDetails.doctorLastname}`, leftColumnX, columnY + 640)

        const lineLength = 150
        const dotSize = 0.5
        const dotSpacing = 2
        const dotCount = Math.floor(lineLength / (dotSize + dotSpacing))

        for (let i = 0; i < dotCount; i++) {
            const x = 50 + i * (dotSize + dotSpacing)
            doc.circle(x, columnY + 680, dotSize).fill()
        }
        doc.moveDown()

        doc.end()

        res.sendFile(`./Patient_Report_${patientId}.pdf`, {
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
        const response = await db.query(`select * from lens where reserved = false`)
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
        INSERT INTO examination (
            examId, examDate, examTime, rightLids, rightConjuitive, rightAC, rightIris, rightVitereous, rightCornea, rightRetina,
            leftLids, leftConjuitive, leftAC, leftIris, leftVitereous, leftCornea, leftRetina, patientId, doctorId
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`,
            [examId, examDate, examTime, rightLids, rightConjuitive, rightAC, rightIris, rightVitereous, rightCornea, rightRetina, 
                leftLids, leftConjuitive,
                leftAC, leftIris, leftVitereous, leftCornea, leftRetina, patientId, doctorId
            ]
        )
        res.send("Successfully added eye examination details")
    } catch (error) {
        console.log(error)
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

        const decrement = await db.query(`update lens set reserved = 1 where lensId = ?`, [lensId])

        res.status(200).json({
            message: "Successfully added the surgery"
        })

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.json({
                message: "The surgery already allocated"
            })
        } else {
            res.status(500).json({
                message: "Invalid details"
            })
        }
    }

})

app.post("/addpatientcomplaint/:doctorId", upload.array("eyeImages", 2), async (req, res) => {
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

        allergies,
        medicalHistory
    } = req.body

    const patientComplaintId = `PC-${patientId}`

    try {
        const eyeImageFiles = req.files
        const rightEyeImageBuffer = fs.readFileSync(eyeImageFiles[0].path)
        const leftEyeImageBuffer = fs.readFileSync(eyeImageFiles[1].path)
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
            rightPain, rightDoubleVision, rightRedeye, rightPoorVision, rightDescription, rightEyeImageBuffer,
            leftPainBool, leftDoubleVisionBool, leftRedeyeBool, leftPoorVisionBool,
            leftPain, leftDoubleVision, leftRedeye, leftPoorVision, leftDescription, leftEyeImageBuffer,
            allergies, medicalHistory, patientId
        ])
        res.send("Successfully created the patient comaplaint")
    } catch (error) {
        console.log(error)
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke')
})

app.listen(8080, () => {
    console.log(`Server is running on port 8080`)
})
