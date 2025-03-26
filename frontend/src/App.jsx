import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './pages/signup/Signup.jsx';
import Signin from './pages/signin/Signin.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import VideoUpload from './components/uploadVideo/VideoUpload.jsx'
import Videos from './components/videoList/Videos.jsx'
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
        autoClose={1500}
        pauseOnHover={false}
        hideProgressBar={true}
      />

    </>
  );
}

export default App;
