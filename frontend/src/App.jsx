import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import UserDashboard from './components/UserDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import VideoUpload from './components/VideoUpload.jsx'
import Videos from './components/Videos.jsx'
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/UserDashboard' element={<UserDashboard />} />
          <Route path='/AdminDashboard' element={<AdminDashboard />} />
          <Route path='/AdminDashboard/VideoUpload/:id' element={<VideoUpload />} />
          <Route path='/UserDashboard/Videos/:id' element={<Videos />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        pauseOnHover={false}
        hideProgressBar={true}
      />

    </>
  );
}

export default App;
