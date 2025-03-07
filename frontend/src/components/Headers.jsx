import React from 'react';
import './Headers.css';
import { useNavigate } from "react-router-dom"

function Headers() {

  
  const navigate=useNavigate();

  const signup=()=>{
      navigate('/Signup')
  }

   const signin=()=>{
      navigate('/Signin')
  }


  return (
    <div className="header">
      <h1 id='heading'>Tring Learning Platform</h1>
      <div className="btns">
        <button className='signup' onClick={signup}>Sign up</button>
        <button className='login' onClick={signin}>Sign in</button>
      </div>
    </div>
  )
}
export default Headers;

