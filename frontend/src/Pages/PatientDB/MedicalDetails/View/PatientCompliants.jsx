

const PatientComplaintsView = () => {
    return (
        <div className="exam-details-section">
            <div className="above-form-and-table">
                <p>
                    <b>PATIENT COMPLAINTS</b>
                </p>
            </div>
            <div className="label-value-pair">
                <span className="label">
                    Right Eye Complaints:
                </span>
                <span className="value"></span>
            </div>

            <div className="label-value-pair">
                <span className="label">
                    Left Eye Complaints:
                </span>
                <span className="value"></span>
            </div>
            <div className="label-value-pair">
                <span className="label">Alergies:</span>
                <span className="value"></span>
            </div>

            <div className="label-value-pair">
                <span className="label">Description:</span>
                <span className="value"></span>
            </div>
        </div>
    )
}

export default PatientComplaintsView