import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
} from "@fortawesome/free-solid-svg-icons";

const ExamDetailsView = () => {
    const imageUrl = null;
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
    )
}

export default ExamDetailsView