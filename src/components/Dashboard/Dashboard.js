import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import useToken from '../App/useToken';
import Connection from './Connection/Connection';
import Snap from './Snap/Snap';

export default function Dashboard() {

  const navigate = useNavigate();
  const [resourceType, setResourceType] = useState('');
  const [connection, setShowConnection] = useState(false);
  const [snap, setShowSnap] = useState(false);
  const [main, setShowMain] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      if (!sessionStorage.getItem('token')) {
        navigate('/');
      }
    };

    checkToken();
  }, [navigate]);


  useEffect(() => {
    console.log('resourceType: ' + resourceType);
    if (resourceType == 'connection') {
      setShowConnection(true);
      setShowSnap(false);
      setShowMain(false);
      setResourceType('');
    } else if (resourceType == 'snap') {
      setShowConnection(false);
      setShowSnap(true);
      setShowMain(false);
      setResourceType('');
    } else if (resourceType == 'main') {
      setShowConnection(false);
      setShowSnap(false);
      setShowMain(true);
      setResourceType('')
    }
    console.log('connection: ' + connection);
    console.log('snap: ' + snap);
    console.log('main: ' + main);
  }, [resourceType]);

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="dashboard-wrapper">
      <h1>Dashboard</h1>
      <button onClick={() => setResourceType('main')}>W</button>
      <button onClick={() => setResourceType('connection')}>Connection</button>
      <button onClick={() => setResourceType('snap')}>Snap</button>

      <div className="display-block main-dashboard-wrapper">
        {main ? <div><h1>Welcome!</h1>
          <p><b>snapfu</b> - Is an application solution (API and Web portal) to create an automated way to call your application clie's export function/command to export your configuration.
            This is designed specifically, and currently, for Mirth Connect. But will do further enhancements if time permits.</p><br />
          <p><b>Connection</b> - In Mirth Connect context, you can enter your Mirth connection details here, 
              this will allow you to pull channel details that will be included in yoru backup and also set where the mccommand is located.</p><br />
          <p><b>Snap</b> - In Mirth Connect context, is the cron job that uses the Connection details, cron expression, and the backup folder you set. </p><br />
        </div> : ''}
        {connection ? <Connection /> : ''}
        {snap ? <Snap /> : ''}
      </div>

      <div className="footer-wrapper">
        <button className="sign-out-btn" onClick={handleSignOut} >Log Out</button>
      </div>

    </div>
  )
}