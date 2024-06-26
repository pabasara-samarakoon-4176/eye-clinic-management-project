import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSearch,
  faCloudDownloadAlt
} from "@fortawesome/free-solid-svg-icons"
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios'

import "./surgeryDB.css"

const LensDB = () => {

  const { doctorId } = useParams()
  const navigate = useNavigate()

  const handleSurgeryHoursChange = (e) => setSurgeryHours(e.target.value);
  const handleSurgeryMinutesChange = (e) => setSurgeryMinutes(e.target.value);
  const handleSurgeryAMPMChange = (e) => setSurgeryAMPM(e.target.value);

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

  const [activeButton, setActiveButton] = useState("add")

  const [searchPatientId, setSearchPatientId] = useState('')
  const [searchSurgeryDetails, setSearchSurgeryDetails] = useState([])

  const [loading, setLoading] = useState(false)

  const [imageUrl, setImageUrl] = useState(null)

  const [patientImage, setPatientImage] = useState(null)

  const [description, setDescription] = useState('')
  const [docReport, setDocReport] = useState('')

  const handleButtonClick = (button) => {
    setActiveButton(button);
  }
  const hoursOptions = Array.from({ length: 12 }, (_, index) =>
    (index + 1).toString(),
  )
  const minutesOptions = Array.from({ length: 60 }, (_, index) =>
    index.toString().padStart(2, "0"),
  )

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

  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8080/create-report/${searchPatientId}`, {
        responseType: 'blob'
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `patient_report_${searchPatientId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      if (error.response.status === 404) {
        alert("Patient not found");
      } else {
        console.error(`${error.message}`);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/admin/viewappointmentdetails/${searchPatientId}`)
      setSearchSurgeryDetails(response.data)
      setPatientImage(response.data?.patientImage)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Patient not found");
      } else {
        console.error(`${error.message}`);
      }
    }
  }

  const formatDate = (dateString) => {
    if (dateString) {
      const dateParts = dateString.split("T")[0].split("-")
      return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
      alert(response.data.message)
      navigate(`/${doctorId}/home`)
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
      popperClassName="calendar-popper" // Add this line to apply a custom class to the calendar popper
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
                  <input
                    type="text"
                    id="name"
                    className="lInput"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
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
                      onChange={(e) => setSearchPatientId(e.target.value)}
                    />

                    <button
                      type="button"
                      className="search-icon"
                      onClick={() => handleSearchClick()}
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
                          {patientImage ? (
                            <img
                              src={`data:image/png;base64,${patientImage}`}
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
                          <span className="labelP">Patient Firstname:</span>
                          <span className="valueP">{searchSurgeryDetails?.patientFirstname}</span>
                        </div>

                        <div className="label-value-pair-P">
                          <span className="labelP">Patient Lastname:</span>
                          <span className="valueP">{searchSurgeryDetails?.patientLastname}</span>
                        </div>

                        <div className="label-value-pair-P">
                          <span className="labelP">Patient Contact No.:</span>
                          <span className="valueP">{searchSurgeryDetails?.patientContactNo}</span>
                        </div>

                        <div className="label-value-pair-P">
                          <span className="labelP">Surgery Date:</span>
                          <span className="valueP">{formatDate(searchSurgeryDetails?.surgeryDate)}</span>
                        </div>
                        <div className="label-value-pair-P">
                          <span className="labelP">Surgery Time:</span>
                          <span className="valueP">{searchSurgeryDetails?.surgeryTime}</span>
                        </div>
                        <div className="label-value-pair-P">
                          <span className="labelP">Lens:</span>
                          <span className="valueP">{searchSurgeryDetails?.surgeryLens}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="label-value-pair">
                  <span className="label">Description:</span>
                  <span className="value2">{searchSurgeryDetails?.description}</span>
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
                    onClick={handleDownload}
                    disabled={loading}
                  >
                    {loading ? 'Downloading...' : 'Download Report'}
                  </button>
                  <p>If need to look on Medical Details and Personal Detils , Click below button </p>
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
