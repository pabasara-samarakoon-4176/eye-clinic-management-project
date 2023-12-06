
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import './signUp.css';
import myImage1 from './im4.jpeg';

const SignUp = () => {
  const navigate = useNavigate();

  const leftSectionStyle = {
    backgroundImage: `url(${myImage1})`,
  };

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div className="signUp-container">
       <div className="left-column" style={leftSectionStyle}>
     
      </div>
      <div className="right-column">
        <div className="header-text">
          <h2>EYE CLINIC CENTER</h2>
        </div>
        <div className="subheader-text">
          <p>BASE HOSPITAL TANGALLE</p>
        </div>

          <div className="form-group">
            <div className="label">Doctor Name:</div>
            <div className="input">
              <input
                type="text"
                placeholder="Name with initials"
                id="doctorName"
                className="lInput"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="label">Doctor ID:</div>
            <div className="input">
              <input
                type="text"
                placeholder="MBBS.xxxxx"
                id="doctorID"
                className="lInput"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="label">Username:</div>
            <div className="input">
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="lInput"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label">Password:</div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="lInput"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label">Confirm Password:</div>
            <div className="input">
              <input
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                className="lInput"
              />
            </div>
          </div>

        <div className="signup-text">
          <button type="submit" className="button" onClick={handleLoginClick}>
            Create an Account <FontAwesomeIcon icon={faCircleChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;