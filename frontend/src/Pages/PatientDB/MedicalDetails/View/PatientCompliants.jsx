import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

const PatientComplaintsView = ({ patientId }) => {
    const imageUrl = null;

    const [searchPatientComplaints, setSearchPatientComplaints] = useState([])

    const [rightEyeImageUrl, setRightEyeImageUrl] = useState(null)
    const [leftEyeImageUrl, setLeftEyeImageUrl] = useState(null)

    useEffect(() => {
        const fetchPatientComplaintData = async (value) => {
            try {
                const response = await axios.get(`http://localhost:8080/searchpatientcomplaints/${value}`)

                setSearchPatientComplaints([response.data])
                const rightEyeImage = searchPatientComplaints[0]?.[0]?.rightEyeImage
                const leftEyeImage = searchPatientComplaints[0]?.[0]?.leftEyeImage

                if (rightEyeImage) {
                    const reader = new FileReader();
                    reader.readAsDataURL(new Blob([Uint8Array.from(rightEyeImage.data)]));
                    reader.onloadend = () => {
                        setRightEyeImageUrl(reader.result);
                    };
                }

                if (leftEyeImage) {
                    const reader = new FileReader();
                    reader.readAsDataURL(new Blob([Uint8Array.from(leftEyeImage.data)]));
                    reader.onloadend = () => {
                        setLeftEyeImageUrl(reader.result);
                    };
                }

                console.log(`rightImage: ${rightEyeImageUrl}`)
                console.log(`leftImage: ${leftEyeImageUrl}`)
            } catch (error) {
                console.error(`${error.message}`)
            }
        }
        if (patientId) {
            fetchPatientComplaintData(patientId);
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
                    {rightEyeImageUrl ? (
                        <img src={rightEyeImageUrl} alt="Right Eye" className="eye-image" />
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
                    {leftEyeImageUrl ? (
                        <img src={leftEyeImageUrl} alt="Left Eye" className="eye-image" />
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