import React, { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faUser,
    faSearch
} from "@fortawesome/free-solid-svg-icons"
import "./patient.css"
import axios from "axios"

const PatientPersonalDetailsView = () => {

    const [searchPatientId, setSearchPatientId] = useState(null)
    const [searchPatient, setSearchPatient] = useState([])
    const [patientImage, setPatientImage] = useState(null)

    const formatDate = (dateString) => {
        if (dateString) {
            const dateParts = dateString.split("T")[0].split("-")
            return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`
        }
    }

    const handleSearch = async (Value) => {
        try {
            const response = await axios.get(`http://localhost:8080/searchpatient/${searchPatientId}`)
            setSearchPatient(response.data)
            setPatientImage(searchPatient?.imageBase64)
        } catch (error) {
            console.log(error)
        }
    }
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
                        onClick={() => {
                            handleSearch(searchPatientId)
                        }}
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
                            {searchPatient ? (
                                <img src={`data:image/png;base64,${patientImage}`} alt="Patient" />
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
                            <span className="valueP">{searchPatient?.patient?.patientFirstname}</span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Lastname:</span>
                            <span className="valueP">{searchPatient?.patient?.patientLastname}</span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Date of Birth:</span>
                            <span className="valueP">{formatDate(searchPatient?.patient?.dateOfBirth)}</span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">Gender:</span>
                            <span className="valueP">{searchPatient?.patient?.gender}</span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Address:</span>
                            <span className="valueP">{searchPatient?.patient?.address}</span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">Contact No:</span>
                            <span className="valueP">{searchPatient?.patient?.phoneNumber}</span>
                        </div>


                    </div>
                </>

            </div>
            <div className="label-value-pair">
                <span className="label">Description:</span>
                <span className="value2">{searchPatient?.patient?.patientDescription}</span>
            </div>
        </div>
    )
}

export default PatientPersonalDetailsView