import { useEffect, useState } from "react";
import axios from "axios";

const ExamDetailsView = ({patientId}) => {

    const [searchExaminationData, setSearchExaminationData] = useState([])

    useEffect(() => {
        const fetchExaminationData = async (value) => {
            try {
                const response = await axios.get(`http://localhost:8080/searcheyeexamination/${value}`)
                setSearchExaminationData([response.data])
            } catch (error) {
                console.log(`${error.message}`)
            }
        }
        if(patientId) {
            fetchExaminationData(patientId)
        } else {
            console.log('No patient Id')
        }
    }, [patientId])
    
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
                        <span className="value">{searchExaminationData[0]?.[0]?.rightLids}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Conjuitive:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.rightConjuitive}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="leftEyeParameter1">
                            AC:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.rightAC}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter2">
                            Iris:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.rightIris}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Vitereous:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.rightVitereous}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter2">
                            Cornea:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.rightCornea}</span>
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
                        <span className="value">{searchExaminationData[0]?.[0]?.leftLids}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Conjuitive:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.leftConjuitive}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="leftEyeParameter1">
                            AC:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.leftAC}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter2">
                            Iris:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.leftIris}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter1">
                            Vitereous:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.leftVitereous}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rightEyeParameter2">
                            Cornea:
                        </label>
                        <span className="value">{searchExaminationData[0]?.[0]?.leftCornea}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExamDetailsView