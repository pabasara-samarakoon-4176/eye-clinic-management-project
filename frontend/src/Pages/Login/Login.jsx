import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import myImage1 from './im4.jpeg';
import axios from 'axios';
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  axios.defaults.withCredentials = true

  const leftSectionStyle = {
    backgroundImage: `url(${myImage1})`,
  };

  function isValidFormat(str) {
    // Define the regular expression
    const regex = /^MBBS\.\d{5}$/;

    // Test the string against the regular expression
    return regex.test(str);
  }

  const handleSubmit = async () => {

    try {

      if (isValidFormat(username)) {
        const response = await axios.post('http://localhost:8080/login', {
          doctorId: username,
          password: password
        });

        console.log(response);

        if (response.data.status === 'Success') {
          navigate(`/${response.data.doctorId}/home`);
        } else if (response.data === 'Fail') {
          alert('login failed')
        } else if (response.data === "User not found") {
          alert("User not found")
        }

      } else {
        alert('login failed');
      }



    } catch (error) {
      console.error('Error during login', error);
    }
  }
  const handleLoginClick = () => {
    navigate('/signUp');
  }
  const handleLoginClick2 = () => {
    navigate('/home');
  };
  return (
    <div className="login-container">
      <div className="header-row">
        <h1 className="header-text">HOSPITAL INFORMATION MANAGEMENT SYSTEM</h1>
      </div>
      <div className="row"><div className="left-column" style={leftSectionStyle}>
      </div>
        <div className="right-column">
          <div className="header-text">
            <h2>EYE CLINIC CENTER</h2>
          </div>
          <div className="subheader-text">
            <p className="subheader-text">BASE HOSPITAL TANGALLE</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group1">
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="lInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group1">
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="lInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          <div >
            <button type="submit" className="button1" onClick={handleSubmit}>
              Login <FontAwesomeIcon icon={faCircleChevronRight} />
            </button>

            <p className="signup-text">Don't have an account?</p>

            <button type="submit" className="button2" onClick={handleLoginClick}>
              Sign Up <FontAwesomeIcon icon={faCircleChevronRight} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
