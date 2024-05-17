import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudUploadAlt
} from "@fortawesome/free-solid-svg-icons";
import "/Users/pabasarasamarakoon/eyeProject/frontend/src/Pages/PatientDB/patient.css";
import axios from "axios";

const PatientComplaints = ({ patientId, doctorId }) => {
    // Patient Complaints
    // Right Eye
    const [rightPainBool, setRightPainBool] = useState(false)
    const [rightPain, setRightPain] = useState('')
    const [rightDoubleVisionBool, setRightDoubleVisionBool] = useState(false)
    const [rightDoubleVision, setRightDoubleVision] = useState('')
    const [rightRedeyeBool, setRightRedeyeBool] = useState(false)
    const [rightRedeye, setRightRedeye] = useState('')
    const [rightPoorVisionBool, setRightPoorVisionBool] = useState(false)
    const [rightPoorVision, setRightPoorVision] = useState('')
    const [rightDescription, setRightDescription] = useState('')
    const [rightEyeImage, setRightEyeImage] = useState(null)
    const [rightEyeImagePath, setRightEyeImagePath] = useState(null)

    // Left Eye
    const [leftPainBool, setLeftPainBool] = useState(false)
    const [leftPain, setLeftPain] = useState('')
    const [leftDoubleVisionBool, setLeftDoubleVisionBool] = useState(false)
    const [leftDoubleVision, setLeftDoubleVision] = useState('')
    const [leftRedeyeBool, setLeftRedeyeBool] = useState(false)
    const [leftRedeye, setLeftRedeye] = useState('')
    const [leftPoorVisionBool, setLeftPoorVisionBool] = useState(false)
    const [leftPoorVision, setLeftPoorVision] = useState('')
    const [leftDescription, setLeftDescription] = useState('')
    const [leftEyeImage, setLeftEyeImage] = useState(null)
    const [leftEyeImagePath, setLeftEyeImagePath] = useState(null)
    const [rightEyeImageFile, setRightEyeImageFile] = useState(null)
    const [leftEyeImageFile, setLeftEyeImageFile] = useState(null)

    const [allergies, setAllergies] = useState('')
    const [medicalHistory, setMedicalHistory] = useState('')

    useEffect(() => {
        console.log("Right eye image state:", rightEyeImage);
    }, [rightEyeImage]);

    useEffect(() => {
        console.log("Right eye image path:", rightEyeImagePath);
    }, [rightEyeImagePath]);

    useEffect(() => {
        console.log("Left eye image state:", leftEyeImage);
    }, [leftEyeImage]);

    useEffect(() => {
        console.log("Left eye image path:", leftEyeImagePath);
    }, [leftEyeImagePath]);

    // const handleRightEyeImageChange = (e) => {
    //     const selectedImage = e.target.files[0];
    //     console.log("Selected image:", selectedImage);
    //     setRightEyeImage(selectedImage);
    //     console.log("Right eye image state:", rightEyeImage);
    //     setRightEyeImagePath(URL.createObjectURL(selectedImage));
    //     console.log("Right eye image path:", rightEyeImagePath);
    // }

    // const handleLeftEyeImageChange = (e) => {
    //     const selectedImage = e.target.files[0];
    //     console.log("Selected image:", selectedImage);
    //     setLeftEyeImage(selectedImage);
    //     console.log("Left eye image state:", leftEyeImage);
    //     setLeftEyeImagePath(URL.createObjectURL(selectedImage));
    //     console.log("Left eye image path:", leftEyeImagePath);
    // }

    const handleRightEyeImageChange = (event) => {
        setRightEyeImageFile(event.target.files[0])
    }

    const handleLeftEyeImageChange = (event) => {
        setLeftEyeImageFile(event.target.files[0])
    }


    const handleAddPatientComplaintSubmit = async (event) => {
        event.preventDefault()

        try {

            const convertToInteger = (boolValue) => boolValue ? 1 : 0

            const formData = new FormData()
            formData.append('patientId', patientId)

            formData.append('rightPainBool', convertToInteger(rightPainBool))
            formData.append('rightPain', rightPain)
            formData.append('rightDoubleVisionBool', convertToInteger(rightDoubleVisionBool))
            formData.append('rightDoubleVision', rightDoubleVision)
            formData.append('rightRedeyeBool', convertToInteger(rightRedeyeBool))
            formData.append('rightRedeye', rightRedeye)
            formData.append('rightPoorVisionBool', convertToInteger(rightPoorVisionBool))
            formData.append('rightPoorVision', rightPoorVision)
            formData.append('rightDescription', rightDescription)
            formData.append('eyeImages', rightEyeImageFile)

            formData.append('leftPainBool', convertToInteger(leftPainBool))
            formData.append('leftPain', leftPain)
            formData.append('leftDoubleVisionBool', convertToInteger(leftDoubleVisionBool))
            formData.append('leftDoubleVision', leftDoubleVision)
            formData.append('leftRedeyeBool', convertToInteger(leftRedeyeBool))
            formData.append('leftRedeye', leftRedeye)
            formData.append('leftPoorVisionBool', convertToInteger(leftPoorVisionBool))
            formData.append('leftPoorVision', leftPoorVision)
            formData.append('leftDescription', leftDescription)
            formData.append('eyeImages', leftEyeImageFile)

            formData.append('allergies', allergies)
            formData.append('medicalHistory', medicalHistory)

            const response = await axios.post(`http://localhost:8080/addpatientcomplaint/${doctorId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            alert("Sucessfully added the patient complaint")
        } catch (error) {
            console.log(error)
        }
    }

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
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Pain:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={rightPainBool}
                            onChange={() => {
                                setRightPainBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={rightPain}
                            onChange={(e) => setRightPain(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Double Vision:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={rightDoubleVisionBool}
                            onChange={() => {
                                setRightDoubleVisionBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={rightDoubleVision}
                            onChange={(e) => setRightDoubleVision(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Red Eye:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={rightRedeyeBool}
                            onChange={() => {
                                setRightRedeyeBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={rightRedeye}
                            onChange={(e) => setRightRedeye(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Poor Vision:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={rightPoorVisionBool}
                            onChange={() => {
                                setRightPoorVisionBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={rightPoorVision}
                            onChange={(e) => setRightPoorVision(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rightEyeParameter2">
                            Description:
                        </label>
                        <input
                            type="text"
                            id="rightEyeParameter2"
                            className="lInput"
                            placeholder="Enter More Details"
                            value={rightDescription}
                            onChange={(e) => setRightDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group button-group">
                        <label
                            htmlFor="imageUpload"
                            className="insert-image-text"
                        >
                            Upload Right Eye Image
                            <FontAwesomeIcon
                                icon={faCloudUploadAlt}
                                style={{
                                    fontSize: "1.5em",
                                    color: "#6FA1EE",
                                }}
                                className="cloud-icon"
                            />
                        </label>
                        <input
                            type="file"
                            id="imageUpload"
                            style={{ display: "none" }}
                            onChange={handleRightEyeImageChange}
                        />
                        <button
                            type="button"
                            className="button-img"
                            onClick={() =>
                                document
                                    .getElementById("imageUpload")
                                    .click()
                            }
                        >
                            Upload Image
                        </button>
                    </div>
                    {rightEyeImageFile && (
                        <div>
                            <h2>Right Eye Preview:</h2>
                            <img src={URL.createObjectURL(rightEyeImageFile)} alt="RightEye" />
                        </div>
                    )}
                </div>
                <div className="complaints-column">
                    <p>
                        <b>Left Eye</b>
                    </p>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Pain:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={leftPainBool}
                            onChange={() => {
                                setLeftPainBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={leftPain}
                            onChange={(e) => setLeftPain(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Double Vision:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={leftDoubleVisionBool}
                            onChange={() => {
                                setLeftDoubleVisionBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={leftDoubleVision}
                            onChange={(e) => setLeftDoubleVision(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Red Eye:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={leftRedeyeBool}
                            onChange={() => {
                                setLeftRedeyeBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={leftRedeye}
                            onChange={(e) => setLeftRedeye(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Poor Vision:
                        </label>
                        <input
                            type="checkbox"
                            id="rightEyePain"
                            className="checkbox-input"
                            checked={leftPoorVisionBool}
                            onChange={() => {
                                setLeftPoorVisionBool(prevState => !prevState)
                            }}
                        />
                        <input
                            type="text"
                            className="lInput"
                            placeholder="Enter Duration"
                            value={leftPoorVision}
                            onChange={(e) => setLeftPoorVision(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rightEyeParameter2">
                            Description:
                        </label>
                        <input
                            type="text"
                            id="rightEyeParameter2"
                            className="lInput"
                            placeholder="Enter More Details"
                            value={leftDescription}
                            onChange={(e) => setLeftDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group button-group">
                        <label
                            htmlFor="imageUpload"
                            className="insert-image-text"
                        >
                            Upload Left Eye Image
                            <FontAwesomeIcon
                                icon={faCloudUploadAlt}
                                style={{
                                    fontSize: "1.5em",
                                    color: "#6FA1EE",
                                }}
                                className="cloud-icon"
                            />
                        </label>
                        <input
                            type="file"
                            id="imageUpload"
                            style={{ display: "none" }}
                            onChange={handleLeftEyeImageChange}
                        />
                        <button
                            type="button"
                            className="button-img"
                            onClick={() =>
                                document
                                    .getElementById("imageUpload")
                                    .click()
                            }
                        >
                            Upload Image
                        </button>
                    </div>
                    {leftEyeImageFile && (
                        <div>
                            <h2>Left Eye Preview:</h2>
                            <img src={URL.createObjectURL(leftEyeImageFile)} alt="LeftEyeImage" />
                        </div>
                    )}
                </div>
            </div>
            <label htmlFor="alergy">
                Alergies Details:
            </label>
            <input
                type="text"
                id="alergy"
                className="lInput"
                placeholder="Enter Alegies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
            />
            <div>
                <label htmlFor="medipast">
                    Medical History:
                </label>
                <input
                    type="text"
                    id="medipast"
                    className="lInput"
                    placeholder="Enter Past Medical History"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                />
            </div>
            <div className="form-group button-group">
                <button type="submit" className="button" onClick={handleAddPatientComplaintSubmit}
                >
                    Add Patient Complaint
                </button>
            </div>
        </div>
    )
}

export default PatientComplaints