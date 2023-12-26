
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import './signUp.css';
import myImage1 from './im4.jpeg';
import { useState } from "react";
import axios from "axios";

const SignUp = () => {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const leftSectionStyle = {
    backgroundImage: `url(${myImage1})`,
  };

  function isValidFormat(str) {
    // Define the regular expression
    const regex = /^MBBS\.\d{5}$/;

    // Test the string against the regular expression
    return regex.test(str);
  }

  const handleSignupClick = async () => {
    try {
      if (password === confirmPassword && isValidFormat(doctorId)) {
        const response = await axios.post('http://localhost:8080/register', {
          doctorId: doctorId,
          doctorFirstname: firstname,
          doctorLastname: lastname,
          doctorPassword: password
        })
        alert("register success")
        navigate('/')
      } else if (password !== confirmPassword && isValidFormat(doctorId)) {
        alert('Confirm Password is not matching')
      } else if (!isValidFormat(doctorId)) {
        alert('Invalid Credentials')
      }
    } catch (error) {
      console.error('Error: ' + error.message)
    }
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
          <div className="label">Firstname:</div>
          <div className="input">
            <input
              type="text"
              placeholder="First Name"
              id="firstname"
              className="lInput"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div className="label">Lastname:</div>
          <div className="input">
            <input
              type="text"
              placeholder="Last name"
              id="lastname"
              className="lInput"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
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
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="signup-text">
          <button type="submit" className="button" onClick={handleSignupClick}>
            Create an Account <FontAwesomeIcon icon={faCircleChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;