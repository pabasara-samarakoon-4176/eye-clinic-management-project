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
import "/Users/pabasarasamarakoon/eyeProject/frontend/src/Pages/PatientDB/patient.css";

const ClinicDetails = () => {

    const handleClinicHoursChange = (e) => setClinicHours(e.target.value);
    const handleClinicMinutesChange = (e) => setClinicMinutes(e.target.value);
    const handleClinicAMPMChange = (e) => setClinicAMPM(e.target.value);

    const [clinicDate, setClinicDate] = useState(null);
    const [clinicHours, setClinicHours] = useState(null);
    const [clinicMinutes, setClinicMinutes] = useState(null);
    const [clinicAMPM, setClinicAMPM] = useState(null);
    const [clinicConsultantId, setClinicConsultantId] = useState('');

    const hoursOptions = Array.from({ length: 12 }, (_, index) =>
        (index + 1).toString(),
    );
    const minutesOptions = Array.from({ length: 60 }, (_, index) =>
        index.toString().padStart(2, "0"),
    );

    return (
        <div className="exam-details-section">
            <div className="above-form-and-table">
                <p>
                    <b>CLINIC DETAILS</b>
                </p>
            </div>
            <div className="form-group inline-form">


                <div className="label-input">
                    <label
                        htmlFor="clinicDate"
                        className="label"
                    >
                        Date:
                    </label>
                    <div className="date-input">
                        <DatePicker
                            selected={clinicDate}
                            onChange={(date) =>
                                setClinicDate(date)
                            }
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
                                value={clinicHours || ""}
                                onChange={(e) =>
                                    handleClinicHoursChange(e)
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
                                value={clinicMinutes || ""}
                                onChange={(e) =>
                                    handleClinicMinutesChange(e)
                                }
                            >
                                <option value="" disabled>
                                    --
                                </option>
                                {minutesOptions.map((minute) => (
                                    <option
                                        key={minute}
                                        value={minute}
                                    >
                                        {minute}
                                    </option>
                                ))}
                            </select>

                            <select
                                id="ampm"
                                className="lInputt"
                                value={clinicAMPM || ""}
                                onChange={(e) =>
                                    handleClinicAMPMChange(e)
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
            <div className="form-group inline-form">
                <div className="label-input">
                    <label
                        htmlFor="docId"
                        className="label"
                    >
                        Consultant Id:
                    </label>
                    <input
                        type="text"
                        id="docId"
                        className="lInput"
                        placeholder="Enter Consultant's Id"
                        value={clinicConsultantId}
                        onChange={(e) => setClinicConsultantId(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClinicDetails