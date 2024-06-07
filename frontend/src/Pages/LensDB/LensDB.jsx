// LensDB.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./lensDB.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const LensDB = () => {

  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [manufacturerOptions, setManufacturerOptions] = useState([])
  const [lensData, setLensData] = useState([])
  const [manufacturerMap, setManufacturerMap] = useState({})
  const [searchLensId, setSearchLensId] = useState('')
  const [searchLensData, setSearchLensData] = useState([])
  const [searchManufacturerId, setSearchManufacturerId] = useState('')

  const [batchNo, setBatchNo] = useState('')
  const [lensType, setLensType] = useState('')
  const [surgeryType, setSurgeryType] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [manufacturerId, setManufacturerId] = useState('')
  const [model, setModel] = useState('')
  const [power, setPower] = useState('')
  const [remarks, setRemarks] = useState('')
  const [expiryDate, setExpiryDate] = useState(null)
  const [manufactureDate, setManufactureDate] = useState(null)

  const [activeButton, setActiveButton] = useState("add")

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
    const fetchManufacturers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/viewmanufacturers');
        setManufacturerOptions(response.data)
        console.log([manufacturerOptions])
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
    };

    fetchManufacturers();
  }, []);

  useEffect(() => {
    try {
      setSearchManufacturerId(searchLensData[0][0]?.manufacturerId)
      console.log(searchManufacturerId)
    } catch (error) {
      console.error(error)
    }
  })

  useEffect(() => {
    const fetchLensData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/viewlens/NR.00000');
        setLensData(response.data);
        console.log([lensData])

      } catch (error) {
        console.error('Error fetching lens data:', error);
      }
    };

    fetchLensData();
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
    const nurseId = 'NR.00001'
    try {
      if (isValidBatchNo(batchNo)) {

        const response = await axios.post(`http://localhost:8080/addlens/${nurseId}`, {
          lensType: lensType,
          manufacturerId: manufacturerId,
          surgeryType: surgeryType,
          model: model,
          lensPower: power,
          expiryDate: expiryDate,
          manufactureDate: manufactureDate,
          batchNo: batchNo,
          remarks: remarks,
        })
        alert(response.data.message)
        navigate(`/${doctorId}/home`)
      } else {
        alert("Invalid batch number")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleAddClick = () => {
    setActiveButton("add");
  }
  const handleViewClick = () => {
    setActiveButton("view");
  }
  const handleSearchLensId = async (value) => {
    try {
      const response = await axios.get(`http://localhost:8080/searchlens/${value}`);
      if (response.data === "Lens not available") {
        alert("Lens not available")
      } else {
        setSearchLensData([response.data])
      }
      setSearchLensData([response.data]);
      console.log(response.data)
      console.log(manufacturerOptions[0])

    } catch (error) {
      console.error('Error fetching lens data:', error);

    }
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
              onClick={handleAddClick}
            >
              Add
            </button>
            <button
              className={`rounded-button ${activeButton === "view" ? "active" : ""}`}
              onClick={handleViewClick}
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
                    <option value="" disabled selected hidden>
                      Select Surgery Type
                    </option>
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
                    <option value="" disabled selected hidden>
                      Select Model
                    </option>
                    <option value="model1">Model 1</option>
                    <option value="model2">Model 2</option>
                    <option value="model3">Model 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="power" className="label">
                    Power:
                  </label>
                  <select id="power" className="lInput"
                    value={power} onChange={(e) => setPower(e.target.value)} >
                    <option value="" disabled selected hidden>
                      Select Lens Power
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    {Array.from({ length: 41 }, (_, index) => (
                      <option key={index} value={(index + 20) / 2}>
                        {(index + 20) / 2}
                      </option>
                    ))}
                  </select>
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
                      value={searchLensId}
                      onChange={(e) => setSearchLensId(e.target.value)}
                    />
                    <button
                      type="button"
                      className="search-icon"
                      onClick={() => handleSearchLensId(searchLensId)}
                    >
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{ fontSize: "1.5em", color: "#6FA1EE" }}
                      />
                    </button>
                  </div>
                  {searchLensData.length > 0 && (
                    <div className="column">
                      <div className="label-value-pair">
                        <span className="label">Lens ID:</span>
                        <span className="valueL">{searchLensData[0][0]?.lensId}</span>
                      </div>
                      <div className="label-value-pair">
                        <span className="label">Batch No:</span>
                        <span className="valueL">{searchLensData[0][0]?.batchNo}</span>
                      </div>
                      <div className="label-value-pair">
                        <span className="label">Surgery Type:</span>
                        <span className="valueL">{searchLensData[0][0]?.surgeryType}</span>
                      </div>
                    </div>
                  )}
                  {searchLensData.length > 0 && (
                    <div className="column">
                      <div className="label-value-pair">
                        <span className="label">Manufacturer:</span>
                        <span className="valueL">{searchLensData[0][0]?.manufacturerId}</span>
                        {/* <span className="valueL">{manufacturerMap[searchLensData[0][0]?.manufacturerId]}</span> */}
                      </div>
                      <div className="label-value-pair">
                        <span className="label">Model:</span>
                        <span className="valueL">{searchLensData[0][0]?.model}</span>
                      </div>
                      <div className="label-value-pair">
                        <span className="label">Power:</span>
                        <span className="valueL">{searchLensData[0][0]?.lensPower}</span>
                      </div>
                    </div>
                  )}
                  {searchLensData.length > 0 && (
                    <div className="column">
                      <div className="label-value-pair">
                        <span className="label">Expiry Date:</span>
                        <span className="valueL">{searchLensData[0][0]?.expiryDate}</span>
                      </div>
                      <div className="label-value-pair">
                        <span className="label">Manufacturing Date:</span>
                        <span className="valueL">{searchLensData[0][0]?.manufactureDate}</span>
                      </div>
                    </div>
                  )}
                  {searchLensData.length > 0 && (
                    <div className="column">
                      <div className="label-value-pair-R">
                        <span className="label">Remarks:</span>
                        <span className="valueR">{searchLensData[0][0]?.remarks}</span>
                      </div>
                    </div>
                  )}
                </div>
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

                      <th>Expiry Date</th>
                      <th>Manufactured Date</th>

                    </tr>
                  </thead>
                  <tbody>
                    {lensData.map((lens, index) => (
                      <tr key={index}>
                        <td>{lens.lensId}</td>
                        <td>{lens.batchNo}</td>
                        <td>{lens.surgeryType}</td>
                        <td>{lens.manufacturerId}</td>
                        {/* <td>{manufacturerMap[lens.manufacturerId]}</td> */}
                        <td>{lens.model}</td>
                        <td>{lens.lensPower}</td>
                        <td>{lens.remarks}</td>
                        <td>{lens.expiryDate}</td>
                        <td>{lens.manufactureDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>


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

