

const ClinicDetailsView = () => {
    return (
        <div className="exam-details-section">
            <div className="above-form-and-table">
                <p>
                    <b>CLINIC DETAILS</b>
                </p>
            </div>
            <div className="label-value-pair">
                <span className="label">Exam ID:</span>
                <span className="value"></span>
            </div>
            <div className="label-value-pair">
                <span className="label">Date:</span>
                <span className="value">
                </span>
            </div>
            <div className="label-value-pair">
                <span className="label">Time:</span>
                <span className="value"></span>
            </div>
        </div>
    )
}

export default ClinicDetailsView