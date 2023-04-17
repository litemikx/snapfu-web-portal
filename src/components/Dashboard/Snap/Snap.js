import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { faPenSquare, faTrash, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ViewSnap from './ViewSnap';

var api_host = process.env.REACT_APP_API_URL;
var statusCode = '';

export default function Snap() {

    const navigate = useNavigate();
    const [snapActionType, setSnapActionType] = useState('');
    const [get_snap, setShowGetSnap] = useState(true);
    const [view_snap, setShowViewSnap] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    //const [deleteSnap, setToDeleteSnap] = useState(null);
    const [deleteStatu, setDeleteStatus] = useState(false);
    const [updateRecord, setUpdateRecord] = useState('');

    const [error, setErrorMessage] = useState(null);

    const [list_snaps, setSnapsList] = useState('');

    const [view_this_snap, setViewThisSnap] = useState({});

    const [jobs, setJobsList] = useState({});


    // get jobs from /api/snaps/jobs
    async function getJobList() {
        var token = JSON.parse(sessionStorage.getItem('token'))['token'];

        return fetch(api_host + '/api/snaps/jobs', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': token
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            setJobsList(data);
            console.log(data);
        }, (error) => {
            console.log(error);
        })
    }

    async function getSnapList() {
        var token = JSON.parse(sessionStorage.getItem('token'))['token'];

        return fetch(api_host + '/api/snaps', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': token
            }
        }).then((res) => {
            statusCode = res.status;
            return res.json();
        }).then((data) => {
            setIsLoaded(true);
            setSnapsList(data);
            console.log(data);
        }, (error) => {
            setIsLoaded(true);
            setErrorMessage(error);
        })
    }

    function confirmDelete(deleteSnap) {
        confirmAlert({
            customUI: ({ onClose}) => {
                return (
                <div className="custom-ui">
                <h1>Confirm to delete</h1>
                <p>Are you sure you want to delete this Snap? This cannot be undone.</p>
                <button onClick={() => { deleteSnapItem(deleteSnap); onClose(); }}>Yes</button>
                <button onClick={() => { getSnapList(); getJobList(); onClose(); }}>No</button>
                </div>
                )
            }
        })
    }

    async function deleteSnapItem(deleteSnap) {

        var token = JSON.parse(sessionStorage.getItem('token'))['token'];

        return fetch(api_host + '/api/snaps/delete/' + deleteSnap._id, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': token
            }
        }).then((res) => {
            statusCode = res.status;
            return res.json();
        }).then((data) => {
            setDeleteStatus(true);
            getSnapList();
            getJobList();
            console.log(data);
        }, (error) => {
            setDeleteStatus(true);
            setErrorMessage(error);
        })
    }

    useEffect(() => {
        const checkToken = () => {
            if (!sessionStorage.getItem('token')) {
                navigate('/');
            }
        };

        checkToken();
    }, [navigate]);

    useEffect(() => {
        getSnapList();
        getJobList();
    }, [])

    useEffect(() => {
        if (snapActionType == 'get_snap') {
            setShowGetSnap(true);
            getSnapList();
            getJobList();
        } else if (snapActionType == 'view_snap') {
            setShowGetSnap(false);
            setShowViewSnap(true)
        }
    }, [snapActionType]);

    if (error) {
        return <div>Error: {error} </div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        if (get_snap) {
            return (
                <div className="snap-wrapper">
                    <h1>Snap</h1>
                    <ul>
                        {list_snaps.map(function (snap) {
                            return <li className="item" key={snap._id}>
                                <div className="snap-item-list">
                                    <div>
                                        <span><label>{snap.name}</label></span>
                                    </div>
                                    <div>
                                        <span><FontAwesomeIcon icon={faTrash} onClick={() => confirmDelete(snap)} /></span>
                                        <span><FontAwesomeIcon icon={faArrowUpRightFromSquare} onClick={() => {
                                            setSnapActionType('view_snap'); setViewThisSnap(snap)
                                        }} /></span>

                                        {console.log('job: ' + typeof (jobs[snap._id]))}
                                        {jobs[snap._id] == true ? <span className="job-status">Running</span>
                                            : jobs[snap._id] == false ? <span className="job-status">Starting</span>
                                                : jobs[snap._id] == undefined ? <span className="job-status">Stopped</span>
                                                    : <span className="job-status"></span>}
                                    </div>
                                </div>
                            </li>

                        })}
                    </ul>
                </div>
            )
        } else if (view_snap) {
            return (
                <div className="view-snap-wrapper">
                    <h1>{view_this_snap.name}</h1>
                    <ViewSnap view_snap_details={view_this_snap} />
                    <button onClick={() => setSnapActionType('get_snap')}>Close</button>
                </div>
            )
        }
    }
}