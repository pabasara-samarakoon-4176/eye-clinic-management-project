import React from "react";
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


const PatientPersonalDetailsView = () => {


    const handleSearch = (searchValue) => {
        console.log("Search value:", searchValue);
    };

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
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <button
                        type="button"
                        className="search-icon"
                        onClick={() => handleSearch()}
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
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="User"
                                    className="user-image"
                                />
                            ) : (
                                <div
                                    className="user-icon"
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
                            <span className="labelP">Name:</span>
                            <span className="valueP"></span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Patient ID:</span>
                            <span className="valueP"></span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">Age:</span>
                            <span className="valueP"></span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Gender:</span>
                            <span className="valueP"></span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">Date of Birth:</span>
                            <span className="valueP"></span>
                        </div>
                        <div className="label-value-pair-P">
                            <span className="labelP">NIC No:</span>
                            <span className="valueP"></span>
                        </div>

                        <div className="label-value-pair-P">
                            <span className="labelP">Contact No:</span>
                            <span className="valueP"></span>
                        </div>
                    </div>
                </>

            </div>
            <div className="label-value-pair">
                <span className="label">Description:</span>
                <span className="value2"></span>
            </div>
        </div>
    )
}

export default PatientPersonalDetailsView