import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./patient.css";
import PatientPersonalDetailsAdd from "./PatientPersonalDetailsAdd";
import PatientPersonalDetailsView from "./PatientPersonalDetailsView";
import ClinicDetails from "./MedicalDetails/Add/ClinicDetails";
import PatientComplaints from "./MedicalDetails/Add/PatientCompliants";
import ExamDetails from "./MedicalDetails/Add/ExamDetails";
import GlucomaDetails from "./MedicalDetails/Add/GlucomaDetials";
import CataratDetails from "./MedicalDetails/Add/CataractDetails";
import ClinicDetailsView from "./MedicalDetails/View/ClinicDetails";
import PatientComplaintsView from "./MedicalDetails/View/PatientCompliants";
import ExamDetailsView from "./MedicalDetails/View/ExamDetails";
import CataratDetailsView from "./MedicalDetails/View/CataractDetails";
import GlucomaDetailsView from "./MedicalDetails/View/GlucomaDetails";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDB = () => {

  const { doctorId } = useParams()
  const navigate = useNavigate()

  axios.defaults.withCredentials = true

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/home/${doctorId}`)
        if (res.data.Status !== "Success") {
          navigate('/')
        } else {
          console.log('working')
        }
      } catch (error) {
        console.log(error)
        navigate('/')
      }
    }

    verifyUser();
  }, [doctorId, navigate])

  const [patientId, setPatientId] = useState('')
  const [value, setValue] = useState('')

  const [activeTab, setActiveTab] = useState("PERSONAL DETAILS")
  const [activeButton, setActiveButton] = useState("add")

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }

  const handleSearchPatientId = (value) => {
    setPatientId(value)
  }

  const handleButtonClick = (button) => {
    setActiveButton(button);
  }

  const handleSubmitClick = () => {
    try {
      alert("Successfully submitted patient information")
      navigate(`/${doctorId}/home`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <header className="header">
        <h1>Patient Details Handling Dashboard</h1>
      </header>
      <div className="extra-blue-bar">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "PERSONAL DETAILS" ? "active" : ""}`}
            onClick={() => handleTabClick("PERSONAL DETAILS")}
          >
            PERSONAL DETAILS
          </button>
          <button
            className={`tab-button ${activeTab === "MEDICAL DETAILS" ? "active" : ""}`}
            onClick={() => handleTabClick("MEDICAL DETAILS")}
          >
            MEDICAL DETAILS
          </button>
        </div>
      </div>
      <div className="content-container">
        {activeTab === "PERSONAL DETAILS" && (
          <div>
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

                  {/* Add personal details */}
                  {activeButton === "add" && (
                    <PatientPersonalDetailsAdd patientId={patientId} setPatientId={setPatientId} doctorId={doctorId} />
                  )}

                  {/* View patient details */}
                  {activeButton === "view" && (
                    <PatientPersonalDetailsView />
                  )}
                </div>
              </div>

              <div className="empty-row"></div>
            </div>
          </div>
        )}

        {/* Add medical details */}
        {activeTab === "MEDICAL DETAILS" && (
          <div>
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

                  <div className="fixed-navigation-buttons">
                    <p>
                      <b>Navigation Menu</b>
                    </p>
                    <a href="#clinic-data">
                      <button className="rounded-button">Clinic Details</button>
                    </a>
                    <a href="#patient-complaints">
                      <button className="rounded-button">
                        Patient Complaints
                      </button>
                    </a>
                    <a href="#exam-data">
                      <button className="rounded-button">Exam Details</button>
                    </a>
                    <a href="#catarat-details">
                      <button className="rounded-button">
                        Catarat Details
                      </button>
                    </a>
                    <a href="#glucoma details">
                      <button className="rounded-button">
                        Glucoma Details
                      </button>
                    </a>
                  </div>
                </div>
                <div className="right-panel">
                  {/* Medical details */}
                  {activeTab === "MEDICAL DETAILS" && (
                    <div>
                      <div className="content-container">
                        <div className="container">
                          <div className="right-panel">
                            {/* Add medical details */}
                            {activeButton === "add" && (
                              <form>
                                <div className="above-form-and-table">
                                  <p>
                                    <b>MEDICAL DATA</b>
                                  </p>
                                </div>
                                <div id="clinic-data">
                                  <ClinicDetails patientId={patientId} doctorId={doctorId} />
                                </div>
                                <div id="patient-complaints">
                                  <PatientComplaints patientId={patientId} doctorId={doctorId} />
                                </div>
                                <div id="exam-data">
                                  <ExamDetails patientId={patientId} doctorId={doctorId} />
                                </div>
                                <div id="catarat-details">
                                  <CataratDetails />
                                </div>

                                <div id="glucoma-details">
                                  <GlucomaDetails />
                                </div>
                                <div className="form-group button-group">
                                  <button type="submit" className="button"
                                    onClick={handleSubmitClick}>
                                    Submit
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        </div>
                        <div className="empty-row"></div>
                      </div>
                    </div>
                  )}

                  {/* View medical data */}
                  {activeButton === "view" && (
                    <div>
                      <div className="above-form-and-table">
                        <p>
                          <b>MEDICAL DATA SUMMARIZED</b>
                        </p>
                      </div>
                      {activeButton === "view" && (
                        <div>
                          <div className="search-section1">
                            <div className="search-input">
                              <input
                                type="text"
                                id="searchPatientId"
                                className="lInput"
                                placeholder="Enter Patient ID"
                                onChange={(e) => setValue(e.target.value)}
                              />
                              <button
                                type="button"
                                className="search-icon"
                                onClick={() => handleSearchPatientId(value)}
                              >
                                <FontAwesomeIcon
                                  icon={faSearch}
                                  style={{
                                    fontSize: "1.5em",
                                    color: "#6FA1EE",
                                  }}
                                />
                              </button>
                            </div>
                          </div>
                          <div id="clinic-data">
                            <ClinicDetailsView patientId={patientId} />
                          </div>
                          <div id="patient-complaints">
                            <PatientComplaintsView patientId={patientId} />
                          </div>
                          <div id="exam-data">
                            <ExamDetailsView patientId={patientId} />
                          </div>
                          <div id="catarat-details">
                            <CataratDetailsView />
                          </div>

                          <div id="glucoma-details">
                            <GlucomaDetailsView />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="empty-row"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientDB
