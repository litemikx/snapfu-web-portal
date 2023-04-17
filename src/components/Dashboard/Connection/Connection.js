import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import AddConnection from './AddConnection';
import UpdateConnection from './UpdateConnection';
import { faPenSquare, faTrash, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ViewConnection from './ViewConnection';

var api_host = process.env.REACT_APP_API_URL;
var statusCode = '';


export default function Connection() {

    const navigate = useNavigate();
    const [connectionActionType, setConnectionActionType] = useState('');
    const [new_connection, setShowNewConnection] = useState(false);
    const [get_connection, setShowGetConnection] = useState(true);
    const [update_connection, setShowUpdateConnection] = useState(false);
    const [view_connection, setShowViewConnection] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    //const [deleteConnection, setToDeleteConnection] = useState(null);
    const [deleteStatu, setDeleteStatus] = useState(false);
    const [updateRecord, setUpdateRecord] = useState('');

    const [error, setErrorMessage] = useState(null);

    const [list_connections, setConnectionsList] = useState('');

    const [view_this_connection, setViewThisConnection] = useState({});


    async function getConnectionList() {
        var token = JSON.parse(sessionStorage.getItem('token'))['token'];

        return fetch(api_host + '/api/connections', {
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
            setConnectionsList(data);
            console.log(data);
        }, (error) => {
            setIsLoaded(true);
            setErrorMessage(error);
        })
    }


    function updateConnection(c) {
        setConnectionActionType('update_connection');
        setShowUpdateConnection(true);
        setUpdateRecord(c);
    }

    function confirmDelete(deleteConnection) {
        confirmAlert({
            customUI: ({ onClose}) => {
                return (
                <div className="custom-ui">
                <h1>Confirm to delete</h1>
                <p>Are you sure you want to delete this Connection? This cannot be undone.</p>
                <button onClick={() => { deleteConnectionItem(deleteConnection); onClose(); }}>Yes</button> 
                <button onClick={() => { getConnectionList(); onClose(); }}>No</button>
                </div>
                )
            }
        })
    }

    async function deleteConnectionItem(deleteConnection) {

        var token = JSON.parse(sessionStorage.getItem('token'))['token'];

        return fetch(api_host + '/api/connections/delete/' + deleteConnection._id, {
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
            getConnectionList();
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
        getConnectionList();
    }, [])

    useEffect(() => {
        if (connectionActionType == 'new_connection') {
            setShowNewConnection(true);
            setShowGetConnection(false);
            setShowUpdateConnection(false);
        } else if (connectionActionType == 'get_connection') {
            setShowGetConnection(true);
            setShowNewConnection(false);
            setShowUpdateConnection(false);
            getConnectionList();
        } else if (connectionActionType == 'update_connection') {
            setShowGetConnection(false);
            setShowNewConnection(false);
        } else if (connectionActionType == 'view_connection') {
            setShowGetConnection(false);
            setShowNewConnection(false);
            setShowViewConnection(true)
        }
    }, [connectionActionType]);

    if (error) {
        return <div>Error: {error} </div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        if (get_connection) {
            return (
                <div className="connection-wrapper">
                    <h1>Connection</h1>
                    <ul>
                        {list_connections.map(function (conn) {
                            return <li className="item" key={conn._id}>
                                <div className="connection-item-list">
                                    <div>
                                        <span><label>{conn.name}</label></span>
                                    </div>

                                    <div>
                                        <span><FontAwesomeIcon icon={faPenSquare} onClick={() => updateConnection(conn)} /></span>
                                        <span><FontAwesomeIcon icon={faTrash} onClick={() => confirmDelete(conn)} /></span>
                                        <span><FontAwesomeIcon icon={faArrowUpRightFromSquare} onClick={() => {
                                            setConnectionActionType('view_connection'); setViewThisConnection(conn)
                                        }} /></span>
                                    </div>
                                </div>
                            </li>

                        })}
                    </ul>
                    <button onClick={() => setConnectionActionType('new_connection')}>Add</button>


                </div>
            )
        } else if (new_connection) {
            return (
                <div className="connection-wrapper">
                    <AddConnection />
                    <button onClick={() => setConnectionActionType('get_connection')}>Close</button>
                </div>

            )
        } else if (update_connection) {
            return (
                <div className="connection-wrapper">
                    <UpdateConnection updateRecord={updateRecord} />
                    <button onClick={() => setConnectionActionType('get_connection')}>Close</button>
                </div>

            )
        } else if (view_connection) {
            return (
                <div className="connection-wrapper">
                    <h1>{view_this_connection.name}</h1>
                    <ViewConnection view_connection_details={view_this_connection} />
                    <button onClick={() => setConnectionActionType('get_connection')}>Close</button>
                </div>
            )
        }
    }
}