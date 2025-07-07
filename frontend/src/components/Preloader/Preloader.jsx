import React from 'react'
import './Preloader.scss'
import logo from '../../Assets/img/Logo.png';

const Preloader = () => {
  return (
    <div className="preloader-container">
    <div className="preloader-wrapper">
      <div className="rotating-border"></div>
      <img
        src={logo} // Replace with your logo path
        alt="Loading..."
        className="preloader-logo bg-transparent rounded-[50%]"
      />
    </div>
  </div>
  )
}

export default Preloader
