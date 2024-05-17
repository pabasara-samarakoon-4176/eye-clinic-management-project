import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

const ClinicDetailsView = ({ patientId }) => {

    const [searchClinicDetails, setSearchClinicDetails] = useState([])

    useEffect(() => {
        const fetchClinicData = async (value) => {

            try {
                const response = await axios.get(`http://localhost:8080/searchclinicdetails/${value}`)
                setSearchClinicDetails([response.data])
                console.log(searchClinicDetails)
            } catch (error) {
                console.error(`${error.message}`)
            }
        }
        if (patientId) {
            fetchClinicData(patientId)
        }
    }, [patientId])

    const testFunction = (patientId) => {
        console.log(patientId)
    }

    const formatDate = (dateString) => {
        const dateParts = dateString.split("T")[0].split("-")
        return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`
    }

    return (
        <div className="exam-details-section">
            <div className="above-form-and-table">
                <p>
                    <b>CLINIC DETAILS</b>
                </p>
            </div>
            <div className="label-value-pair">
                <span className="label">Consultant ID:</span>
                <span className="value">{searchClinicDetails[0]?.consultantId}</span>
            </div>
            <div className="label-value-pair">
                <span className="label">Date:</span>
                <span className="value">{searchClinicDetails[0]?.clinicDate}</span>

            </div>
            <div className="label-value-pair">
                <span className="label">Time:</span>
                <span className="value">{searchClinicDetails[0]?.clinicTime}</span>
            </div>
        </div>
    )
}

export default ClinicDetailsView