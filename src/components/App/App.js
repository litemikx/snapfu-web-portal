import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Dashboard from '../Dashboard/Dashboard';
import PageNotFound from '../PageNotFound/PageNotFound';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  return (
    <main className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Login />} />
          <Route path="signup" element={ <Signup />} />
          <Route path="dashboard" element={ <Dashboard />} />
          <Route path="*" element={ <PageNotFound /> } />
        </Routes>
      </BrowserRouter>
      <div className="app-footer">
        <p>snapfu x <FontAwesomeIcon icon={faMugHot} /> 2023</p>
      </div>
    </main>
  )
}

export default App;
