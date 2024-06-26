import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../patient.css";
const PatientComplaintsView = ({ patientId }) => {

    const [searchPatientComplaints, setSearchPatientComplaints] = useState([])
    const [rightEyeImage, setRightEyeImage] = useState(null)
    const [leftEyeImage, setLeftEyeImage] = useState(null)

    useEffect(() => {
        const fetchPatientComplaintData = async (value) => {
            try {
                const response = await axios.get(`http://localhost:8080/searchpatientcomplaints/${value}`)
                const comData = [response.data]
                setSearchPatientComplaints(comData)
                setRightEyeImage(comData[0]?.rightImageBase64)
                setLeftEyeImage(comData[0]?.leftImageBase64)
            } catch (error) {
                console.error(`${error.message}`)
            }
        }
        if (patientId && rightEyeImage && leftEyeImage) {
            fetchPatientComplaintData(patientId)
        } else if (!patientId && rightEyeImage && leftEyeImage) {
            console.log('No patient Id')
        } else if (patientId && !rightEyeImage && !leftEyeImage) {
            fetchPatientComplaintData(patientId)
            console.log('No Image')
        }
    }, [patientId])

    return (
        <div className="exam-details-section">
            <div className="above-form-and-table">
                <p>
                    <b>PATIENT COMPLAINTS</b>
                </p>
            </div>
            <div className="complaints-columns">
                <div className="complaints-column">
                    <p>
                        <b>Right Eye</b>
                    </p>
                    <div className="label-value-pair eye-image-section">
                        <span className="label">
                            Right Eye Image:
                        </span>
                        <div className="eye-image-container">
                            {rightEyeImage ? (
                                <img src={`data:image/png;base64,${rightEyeImage}`} alt="Right Eye" className="eye-image" />
                            ) : (
                                <div className="eye-icon">
                                    <FontAwesomeIcon icon={faEye} size="4x" color="#6FA1EE" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="label-value-pair">
                        <span className="label">
                            Right Eye Description:
                        </span>
                        <span className="value">{searchPatientComplaints[0]?.patientComplaintDetails?.rightDescription}</span>
                    </div>
                </div>

                <div className="complaints-column">
                    <p>
                        <b>Left Eye</b>
                    </p>
                    <div className="label-value-pair eye-image-section">
                        <span className="label">
                            Left Eye Image:
                        </span>
                        <div className="eye-image-container">
                            {leftEyeImage ? (
                                <img src={`data:image/png;base64,${rightEyeImage}`} alt="Left Eye" className="eye-image" />
                            ) : (
                                <div className="eye-icon">
                                    <FontAwesomeIcon icon={faEye} size="4x" color="#6FA1EE" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="label-value-pair">
                        <span className="label">
                            Left Eye Description:
                        </span>
                        <span className="value">{searchPatientComplaints[0]?.patientComplaintDetails?.leftDescription}</span>
                    </div>
                </div>
            </div>







            <div className="label-value-pair">
                <span className="label">Alergies:</span>
                <span className="value">{searchPatientComplaints[0]?.patientComplaintDetails?.allergies}</span>
            </div>

            <div className="label-value-pair">
                <span className="label">Medical History:</span>
                <span className="value">{searchPatientComplaints[0]?.patientComplaintDetails?.medicalHistory}</span>
            </div>
        </div>
    )
}

export default PatientComplaintsView