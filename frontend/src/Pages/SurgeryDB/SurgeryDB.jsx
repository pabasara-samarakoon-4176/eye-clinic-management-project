import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faUser,
  faSearch,
  faEye,
  faCloudDownloadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

import "./surgeryDB.css";

const LensDB = () => {
  const handleSurgeryHoursChange = (e) => setSurgeryHours(e.target.value);
  const handleSurgeryMinutesChange = (e) => setSurgeryMinutes(e.target.value);
  const handleSurgeryAMPMChange = (e) => setSurgeryAMPM(e.target.value);

  const [activeButton, setActiveButton] = useState("add");

  const [surgeryDate, setSurgeryDate] = useState(null);
  const [surgeryHours, setSurgeryHours] = useState(null);
  const [surgeryMinutes, setSurgeryMinutes] = useState(null);
  const [surgeryAMPM, setSurgeryAMPM] = useState(null);

  const [activeTab, setActiveTab] = useState(""); // Define setActiveTab

  const [patient, setPatient] = useState('')
  const [patientId, setPatientId] = useState('')
  const [patientOptions, setPatientOptions] = useState([])

  const [lens, setLens] = useState('')
  const [lensId, setLensId] = useState('')
  const [lensOptions, setLensOptions] = useState([])

  const [description, setDescription] = useState('')
  const [docReport, setDocReport] = useState('')

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };
  const hoursOptions = Array.from({ length: 12 }, (_, index) =>
    (index + 1).toString(),
  );
  const minutesOptions = Array.from({ length: 60 }, (_, index) =>
    index.toString().padStart(2, "0"),
  );

  const doctorId = 'MBBS.00000'

  useEffect(() => {
    const fetchPatients = async (value) => {
      try {
        const response = await axios.get(`http://localhost:8080/viewpatients/${value}`)
        setPatientOptions(response.data)
        console.log(patientOptions)
      } catch (error) {
        console.log(error)
      }
    }
    if (doctorId) {
      fetchPatients(doctorId)
    }
  }, [doctorId])

  useEffect(() => {
    const fetchLens = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/admin/viewlens`)
        setLensOptions(response.data)
        console.log(lensOptions)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLens()
  }, [])

  const imageUrl = null;
  const eyeImages = null;
  const handleSearch = (searchValue) => {
    console.log("Search value:", searchValue);
  };

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle "See Details" button click
  const handleSeeDetails = () => {
    // Navigate to patient details route
    navigate("/patientDB");
    setActiveTab("MEDICAL DETAILS");
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const doctorId = 'MBBS.00000'
    try {
      const response = await axios.post(`http://localhost:8080/addsurgery/${doctorId}`, {
        surgeryDate: surgeryDate,
        surgeryHours: surgeryHours,
        surgeryMinutes: surgeryMinutes,
        surgeryAMPM: surgeryAMPM,
        patientId: patientId,
        lensId: lensId,
        description: description,
        docReport: docReport
      })
      alert("Successfully added the surgery record")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <header className="header">
        <h1>Appointment Handling Dashboard</h1>
      </header>
      <div className="extra-blue-bar"></div>
      <div className="content-container">
        <div className="container">
          <div className="left-panel">
            <button
              className={`rounded-button ${activeButton === "add" ? "active" : ""}`}
              onClick={() => handleButtonClick("add")}
            >
              Add
            </button>
            <button
              className={`rounded-button ${activeButton === "view" ? "active" : ""}`}
              onClick={() => handleButtonClick("view")}
            >
              View
            </button>
          </div>
          <div className="right-panel">
            {activeButton === "add" && (
              <form>
                <div className="above-form-and-table">
                  <p>
                    <b>APPOINTMENT DETAILS</b>
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="patientID" className="label">
                    Patient ID:
                  </label>
                  <select id="patientId" className="lInput"
                    value={patient} onChange={(e) => setPatientId(e.target.value)}>
                    <option value="">Select the patient</option>
                    {patientOptions.map((patient) => (
                      <option key={patient.patientId} value={patient.patientId}>
                        {patient.patientId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date" className="label">
                    Surgery Date:
                  </label>
                  <div className="date-input">
                    <DatePicker
                      selected={surgeryDate}
                      onChange={(date) => setSurgeryDate(date)}
                      placeholderText="Select Date"
                      className="lInput"
                      dateFormat="yyyy/MM/dd"
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{
                        fontSize: "1.5em",
                        color: "#6FA1EE",
                        marginLeft: "8px",
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="time" className="label">
                    Surgery Time:
                  </label>
                  <div className="time-input">
                    <select
                      id="hours"
                      className="lInputt"
                      value={surgeryHours || ""}
                      onChange={(e) => handleSurgeryHoursChange(e)}
                    >
                      <option value="" disabled>
                        --
                      </option>
                      {hoursOptions.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>{" "}
                    hours
                    <select
                      id="minutes"
                      className="lInputt"
                      value={surgeryMinutes || ""}
                      onChange={(e) => handleSurgeryMinutesChange(e)}
                    >
                      <option value="" disabled>
                        --
                      </option>
                      {minutesOptions.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>{" "}
                    minutes
                    <select
                      id="ampm"
                      className="lInputt"
                      value={surgeryAMPM || ""}
                      onChange={(e) => handleSurgeryAMPMChange(e)}
                    >
                      <option value="" disabled>
                        --
                      </option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    AM/PM
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="patientID" className="label">
                    Lens ID:
                  </label>
                  <select id="patientId" className="lInput"
                    value={lens} onChange={(e) => setLensId(e.target.value)}>
                    <option value="">Select the lens</option>
                    {lensOptions.map((lens) => (
                      <option key={lens.lensId} value={lens.lensId}>
                        {lens.lensId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="label">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    className="lInput"
                    placeholder="Enter description"
                  ></textarea>
                </div>

                <div className="form-group button-group">
                  <p>Please create a patient record before making an appointment. Make sure to add medical and personal details of patient</p>

                </div>

                <div className="form-group button-group">

                  <button className="button" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </form>
            )}

            {activeButton === "view" && (
              <div>
                <div className="above-form-and-table">
                  <p>
                    <b>VIEW APPOINTMENT DETAILS</b>
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
                  {activeButton === "view" && (
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
                          <span className="labelP">Patient ID:</span>
                          <span className="valueP"></span>
                        </div>

                        <div className="label-value-pair-P">
                          <span className="labelP">Surgery Date:</span>
                          <span className="valueP"></span>
                        </div>
                        <div className="label-value-pair-P">
                          <span className="labelP">Surgery Time:</span>
                          <span className="valueP"></span>
                        </div>
                        <div className="label-value-pair-P">
                          <span className="labelP">Lens:</span>
                          <span className="valueP"></span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="label-value-pair">
                  <span className="label">Description:</span>
                  <span className="value2"></span>
                </div>
                <div className="form-group button-group">
                  <p>If need to look on Medical Details and Personal Detils , Click below button </p>
                </div>

                <div className="form-group button-group">

                  <button className="button" onClick={handleSeeDetails}>
                    Patient Details  View
                  </button>
                </div>

                <div className="form-group button-group">
                  <span>
                    <h4>Uploaded Eye Images : </h4>
                  </span>
                  {eyeImages === null ? (
                    <span>
                      <h4 className="eye-text"> No Uploaded Eye Images</h4>
                    </span>
                  ) : (
                    // Render the uploaded eye images if eyeImages is not null
                    <div className="eye-images-section">
                      <h2>Uploaded Eye Images</h2>
                      <div className="columns-container">
                        {eyeImages.map((image, index) => (
                          <div className="column" key={index}>
                            <div className="eye-image-container">
                              <img
                                src={image}
                                alt={`Eye ${index}`}
                                className="eye-image"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-group button-group">
                  <label htmlFor="imageUpload" className="insert-image-text">
                    <b>Download Medical Report</b>
                    <FontAwesomeIcon
                      icon={faCloudDownloadAlt}
                      style={{ fontSize: "1.5em", color: "#6FA1EE" }}
                      className="cloud-icon"
                    />
                  </label>

                  <button
                    type="button"
                    className="button-img"
                    onClick={() => {
                      alert("Downloading your medical report...");
                    }}
                  >
                    Download Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="empty-row"></div>
      </div>
    </div>
  );
};

export default LensDB;
