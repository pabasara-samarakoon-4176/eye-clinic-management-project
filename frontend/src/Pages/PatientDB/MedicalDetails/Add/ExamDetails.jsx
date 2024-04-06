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
import axios from "axios";
import "/Users/pabasarasamarakoon/eyeProject/frontend/src/Pages/PatientDB/patient.css";

const ExamDetails = ({ patientId }) => {
    const handleExamTimeHoursChange = (e) => setExamTimeHours(e.target.value);
    const handleExamTimeMinutesChange = (e) => setExamTimeMinutes(e.target.value);
    const handleExamTimeAMPMChange = (e) => setExamTimeAMPM(e.target.value);

    const [examDate, setExamDate] = useState(null);
    const [examTimeHours, setExamTimeHours] = useState(null);
    const [examTimeMinutes, setExamTimeMinutes] = useState(null);
    const [examTimeAMPM, setExamTimeAMPM] = useState(null);

    const hoursOptions = Array.from({ length: 12 }, (_, index) =>
        (index + 1).toString(),
    );
    const minutesOptions = Array.from({ length: 60 }, (_, index) =>
        index.toString().padStart(2, "0"),
    );
    // Exam Details
    // Right eye
    const [rightLids, setRightLids] = useState('')
    const [rightConjuitives, setRightConjuitives] = useState('')
    const [rightAC, setRightAC] = useState('')
    const [rightIris, setRightIris] = useState('')
    const [rightVitereous, setRightVitereous] = useState('')
    const [rightCornea, setRightCornea] = useState('')
    const [rightRetina, setRightRetina] = useState('')

    // Left eye
    const [leftLids, setLeftLids] = useState('')
    const [leftConjuitives, setLeftConjuitives] = useState('')
    const [leftAC, setLeftAC] = useState('')
    const [leftIris, setLeftIris] = useState('')
    const [leftVitereous, setLeftVitereous] = useState('')
    const [leftCornea, setLeftCornea] = useState('')
    const [leftRetina, setLeftRetina] = useState('')

    const handleAddEyeExamDetails = async (event) => {
        event.preventDefault()

        const doctorId = 'MBBS.00000'

        // date format modification
        const date = new Date(examDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        // time format modification
        let hours = Number(examTimeHours);
        if (examTimeAMPM === "PM" && hours !== 12) {
            hours += 12;
        }
        if (examTimeAMPM === "AM" && hours === 12) {
            hours = 0;
        }
        const formattedTime = `${String(hours).padStart(2, "0")}:${examTimeMinutes}:00`;

        try {
            const response = await axios.post(`http://localhost:8080/addexamdetails/${doctorId}`, {
                examDate: formattedDate,
                examTime: formattedTime,
                patientId: patientId,
                // right eye
                rightLids: rightLids,
                rightConjuitives: rightConjuitives,
                rightAC: rightAC,
                rightIris: rightIris,
                rightVitereous: rightVitereous,
                rightCornea: rightCornea,
                rightRetina: rightRetina,
                // left eye
                leftLids: leftLids,
                leftConjuitives: leftConjuitives,
                leftAC: leftAC,
                leftIris: leftIris,
                leftVitereous: leftVitereous,
                leftCornea: leftCornea,
                leftRetina: leftRetina
            })
            alert("Success added the exam details")
        } catch (error) {
            console.log(error)
        }
    }

    return (
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
                        <label htmlFor="leftEyeParameter2">
                            Lids:
                        </label>
                        <input
                            type="text"
                            id="leftEyeParameter2"
                            className="lInput"
                            placeholder="Enter Details"
                            value={rightLids}
                            onChange={(e) => setRightLids(e.target.value)}
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
                            placeholder="Enter Details"
                            value={rightConjuitives}
                            onChange={(e) => setRightConjuitives(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leftEyeParameter1">
                            AC:
                        </label>
                        <input
                            type="text"
                            id="leftEyeParameter1"
                            className="lInput"
                            placeholder="Enter Details"
                            value={rightAC}
                            onChange={(e) => setRightAC(e.target.value)}
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
                            placeholder="Enter Details"
                            value={rightIris}
                            onChange={(e) => setRightIris(e.target.value)}
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
                            placeholder="Enter Details"
                            value={rightVitereous}
                            onChange={(e) => setRightVitereous(e.target.value)}
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
                            placeholder="Enter Details"
                            value={rightCornea}
                            onChange={(e) => setRightCornea(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leftEyeParameter2">
                            Retina:
                        </label>
                        <input
                            type="text"
                            id="leftEyeParameter2"
                            className="lInput"
                            placeholder="Enter Details"
                            value={rightRetina}
                            onChange={(e) => setRightRetina(e.target.value)}
                        />
                    </div>
                </div>
                <div className="exam-details-column">
                    <p>
                        <b>Left Eye</b>
                    </p>

                    <div className="form-group">
                        <label htmlFor="leftEyeParameter2">
                            Lids:
                        </label>
                        <input
                            type="text"
                            id="leftEyeParameter2"
                            className="lInput"
                            placeholder="Enter Details"
                            value={leftLids}
                            onChange={(e) => setLeftLids(e.target.value)}
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
                            placeholder="Enter Details"
                            value={leftConjuitives}
                            onChange={(e) => setLeftConjuitives(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leftEyeParameter1">
                            AC:
                        </label>
                        <input
                            type="text"
                            id="leftEyeParameter1"
                            className="lInput"
                            placeholder="Enter Details"
                            value={leftAC}
                            onChange={(e) => setLeftAC(e.target.value)}
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
                            placeholder="Enter Details"
                            value={leftIris}
                            onChange={(e) => setLeftIris(e.target.value)}
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
                            placeholder="Enter Details"
                            value={leftVitereous}
                            onChange={(e) => setLeftVitereous(e.target.value)}
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
                            placeholder="Enter Details"
                            value={leftCornea}
                            onChange={(e) => setLeftCornea(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leftEyeParameter2">
                            Retina:
                        </label>
                        <input
                            type="text"
                            id="leftEyeParameter2"
                            className="lInput"
                            placeholder="Enter Details"
                            value={leftRetina}
                            onChange={(e) => setLeftRetina(e.target.value)}
                        />
                    </div>

                </div>
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
                            selected={examDate}
                            onChange={(date) =>
                                setExamDate(date)
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
                                value={examTimeHours || ""}
                                onChange={(e) =>
                                    handleExamTimeHoursChange(e)
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
                                value={examTimeMinutes || ""}
                                onChange={(e) =>
                                    handleExamTimeMinutesChange(e)
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
                                value={examTimeAMPM || ""}
                                onChange={(e) =>
                                    handleExamTimeAMPMChange(e)
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
            <div className="form-group button-group">
                <button type="submit" className="button" onClick={handleAddEyeExamDetails}
                >
                    Add Examination Details
                </button>
            </div>
        </div>
    )
}

export default ExamDetails