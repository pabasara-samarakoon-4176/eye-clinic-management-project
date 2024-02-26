// LensDB.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./lensDB.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const LensDB = () => {

  const navigate = useNavigate();
  const [manufacturerOptions, setManufacturerOptions] = useState([]);

  const [batchNo, setBatchNo] = useState('');
  const [lensType, setLensType] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [model, setModel] = useState('');
  const [power, setPower] = useState('');
  const [remarks, setRemarks] = useState('');
  const [placementLocation, setPlacementLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [manufactureDate, setManufactureDate] = useState(null);

  const [activeButton, setActiveButton] = useState("add");

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/viewmanufacturers');
        setManufacturerOptions(response.data);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
    };

    fetchManufacturers();
  }, []);

  function isValidBatchNo(str) {
    // Define the regular expression
    const regex = /^[A-Z]{2}-\d{4}$/;

    // Test the string against the regular expression
    return regex.test(str);
  }

  const handleSubmitClick = async (event) => {
    event.preventDefault();
    // setActiveButton(button);
    const nurseId = 'NR.00000'
    const manuId = 'AB'
    try {
      if (isValidBatchNo(batchNo)) {

        const response = await axios.post(`http://localhost:8080/addlens/${nurseId}`, {
          lensType: lensType,
          manufacturerId: manufacturerId,
          surgeryType: surgeryType,
          model: model,
          lensPower: power,
          placementLocation: placementLocation,
          expiryDate: expiryDate,
          manufactureDate: manufactureDate,
          batchNo: batchNo,
          remarks: remarks,
        })
        // console.log(response)
        alert(manuId)
        navigate('/home')
      } else {
        alert("Invalid batch number")
      }
    } catch (error) {
      console.log(error)
    }
  };
  const handleSearchLensId = (value) => {

  };
  return (
    <div>
      <header className="header">
        <h1>Lens Handling Dashboard</h1>
      </header>
      <div className="extra-blue-bar"></div>
      <div className="content-container">
        <div className="container">
          <div className="left-panel">
            <button
              className={`rounded-button ${activeButton === "add" ? "active" : ""}`}
              onClick={() => handleSubmitClick("add")}
            >
              Add
            </button>
            <button
              className={`rounded-button ${activeButton === "view" ? "active" : ""}`}
              onClick={() => handleSubmitClick("view")}
            >
              View
            </button>
          </div>
          <div className="right-panel">
            {activeButton === "add" && (
              <form>
                <div className="above-form-and-table">
                  <p>
                    <b>LENS DATA.</b>
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="batchNo" className="label">
                    Batch No:
                  </label>
                  <input
                    type="text"
                    id="batchNo"
                    className="lInput"
                    placeholder="Type batch number"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lensType" className="label">
                    Lens Type:
                  </label>
                  <input
                    type="text"
                    id="lensID"
                    className="lInput"
                    placeholder="Type Lens Type"
                    value={lensType}
                    onChange={(e) => setLensType(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="surgeryType" className="label">
                    Surgery Type:
                  </label>
                  <select id="surgeryType"
                    className="lInput"
                    value={surgeryType}
                    onChange={(e) => setSurgeryType(e.target.value)}>
                    <option value="cataract">Cataract</option>
                    <option value="glaucoma">Glaucoma</option>
                    <option value="retina">Retina</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="manufacturer" className="label">
                    Manufacturer:
                  </label>
                  <select
                    id="manufacturer"
                    className="lInput"
                    value={manufacturer}
                    onChange={(e) => setManufacturerId(e.target.value)}
                  >
                    <option value="">Select a manufacturer</option>
                    {manufacturerOptions.map((manufacturer) => (
                      <option key={manufacturer.manuId} value={manufacturer.manuId}>
                        {manufacturer.manuName}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="form-group">
                  <label htmlFor="model" className="label">
                    Model:
                  </label>
                  <select id="model" className="lInput"
                    value={model} onChange={(e) => setModel(e.target.value)}>
                    <option value="model1">Model 1</option>
                    <option value="model2">Model 2</option>
                    <option value="model3">Model 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="power" className="label">
                    Power:
                  </label>
                  <input
                    type="text"
                    id="power"
                    className="lInput"
                    placeholder="Power of the lens"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="remarks" className="label">
                    Remarks:
                  </label>
                  <textarea
                    id="remarks"
                    className="lInput"
                    placeholder="Type remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="placementLocation" className="label">
                    Placing Location:
                  </label>
                  <select id="placementLocation" className="lInput"
                    value={placementLocation}
                    onChange={(e) => setPlacementLocation(e.target.value)}>
                    <option value="location1">Location 1</option>
                    <option value="location2">Location 2</option>
                    <option value="location3">Location 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDate" className="label">
                    Expiry Date:
                  </label>
                  <div className="date-input">
                    <DatePicker
                      selected={expiryDate}
                      onChange={(date) => setExpiryDate(date)}
                      placeholderText="Select date"
                      className="lInput"
                      dateFormat="MM/dd/yyyy"
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{
                        fontSize: "1.5em",
                        color: "#6FA1EE",
                        marginLeft: "2px",
                      }}
                    />
                  </div>
                </div>


                <div className="form-group">
                  <label htmlFor="ManufactureDate" className="label">
                    Manaufactured Date:
                  </label>
                  <div className="date-input">
                    <DatePicker
                      selected={manufactureDate}
                      onChange={(date) => setManufactureDate(date)}
                      placeholderText="Select date"
                      className="lInput"
                      dateFormat="MM/dd/yyyy"
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      style={{ fontSize: "1.5em", color: "#6FA1EE" }}
                    />
                  </div>
                </div>
                <div className="form-group button-group">
                  <button type="submit" className="button"
                    onClick={handleSubmitClick}>
                    Submit
                  </button>
                </div>
              </form>
            )}

            {activeButton === "view" && (
              <div>
                <div className="above-form-and-table">
                  <p>
                    <b>LENS DATA SUMMARIZED</b>
                  </p>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Lens ID</th>
                      <th>Batch No</th>

                      <th>Surgery Type</th>
                      <th>Manufacturer</th>

                      <th>Model</th>
                      <th>Power</th>
                      <th>Remarks</th>
                      <th>Placing Location</th>

                      <th>Expiry Date</th>
                      <th>Manufac Date</th>

                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <tr key={index}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Search section for LensID */}
                <div className="search-section">
                  <div className="search-header">
                    <p>
                      <b>SEARCH LENS</b>
                    </p>
                  </div>
                  <div className="search-input">
                    <input
                      type="text"
                      id="searchLensId"
                      className="lInput"
                      placeholder="Enter Lens ID"
                      onChange={(e) => handleSearchLensId(e.target.value)}
                    />
                    <button
                      type="button"
                      className="search-icon"
                      onClick={() => handleSearchLensId()}
                    >
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{ fontSize: "1.5em", color: "#6FA1EE" }}
                      />
                    </button>
                  </div>
                  <div className="column">
                    <div className="label-value-pair">
                      <span className="label">Lens ID:</span>
                      <span className="valueL"></span>
                    </div>
                    <div className="label-value-pair">
                      <span className="label">Batch No:</span>
                      <span className="valueL"></span>
                    </div>
                    <div className="label-value-pair">
                      <span className="label">Surgery Type:</span>
                      <span className="valueL"></span>
                    </div>
                  </div>
                  <div className="column">
                    <div className="label-value-pair">
                      <span className="label">Manufacturer:</span>
                      <span className="valueL"></span>
                    </div>
                    <div className="label-value-pair">
                      <span className="label">Model:</span>
                      <span className="valueL"></span>
                    </div>
                    <div className="label-value-pair">
                      <span className="label">Power:</span>
                      <span className="valueL"></span>
                    </div>
                  </div>
                  <div className="column">
                    <div className="label-value-pair">
                      <span className="label">Placing Location:</span>
                      <span className="valueL"></span>
                    </div>
                    <div className="label-value-pair">
                      <span className="label">Expiry Date:</span>
                      <span className="valueL"></span>
                    </div>
                    <div className="label-value-pair">
                      <span className="label">Manufacturing Date:</span>
                      <span className="valueL"></span>
                    </div>
                  </div>
                  <div className="column">
                    <div className="label-value-pair-R">
                      <span className="label">Remarks:</span>
                      <span className="valueR"></span>
                    </div>
                  </div>
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
