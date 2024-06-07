import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard as faIdCardRegular,
  faEye,
  faCalendarCheck
} from '@fortawesome/free-regular-svg-icons';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './home.css';
import myImage1 from './im3.jpeg';
import myImage2 from './im1.jpeg';
import myImage3 from './im4.jpeg';
import myImage4 from './im5.jpeg';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/home/${doctorId}`);
        if (res.data.Status !== "Success") {
          navigate('/');
        } else {
          console.log('working');
        }
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    verifyUser();
  }, [doctorId, navigate]);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    axios.post('http://localhost:8080/logout')
    .then(res => {
      window.location.reload()
    }).catch(error => console.log(error))
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <div>
      <header className="header">
        <h1>INFORMATION MANAGEMENT SYSTEM</h1>
      </header>

      <div className="main-content">
        <div className="left-column">
          <h2 className='text1'>EYE UNIT</h2>
          <h2 className='text2'>BASE HOSPITAL TANGALLE</h2>

          <p className='paragraph'>
            Step into efficiency with our dedicated admin web portal tailored exclusively for Tangalle Hospital Eye Clinic's distinguished doctors. Experience seamless management and enhanced collaboration for optimal patient care. Welcome to a new era of healthcare administration.
          </p>
        </div>

        <div className="right-column">
          <Slider {...sliderSettings}>
            <div className="slider-item"><img src={myImage1} alt="Slider Image 1" /></div>
            <div className="slider-item"><img src={myImage2} alt="Slider Image 2" /></div>
            <div className="slider-item"><img src={myImage3} alt="Slider Image 1" /></div>
            <div className="slider-item"><img src={myImage4} alt="Slider Image 1" /></div>
          </Slider>

          <div className="dot-slider"></div>
        </div>
      </div>

      <div className="bottom-buttons">
        <button onClick={() => handleButtonClick(`/${doctorId}/patientDB`)}>
          <FontAwesomeIcon icon={faIdCardRegular} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Patient Details</div>
        </button>

        <button onClick={() => handleButtonClick(`/${doctorId}/lensDB`)}>
          <FontAwesomeIcon icon={faEye} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Lens Stock Handling</div>
        </button>

        <button onClick={() => handleButtonClick(`/${doctorId}/surgeryDB`)}>
          <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Appointment Handling</div>
        </button>
      </div>

      <div className="bottom-buttons-logout">
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faPowerOff} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Logout</div>
        </button>


      </div>

      <footer className="footer">
        <p>&copy; 2024 Tangalle Base Hospital</p>
      </footer>
    </div>
  );
};

export default Home;
