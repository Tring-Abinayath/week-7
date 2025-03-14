import React from 'react';
import './Headers.css';
import { useNavigate } from "react-router-dom"
import lms_logo from '../assets/tring_lms_logo.png'
import { MdExitToApp } from 'react-icons/md';


function Headers() {


  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };


  return (

    <div className='adminHeader'>
      <img src={lms_logo} width={"120px"} height={"100px"}></img>
      <button onClick={handleLogout}> <MdExitToApp size={20} /> </button>
    </div>
  )
}
export default Headers;

