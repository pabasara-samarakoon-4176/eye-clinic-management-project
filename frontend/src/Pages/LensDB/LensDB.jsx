// LensDB.jsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './lensDB.css';

const LensDB = () => {
  const [activeButton, setActiveButton] = useState('add');
  const [expiryDate, setExpiryDate] = useState(null);

  const handleButtonClick = (button) => {
    setActiveButton(button);
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
              className={`rounded-button ${activeButton === 'add' ? 'active' : ''}`}
              onClick={() => handleButtonClick('add')}
            >
              Add
            </button>
            <button
              className={`rounded-button ${activeButton === 'view' ? 'active' : ''}`}
              onClick={() => handleButtonClick('view')}
            >
              View
            </button>
          </div>
          <div className="right-panel">
            {activeButton === 'add' && (
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
                      placeholder="Type batch number"/>
                      </div>
                <div className="form-group">
                  <label htmlFor="lensType" className="label">
                    Type of Lens:
                  </label>
                  <select id="lensType" className="lInput">
                    <option value="cornea">Cornea</option>
                    <option value="crystalline">Crystalline Lens</option>
                    <option value="vitreous">Vitreous Humor</option>
                    <option value="aqueous">Aqueous Humor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="lensSize" className="label">
                    Size:
                  </label>
                  <select id="lensSize" className="lInput">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="brandName" className="label">
                    Brand Name:
                  </label>
                  <select id="brandName" className="lInput">
                    <option value="brand1">Brand 1</option>
                    <option value="brand2">Brand 2</option>
                    <option value="brand3">Brand 3</option>
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
                      style={{ fontSize: '1.5em', color: '#6FA1EE', marginLeft: '2px' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="manufacturedDate" className="label">
                    Manufactured Date:
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
                      style={{ fontSize: '1.5em', color: '#6FA1EE' }}
                    />
                  </div>
                </div>

                <div className="form-group button-group">
                  <button type="submit" className="button">
                    Submit
                  </button>
                </div>
              </form>
            )}

            {activeButton === 'view' && (
              <div>
                <div className="above-form-and-table">
                  <p>
                    <b>LENS DATA SUMMARIZED</b>
                  </p>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Batch No</th>
                      <th>Type </th>
                      <th>Size</th>
                      <th>Brand</th>
                      <th>Expiry Date</th>
                      <th>Manufac Date</th>
                      <th>Column 7</th>
                      {/* Add more table headers as needed */}
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
                        {/* Add more empty cells as needed */}
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
