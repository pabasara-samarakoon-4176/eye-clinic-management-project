import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faCloudUploadAlt,
    faUser,
    faSearch,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./patient.css";
import axios from "axios";


const PatientPersonalDetailsView = () => {

    const [searchPatientId, setSearchPatientId] = useState('')
    const [searchPatient, setSearchPatient] = useState([])
    const [patientImageUrl, setPatientImageUrl] = useState(null)


    const handleSearch = async (Value) => {
        try {
            const response = await axios.get(`http://localhost:8080/searchpatient/${searchPatientId}`)
            setSearchPatient([response.data])
            console.log(`patient blob: ${patientImage}`)
            const patientImage = searchPatient[0]?.[0]?.patient_image
            // if (patientImage) {
            //     const reader = new FileReader();
            //     reader.readAsDataURL(new Blob([Uint8Array.from(patientImage.data)]));
            //     reader.onloadend = () => {
            //         setPatientImageUrl(reader.result);
            //     };
            // }

        } catch (error) {
            console.log(`${error.message}`)
        }
    }

    const imageUrl = null;
    return (
        <div>
            <div className="above-form-and-table">
                <p>
                    <b>VIEW PATIENT DETAILS</b>
                </p>
            </div>
            <div className="search-section1">
                <div className="search-input">
                    <input
                        type="text"
                        id="searchPatientId"
                        className="lInput"
                        placeholder="Enter Patient ID"
                        onChange={(e) => setSearchPatientId(e.target.value)}
                    />

                    <button
                        type="button"
                        className="search-icon"
                        onClick={() => handleSearch(searchPatientId)}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            style={{ fontSize: "1.5em", color: "#6FA1EE" }}
                        />
                    </button>
                </div>
            </div>

            <div className="columns-container">

                <>
                    <div className="column">
                        <div className="image-container">
                            {patientImageUrl ? (
                                <img
                                    src={patientImageUrl}
                                    alt="Patient"
                                    className="Patient-image"
                                />
                            ) : (
                                <div
                                    className="patient-icon"
                                    style={{ width: "200px", height: "200px" }}
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        size="8x"
                                        color="black"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="column second-column">
                        <div className="label-value-pair-P">
                            <span className="labelP">Firstname:</span>
                            <span className="valueP">{searchPatient[0]?.[0]?.patientFirstname}</span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Lastname:</span>
                            <span className="valueP">{searchPatient[0]?.[0]?.patientLastname}</span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Date of Birth:</span>
                            <span className="valueP">{searchPatient[0]?.[0]?.dateOfBirth}</span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">Gender:</span>
                            <span className="valueP">{searchPatient[0]?.[0]?.gender}</span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Address:</span>
                            <span className="valueP">{searchPatient[0]?.[0]?.address}</span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">Contact No:</span>
                            <span className="valueP">{searchPatient[0]?.[0]?.phoneNumber}</span>
                        </div>
                       
                       
                    </div>
                </>

            </div>
            <div className="label-value-pair">
                <span className="label">Description:</span>
                <span className="value2">{searchPatient[0]?.[0]?.patientDescription}</span>
            </div>
        </div>
    )
}

export default PatientPersonalDetailsView