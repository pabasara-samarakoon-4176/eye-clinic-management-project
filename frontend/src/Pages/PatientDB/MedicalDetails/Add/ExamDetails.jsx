import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "/Users/pabasarasamarakoon/eyeProject/frontend/src/Pages/PatientDB/patient.css";

const ExamDetails = () => {
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

    const handleAddEyeExamDetails = () => {
        
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
                    <div className="form-group button-group">
                        <button type="submit" className="button" onClick={handleAddEyeExamDetails}
                        >
                            Add Examination Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExamDetails