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
  const logout = () => {
    localStorage.setItem('isLoggedIn', false);
    localStorage.removeItem('token');
    navigate('/signin'); 
  };

  const isLogin = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="header">
      <h1 id='heading'>Tring Learning Platform</h1>
      {console.log(isLogin)}
      {!isLogin ? (
        <div className="btns">
        <button className='signup' onClick={signup}>Sign up</button>
        <button className='login' onClick={signin}>Sign in</button>
      </div>
      ):(
        <div className="btns">
        <button className='login' onClick={logout}>Logout</button>
      </div>
      )}
      
    </div>
  )
}
export default Headers;

