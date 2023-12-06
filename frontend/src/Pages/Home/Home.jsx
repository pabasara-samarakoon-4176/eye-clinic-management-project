import React from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard as faIdCardRegular,
  faEye,
  faCalendarCheck,
  faChartBar,
} from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './home.css';
import myImage1 from './im3.jpeg';
import myImage2 from './im1.jpeg';
import myImage3 from './im4.jpeg';
import myImage4 from './im5.jpeg';
const Home = () => {
  const navigate = useNavigate(); 

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  const handleButtonClick = (path) => {
    navigate(path); 
  };

  return (
   
    <div>
      <header className="header">
        <h1>INFORMATION MANAGEMENT SYSTEM</h1>
      </header>

      <div className="main-content">
        <div className="left-column">
        <h2 className='text1'>EYE CLINIC CENTER</h2>   
        <h2 className='text2'>BASE HOSPITAL TANGALLE</h2>   
        
        <p className='paragraph'>
        Step into efficiency with our dedicated admin web portal tailored exclusively for Tangalle Hospital Eye Clinic's distinguished doctors. Experience seamless management and enhanced collaboration for optimal patient care. Welcome to a new era of healthcare administration.</p>
           </div>

        <div className="right-column">
          <Slider {...sliderSettings}>
            <div className="slider-item"><img src={myImage1} alt="Slider Image 1" /></div>
            <div className="slider-item"><img src={myImage2} alt="Slider Image 2" /></div>
            <div className="slider-item"><img src={myImage3} alt="Slider Image 1" /></div>
            <div className="slider-item"><img src={myImage4} alt="Slider Image 1" /></div>
            
          </Slider>

          <div className="dot-slider">
          </div>
        </div>
      </div>

      <div className="bottom-buttons">
        <button onClick={() => handleButtonClick('/patientDB')}>
          <FontAwesomeIcon icon={faIdCardRegular} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Patient Details</div>
        </button>

        <button onClick={() => handleButtonClick('/lensDB')}>
          <FontAwesomeIcon icon={faEye} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Lens Stock Handling</div>
        </button>

        <button onClick={() => handleButtonClick('/surgeryDB')}>
          <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Appointment Handling</div>
        </button>

        <button onClick={() => handleButtonClick('/analyticsDB')}>
          <FontAwesomeIcon icon={faChartBar} style={{ fontSize: '1.5em' }} />
          <div className="button-name">Analytics</div>
        </button>
        
      </div>
    </div>
  );
}
export default Home;
