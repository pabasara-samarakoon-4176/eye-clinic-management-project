const mysql = require('mysql2')
const bcrypt = require('bcrypt')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dhoomiii@2000',
    database: 'eye_clinic_database'
}).promise()

async function getDoctor(doctorId) {
    const [doctor] = await db.query(`select * from doctor where doctorId = ?`, [doctorId])
    return doctor[0]
}

async function login(doctorId, password) {
    const [user] = await db.query("SELECT * FROM doctor WHERE doctorId = ?", [doctorId])
    const [doctorPassword] = await db.query("select doctorPassword from doctor where doctorId = ?", [doctorId])
    const _doctorPasswordHashed = user[0].doctorPassword
    const _doctorId = user[0].doctorId
    if (doctorId === _doctorId) {
        if (await bcrypt.compare(password, _doctorPasswordHashed)) {
            return 'Success'
        } else {
            return 'Fail'
        }
    } else {
        return 'Fail'
    }
}

async function register(doctorId, doctorFirstname, doctorLastname, doctorPassword) {
    const adminId = 'MBBS.00000'
    const hashedPassword = await bcrypt.hash(doctorPassword, 10)
    await db.query(`
        insert into doctor (doctorId, doctorFirstname, doctorLastname, doctorPassword, adminId)
        values (?, ?, ?, ?, ?)
        `, [doctorId, doctorFirstname, doctorLastname, hashedPassword, adminId])
    const [newDoctor] = await db.query("select * from doctor where doctorId = ?", [doctorId])
    return "Doctor added successfully"
}

function dateConverter(dateString) {

    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

async function searchPatient(patientId) {
    const response = await db.query(`select * from patient where patientId = ?`, [patientId])
    return response[0]
}

async function addLens(lensType, manufacturerId, surgeryType, model, lensPower, manufactureDate, expiryDate, batchNo, remarks, adminId, nurseId) {
    const [stkMgr] = await db.query("select * from nurse where nurseId = ?", [nurseId])
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
        return "Successfully added lens"
    } else {
        return "Unable to access to lens database"
    }
}

async function viewappointmentdetails(patientId) {
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
            surgeryLens: surgeryRes[0][0].lensId,
            description: surgeryRes[0][0].description
        }
        return appointmentDetails
    } else {
        return "Patient appointment details not found"
    }
}

module.exports = {
    getDoctor,
    login,
    register,
    searchPatient,
    addLens,
    viewappointmentdetails
}