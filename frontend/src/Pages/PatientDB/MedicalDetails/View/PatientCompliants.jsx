import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

const PatientComplaintsView = ({ patientId }) => {

    const [searchPatientComplaints, setSearchPatientComplaints] = useState([])
    const [rightEyeImage, setRightEyeImage] = useState(null)
    const [leftEyeImage, setLeftEyeImage] = useState(null)

    useEffect(() => {
        const fetchPatientComplaintData = async (value) => {
            try {
                const response = await axios.get(`http://localhost:8080/searchpatientcomplaints/${value}`)

                setSearchPatientComplaints(response.data)
                setRightEyeImage(searchPatientComplaints?.rightImageBase64)
                setLeftEyeImage(searchPatientComplaints?.leftImageBase64)
                console.log(searchPatientComplaints)
            } catch (error) {
                console.error(`${error.message}`)
            }
        }
        if (patientId) {
            fetchPatientComplaintData(patientId);
        } else {
            console.log('No patient Id')
        }
    }, [patientId])

    return (
        <div className="exam-details-section">
            <div className="above-form-and-table">
                <p>
                    <b>PATIENT COMPLAINTS</b>
                </p>
            </div>
            <div className="label-value-pair eye-image-section">
                <span className="label">
                    Right Eye Image:
                </span>
                <div className="eye-image-container">
                    {rightEyeImage ? (
                        <img src={rightEyeImage} alt="Right Eye" className="eye-image" />
                    ) : (
                        <div className="eye-icon">
                            <FontAwesomeIcon icon={faEye} size="4x" color="#6FA1EE" />
                        </div>
                    )}
                </div>
            </div>
            <div className="label-value-pair eye-image-section">
                <span className="label">
                    Left Eye Image:
                </span>
                <div className="eye-image-container">
                    {leftEyeImage ? (
                        <img src={leftEyeImage} alt="Left Eye" className="eye-image" />
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
                <span className="value">{searchPatientComplaints[0]?.[0]?.rightDescription}</span>
            </div>

            <div className="label-value-pair">
                <span className="label">
                    Left Eye Description:
                </span>
                <span className="value">{searchPatientComplaints[0]?.[0]?.leftDescription}</span>
            </div>
            <div className="label-value-pair">
                <span className="label">Alergies:</span>
                <span className="value">{searchPatientComplaints[0]?.[0]?.allergies}</span>
            </div>

            <div className="label-value-pair">
                <span className="label">Medical History:</span>
                <span className="value">{searchPatientComplaints[0]?.[0]?.medicalHistory}</span>
            </div>
        </div>
    )
}

export default PatientComplaintsView