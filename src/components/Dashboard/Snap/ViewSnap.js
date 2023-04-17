


import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { faCircleStop, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-confirm-alert/src/react-confirm-alert.css';
// import StopSnap component
import StopSnap from './StopSnap';
// import StartSnap component
import StartSnap from './StartSnap';

var statusCode = '';

export default function ViewSnap({ view_snap_details }) {

    const navigate = useNavigate();
    const [snap_id, setSnapId] = useState('');
    const [name, setName] = useState('');
    const [create_date, setCreateDate] = useState('');
    const [cron_exp, setCronExp] = useState('');
    const [exec_path, setExecPath] = useState('');
    const [folder_path, setFolderPath] = useState('');
    const [server_os_type, setServerOsType] = useState('');
    const [status, setStatus] = useState('');
    const [channel_list, setChannelList] = useState(new Array());
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setErrorMessage] = useState(null);

    useEffect(() => {
        const checkToken = () => {
            if (!sessionStorage.getItem('token')) {
                navigate('/');
            }
        };

        checkToken();
    }, [navigate]);

    useEffect(() => {
        // map view_snap_details to state variables
        setSnapId(view_snap_details._id);
        setName(view_snap_details.name);
        setCreateDate(view_snap_details.created_date);
        setCronExp(view_snap_details.cron_expression);
        setExecPath(view_snap_details.exec_path);
        setFolderPath(view_snap_details.folder_path);
        setServerOsType(view_snap_details.server_os_type);
        setStatus(view_snap_details.status);
        setChannelList(view_snap_details.channels);
        setIsLoaded(true);
    }, [])

    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div className={snap_id}>
                <ul>
                    <li className="snap-details-container"><span>Status:</span> <span>{status}</span>
                        <span>{status == 'inactive' ? <FontAwesomeIcon icon={faCirclePlay} onClick={() => { StartSnap(snap_id); setStatus('active') }} /> : status == 'active' ? <FontAwesomeIcon icon={faCircleStop} onClick={() => { StopSnap(snap_id); setStatus('inactive') }} /> : null}
                    </span></li>
                    <li className="snap-details-container"><span>Create Date:</span> <span>{create_date}</span></li>
                    <li className="snap-details-container"><span>Cron Expression:</span> <span>{cron_exp}</span></li>
                    <li className="snap-details-container"><span>Execution Path:</span> <span>{exec_path}</span></li>
                    <li className="snap-details-container"><span>Folder Path:</span> <span>{folder_path}</span></li>
                    <li className="snap-details-container"><span>Server OS Type:</span> <span>{server_os_type}</span></li>
                    
                    { console.log('chan: ' + channel_list) }
                    <li className="snap-details-container">
                    <span>Channels: </span>
                    { channel_list.length > 0 ? 
                    <ul>
                    {
                        // check channel_list is not empty
                        
                        channel_list.map((c, index) => {
                            console.log('c: ' + c);
                            return <li className="snap-channel-list" key={c['_id'].toString()} >
                                <label>
                                    {c['name'].toString()}
                                </label>
                            </li>
                        })
                        
                    }
                    </ul>
                    : <span>All</span>
                    }
                    </li>
                </ul>

            </div>

        )
    }
}