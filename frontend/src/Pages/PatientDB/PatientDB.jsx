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

const PatientDB = () => {
  const [activeTab, setActiveTab] = useState("PERSONAL DETAILS");
  const [activeButton, setActiveButton] = useState("add");
  const [birthDate, setExpiryDate] = useState(null);
  const [age, setAge] = useState(null);

  const handleExamHoursChange = (e) => setExamHours(e.target.value);
  const handleExamMinutesChange = (e) => setExamMinutes(e.target.value);
  const handleExamAMPMChange = (e) => setExamAMPM(e.target.value);

  const [examDate, setExamDate] = useState(null);
  const [examHours, setExamHours] = useState(null);
  const [examMinutes, setExamMinutes] = useState(null);
  const [examAMPM, setExamAMPM] = useState(null);

  const [examId, setExamId] = useState("");
  const [complaintsRightEye, setComplaintsRightEye] = useState({
    pain: false,
    doubleVision: false,
    redEye: false,
    poorVision: false,
    allergies: "",
    description: "",
  });

  const [complaintsLeftEye, setComplaintsLeftEye] = useState({
    pain: false,
    doubleVision: false,
    redEye: false,
    poorVision: false,
    allergies: "",
    description: "",
  });

  const hoursOptions = Array.from({ length: 12 }, (_, index) =>
    (index + 1).toString(),
  );
  const minutesOptions = Array.from({ length: 60 }, (_, index) =>
    index.toString().padStart(2, "0"),
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (searchValue) => {
    console.log("Search value:", searchValue);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();

    if (
      today.getMonth() < birthDateObj.getMonth() ||
      (today.getMonth() === birthDateObj.getMonth() &&
        today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const imageUrl = null;

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
                  {activeButton === "add" && (
                    <form>
                      <div className="above-form-and-table">
                        <p>
                          <b>PERSONAL DETAILS</b>
                        </p>
                      </div>
                      <div className="form-group">
                        <label htmlFor="name" className="label">
                          Name:
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="lInput"
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="sex" className="label">
                          Gender:
                        </label>
                        <div className="sex-options">
                          <label>
                            <input type="radio" name="sex" value="female" />
                            Female
                          </label>
                          <label>
                            <input type="radio" name="sex" value="male" />
                            Male
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="birthday" className="label">
                          Birthday:
                        </label>
                        <div className="date-input1">
                          <DatePicker
                            selected={birthDate}
                            onChange={(date) => {
                              setExpiryDate(date);
                              const age = calculateAge(date);
                              setAge(age);
                            }}
                            placeholderText="Select date YYYY/MM/DD/"
                            className="lInput"
                            dateFormat="yyyy/MM/dd/"
                            portalId="your-unique-portal-id"
                          />
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            style={{
                              fontSize: "1.5em",
                              color: "#6FA1EE",
                              marginLeft: "0px",
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="age" className="label">
                          Age:
                        </label>
                        <input
                          type="text"
                          id="age"
                          className="lInput"
                          value={age !== null ? age : ""}
                          placeholder="Automatically calculated"
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="nicNumber" className="label">
                          NIC Number:
                        </label>
                        <input
                          type="text"
                          id="nicNumber"
                          className="lInput"
                          placeholder="Enter NIC number"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="patientId" className="label">
                          Patient ID:
                        </label>
                        <input
                          type="text"
                          id="patientId"
                          className="lInput"
                          placeholder="Enter patient ID"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contactNumber" className="label">
                          Contact Number:
                        </label>
                        <input
                          type="text"
                          id="contactNumber"
                          className="lInput"
                          placeholder="Enter contact number"
                        />
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
                        <label
                          htmlFor="imageUpload"
                          className="insert-image-text"
                        >
                          Upload Patient's Image
                          <FontAwesomeIcon
                            icon={faCloudUploadAlt}
                            style={{ fontSize: "1.5em", color: "#6FA1EE" }}
                            className="cloud-icon"
                          />
                        </label>
                        <input
                          type="file"
                          id="imageUpload"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const selectedImage = e.target.files[0];
                            console.log("Selected Image:", selectedImage);
                          }}
                        />
                        <button
                          type="button"
                          className="button-img"
                          onClick={() =>
                            document.getElementById("imageUpload").click()
                          }
                        >
                          Upload Image
                        </button>
                      </div>
                      <div className="form-group button-group">
                        <button type="submit" className="button">
                          Submit
                        </button>
                      </div>
                    </form>
                  )}

                  {activeButton === "view" && (
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
                        )}
                      </div>
                      <div className="label-value-pair">
                        <span className="label">Description:</span>
                        <span className="value2"></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="empty-row"></div>
            </div>
          </div>
        )}

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
                </div>
                <div className="right-panel">
                  {activeTab === "MEDICAL DETAILS" && (
                    <div>
                      <div className="content-container">
                        <div className="container">
                          <div className="right-panel">
                            {activeButton === "add" && (
                              <form>
                                <div className="above-form-and-table">
                                  <p>
                                    <b>MEDICAL DATA</b>
                                  </p>
                                </div>

                                <div className="form-group inline-form">
                                  <div className="label-input">
                                    <label htmlFor="examId" className="label">
                                      Exam ID:
                                    </label>
                                    <input
                                      type="text"
                                      id="examId"
                                      className="lInput"
                                      placeholder="Enter Exam ID"
                                    />
                                  </div>

                                  <div className="label-input">
                                    <label htmlFor="examDate" className="label">
                                      Date:
                                    </label>
                                    <div className="date-input">
                                      <DatePicker
                                        selected={examDate}
                                        onChange={(date) => setExamDate(date)}
                                        placeholderText="Select date"
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
                                  <div className="label-input">
                                    <div className="label-input">
                                      <label
                                        htmlFor="examTime"
                                        className="label"
                                      >
                                        Time:
                                      </label>
                                      <div className="time-input">
                                        <select
                                          id="hours"
                                          className="lInputt"
                                          value={examHours || ""}
                                          onChange={(e) =>
                                            handleExamHoursChange(e)
                                          }
                                        >
                                          <option value="" disabled>
                                            --
                                          </option>
                                          {hoursOptions.map((hour) => (
                                            <option key={hour} value={hour}>
                                              {hour}
                                            </option>
                                          ))}
                                        </select>

                                        <select
                                          id="minutes"
                                          className="lInputt"
                                          value={examMinutes || ""}
                                          onChange={(e) =>
                                            handleExamMinutesChange(e)
                                          }
                                        >
                                          <option value="" disabled>
                                            --
                                          </option>
                                          {minutesOptions.map((minute) => (
                                            <option key={minute} value={minute}>
                                              {minute}
                                            </option>
                                          ))}
                                        </select>

                                        <select
                                          id="ampm"
                                          className="lInputt"
                                          value={examAMPM || ""}
                                          onChange={(e) =>
                                            handleExamAMPMChange(e)
                                          }
                                        >
                                          <option value="" disabled>
                                            --
                                          </option>
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="exam-details-section">
                                  <div className="above-form-and-table">
                                    <p>
                                      <b>EXAM DETAILS</b>
                                    </p>
                                  </div>
                                  <div className="exam-details-columns">
                                    <div className="exam-details-column">
                                      <p>
                                        <b>Right Eye</b>
                                      </p>
                                      <div className="form-group">
                                        <label htmlFor="leftEyeParameter1">
                                          AC:
                                        </label>
                                        <input
                                          type="text"
                                          id="leftEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Parameter 1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="leftEyeParameter2">
                                          Lids:
                                        </label>
                                        <input
                                          type="text"
                                          id="leftEyeParameter2"
                                          className="lInput"
                                          placeholder="Enter Parameter 2"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter1">
                                          Conjuitive:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Parameter 1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter2">
                                          Iris:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter2"
                                          className="lInput"
                                          placeholder="Enter Parameter 2"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter1">
                                          Vitreous:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Parameter 1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter2">
                                          Cornea:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter2"
                                          className="lInput"
                                          placeholder="Enter Parameter 2"
                                        />
                                      </div>
                                    </div>
                                    <div className="exam-details-column">
                                      <p>
                                        <b>Left Eye</b>
                                      </p>
                                      <div className="form-group">
                                        <label htmlFor="leftEyeParameter1">
                                          AC:
                                        </label>
                                        <input
                                          type="text"
                                          id="leftEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Parameter 1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="leftEyeParameter2">
                                          Lids:
                                        </label>
                                        <input
                                          type="text"
                                          id="leftEyeParameter2"
                                          className="lInput"
                                          placeholder="Enter Parameter 2"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter1">
                                          Conjuitive:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Parameter 1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter2">
                                          Iris:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter2"
                                          className="lInput"
                                          placeholder="Enter Parameter 2"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter1">
                                          Vitreous:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Parameter 1"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter2">
                                          Cornea:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter2"
                                          className="lInput"
                                          placeholder="Enter Parameter 2"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

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
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter1">
                                          Alergies:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Alegies"
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
                                          onChange={(e) => {
                                            const selectedImage =
                                              e.target.files[0];
                                            console.log(
                                              "Selected Image:",
                                              selectedImage,
                                            );
                                          }}
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
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="rightEyeParameter1">
                                          Alergies:
                                        </label>
                                        <input
                                          type="text"
                                          id="rightEyeParameter1"
                                          className="lInput"
                                          placeholder="Enter Alegies"
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
                                          onChange={(e) => {
                                            const selectedImage =
                                              e.target.files[0];
                                            console.log(
                                              "Selected Image:",
                                              selectedImage,
                                            );
                                          }}
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
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group button-group">
                                  <button type="submit" className="button">
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
                                onChange={(e) => handleSearch(e.target.value)}
                              />
                              <button
                                type="button"
                                className="search-icon"
                                onClick={() => handleSearch()}
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
                          {/* Display summarized medical details */}
                          <div className="label-value-pair">
                            <span className="label">Exam ID:</span>
                            <span className="value"></span>
                          </div>
                          <div className="label-value-pair">
                            <span className="label">Date:</span>
                            <span className="value">
                              {/* Render summarized right eye complaints here */}
                            </span>
                          </div>
                          <div className="label-value-pair">
                            <span className="label">Time:</span>
                            <span className="value">
                            </span>
                          </div>

                          <div className="label-value-pair">
                            <span className="label">Right Eye Complaints:</span>
                            <span className="value">
                            </span>
                          </div>

                          <div className="label-value-pair">
                            <span className="label">Left Eye Complaints:</span>
                            <span className="value">
                            </span>
                          </div>
                          <div className="label-value-pair">
                            <span className="label">Alergies:</span>
                            <span className="value">
                            </span>
                          </div>

                          <div className="label-value-pair">
                            <span className="label">Description:</span>
                            <span className="value">
                            </span>
                          </div>
                          <div className="exam-details-section">
                            <div className="above-form-and-table">
                              <p>
                                <b>EXAM DETAILS</b>
                              </p>
                            </div>
                            <div className="exam-details-columns">
                              <div className="exam-details-column">
                                <p>
                                  <b>Right Eye</b>
                                </p>

                                <div className="label-value-pair eye-image-section">
                                  <span className="label">
                                    Right Eye Image:
                                  </span>
                                  <div className="eye-image-container">
                                    {imageUrl ? (
                                      <img
                                        src={imageUrl}
                                        alt="Right Eye"
                                        className="eye-image"
                                      />
                                    ) : (
                                      <div className="eye-icon">
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          size="4x"
                                          color="#6FA1EE"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="leftEyeParameter1">AC:</label>
                                  <input
                                    type="text"
                                    id="leftEyeParameter1"
                                    className="lInput"
                                    placeholder="Enter Parameter 1"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="leftEyeParameter2">
                                    Lids:
                                  </label>
                                  <input
                                    type="text"
                                    id="leftEyeParameter2"
                                    className="lInput"
                                    placeholder="Enter Parameter 2"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter1">
                                    Conjuitive:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter1"
                                    className="lInput"
                                    placeholder="Enter Parameter 1"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter2">
                                    Iris:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter2"
                                    className="lInput"
                                    placeholder="Enter Parameter 2"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter1">
                                    Vitreous:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter1"
                                    className="lInput"
                                    placeholder="Enter Parameter 1"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter2">
                                    Cornea:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter2"
                                    className="lInput"
                                    placeholder="Enter Parameter 2"
                                  />
                                </div>
                              </div>
                              <div className="exam-details-column">
                                <p>
                                  <b>Left Eye</b>
                                </p>

                                <div className="label-value-pair eye-image-section">
                                  <span className="label">
                                    Right Eye Image:
                                  </span>
                                  <div className="eye-image-container">
                                    {imageUrl ? (
                                      <img
                                        src={imageUrl}
                                        alt="Right Eye"
                                        className="eye-image"
                                      />
                                    ) : (
                                      <div className="eye-icon">
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          size="4x"
                                          color="#6FA1EE"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="leftEyeParameter1">AC:</label>
                                  <input
                                    type="text"
                                    id="leftEyeParameter1"
                                    className="lInput"
                                    placeholder="Enter Parameter 1"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="leftEyeParameter2">
                                    Lids:
                                  </label>
                                  <input
                                    type="text"
                                    id="leftEyeParameter2"
                                    className="lInput"
                                    placeholder="Enter Parameter 2"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter1">
                                    Conjuitive:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter1"
                                    className="lInput"
                                    placeholder="Enter Parameter 1"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter2">
                                    Iris:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter2"
                                    className="lInput"
                                    placeholder="Enter Parameter 2"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter1">
                                    Vitreous:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter1"
                                    className="lInput"
                                    placeholder="Enter Parameter 1"
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="rightEyeParameter2">
                                    Cornea:
                                  </label>
                                  <input
                                    type="text"
                                    id="rightEyeParameter2"
                                    className="lInput"
                                    placeholder="Enter Parameter 2"
                                  />
                                </div>
                              </div>
                            </div>
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
  );
};

export default PatientDB;
