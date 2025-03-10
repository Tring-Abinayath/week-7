import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Headers from './components/Headers.jsx';
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import UserDashboard from './components/UserDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

import './App.css';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Headers />} />
          <Route path='/Signin' element={<Signin />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/UserDashboard' element={<UserDashboard />} />
          <Route path='/AdminDashboard' element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
