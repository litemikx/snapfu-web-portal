
/* ViewConnection displays the connection details and allows the user to create a snap for the connection.
* A snap is a set of channels and a cron expression that will be used to execute a script on the server.
* There's a multi confirmAlert dialog box to confirm creation of snap
*/

import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// import from Dashboard/Connection/dashboard.css
import '../dashboard.css';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import CreateSnap from '../Snap/CreateSnap';


var statusCode = '';

export default function ViewConnection({ view_connection_details }) {

    const navigate = useNavigate();
    const [list, setList] = useState('');
    const [checkedState, setCheckedState] = useState();
    const [snapList, setSnapList] = useState(new Array());
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setErrorMessage] = useState(null);
    const [server_os_type, setServerOsType] = useState('');

    const [snapName, setSnapName] = useState('');
    const [snapCronExp, setSnapCronExp] = useState('');
    const [snapFolderPath, setSnapFolderPath] = useState('');
    // create snapStatusResponse to store the response from the API
    const [snapStatusResponse, setSnapStatusResponse] = useState('');
    const [snapStatusResponseMessage, setSnapStatusResponseMessage] = useState('');
    const [snapBackupFolderFocus, setSnapBackupFolderFocus] = useState(false);
    const [snapValidBackupFolder, setSnapValidBackupFolder] = useState(false);

    const [snapCronExpFocus, setSnapCronExpFocus] = useState(false);
    const [snapValidCronExp, setSnapValidCronExp] = useState(false);


    // use state to store the itemObjectList
    const [itemObjectList, setitemObjectList] = useState({});

    // REGEX to check if folder path is valid Windows
    const WINDOWS_REGEX = /^[a-zA-Z]:\\(?:[^<>:"/\\|?*]+\\)*[^<>:"/\\|?*]*$/;
    // REGEX to check if folder path is valid linux
    const LINUX_REGEX = /^(\/[^/]+)+\/?$/;
    // REGEX to check if string is valid cron expression
    const CRON_REGEX = /^((\*|\d+|\d+-\d+|\d+\/\d+|\d+-\d+\/\d+|\*\/\d+|\d+L|\d+W)(\s+|$)){5,7}$/;


    const handleOnChange = (position, val, name) => {
        const updatedCheckedState = checkedState.map((item, index) => {

            if (index === position) {
                console.log('pos: ' + position)
                if (snapList.indexOf(val.toString()) > -1) {
                    var pos = snapList.indexOf(val.toString());

                    console.log('found: ' + val);
                    var newList = [...snapList];
                    console.log('newList: ' + newList);
                    newList.splice(pos, 1);
                    console.log('splice list: ' + newList);
                    setSnapList(newList);
                } else {
                    setSnapList([...snapList, val])
                    setitemObjectList({ ...itemObjectList, [val]: name });
                    // debug itemObjectList by printing in console
                    console.log('itemObjectList: ' + JSON.stringify(itemObjectList));
                }
                return !item;
            } else {
                return item;
            }

        });

        setCheckedState(updatedCheckedState);
        console.log('checkedState: ' + JSON.stringify(checkedState));
        console.log('snapList: ' + JSON.stringify(snapList));

    }

    // create a 2nd confirmAlert for getting input values from the function confirmAddSnap
    function confirmSaveSnap(e) {
        e.preventDefault();
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1>Save Snap</h1>
                        <p>Are you sure you want to save this snap?</p>
                        <button onClick={async () => {
                            // call the function CreateSnap and pass the parameters
                            var res = await CreateSnap({ name: snapName, cron_expression: snapCronExp, channels: itemObjectList, folder_path: snapFolderPath }, view_connection_details)
                            setSnapStatusResponse(res);
                            // print in console snapStatusResponse
                            console.log('snapStatusResponse: ' + JSON.stringify(snapStatusResponse));
                            onClose();
                        }}>Yes</button>

                        <button onClick={onClose}>No</button>
                    </div>
                )
            }
        });
    }

    // create confirmAlert for getting the value snapStatusResponse
    function confirmSnapStatusResponse() {
        // return html from the snapStatusResponse and display it in on an html code
        setSnapStatusResponseMessage(snapStatusResponse.message);
    }

    async function getConnectionResponse() {
        var auth = view_connection_details.auth;
        var auth_type = view_connection_details.auth_type == 'basic' ? 'Basic' : '';
        var api = view_connection_details.host + ':' + view_connection_details.port;
        setServerOsType(view_connection_details.server_os_type);
        return fetch(api + '/api/channels/idsAndNames', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': auth_type + ' ' + auth,
                'Accept': 'application/json'
            }
        }).then((res) => {
            statusCode = res.status;
            return res.json();
        }, (err) => {
            setIsLoaded(true);
            setErrorMessage(err.toString());
            console.log('error: ' + err);
        }).then((data) => {
            setIsLoaded(true);
            setList(data);
            setCheckedState(
                new Array(data.map.entry.length).fill(false)
            );
            console.log(data);
        }, (error) => {
            setIsLoaded(true);
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
        getConnectionResponse();
    }, [])

    useEffect(() => {
        if (snapStatusResponse != '') {
            confirmSnapStatusResponse();
            setSnapName('');
            setSnapCronExp('');
            setSnapCronExpFocus(false);
            setSnapFolderPath('');
            setSnapBackupFolderFocus(false);
            setSnapValidBackupFolder(false);
            setSnapValidCronExp(false);
        }
    }, [snapStatusResponse])

    useEffect(() => {
        if (server_os_type == 'linux') {
            var result = LINUX_REGEX.test(snapFolderPath);
            setSnapValidBackupFolder(result);
            console.log('Linux: ' + snapFolderPath)
            console.log('filepath check linux: ' + result);
        } else if (server_os_type == 'windows') {
            var result = WINDOWS_REGEX.test(snapFolderPath);
            setSnapValidBackupFolder(result);
            console.log('windows: ' + snapFolderPath)
            console.log('filepath check windows: ' + result);
        }

    }, [snapFolderPath, server_os_type])

    useEffect(() => {

        var result = CRON_REGEX.test(snapCronExp);
        setSnapValidCronExp(result);
        console.log('' + result);

    }, [snapCronExp])


    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div className="view-connection-container">
                <div>
                    <h1>Channels</h1>
                    <ul>
                        {
                            list.map.entry.map((c, index) => {
                                //console.log('c: ' + c['string'][0].toString());
                                return <li className="item-list" key={index}>
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id={`custom-checkbox-${index}`}
                                            value={c['string'][0].toString()}
                                            checked={checkedState[index]}
                                            onChange={() => handleOnChange(index, c['string'][0].toString(), c['string'][1].toString())}
                                        />
                                        <span className="checkmark"></span>
                                        {c['string'][1].toString()}
                                    </label>

                                </li>

                            })
                        }
                    </ul>
                </div>
                <div>
                    <h1>Create Snap</h1>
                    <ul>
                        <p>If no item selected, all will be backed up.</p>
                        {
                            snapList.map((c, index) => {
                                return <li className="snap-list" key={c.toString()} >
                                    <label>
                                        {c.toString()}
                                    </label>
                                </li>
                            })
                        }
                        <div>
                            <form onSubmit={confirmSaveSnap}>
                                <label htmlFor="name">
                                    Name:
                                </label>
                                <input type="text"
                                    autoComplete="off"
                                    required
                                    onChange={e => setSnapName(e.target.value)}
                                />

                                <label htmlFor="cronExp">
                                    Cron Expression:
                                    <span className={snapValidCronExp ? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={snapValidCronExp || !snapCronExp ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </label>
                                <input type="text"
                                    autoComplete="off"
                                    onFocus={() => setSnapCronExpFocus(true)}
                                    onBlur={() => setSnapCronExpFocus(false)}
                                    value={snapCronExp}
                                    required
                                    onChange={e => setSnapCronExp(e.target.value)}
                                />
                                <p id="snapCronExpNote" className={snapCronExpFocus && snapCronExp && !snapValidCronExp ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} /><br />
                                    <div class="instructions-cron-exp">
                                    <p>* * * * * *</p>
                                    <p>- - - - - -</p>
                                    <p>| | | | | |</p>
                                    <p>| | | | | +-- Day of the Week   (0-6)</p>
                                    <p>| | | | +---- Month             (1-12)</p>
                                    <p>| | | +------ Day of the Month   (1-31)</p>
                                    <p>| | +-------- Hour              (0-23)</p>
                                    <p>| +---------- Minute            (0-59)</p>
                                    <p>+------------ Second            (0-59)</p>
                                    <p>
                                    <span>second	0-59</span><br />
                                    <span>minute	0-59</span><br />
                                    <span>hour	0-23</span><br />
                                    <span>day of month	1-31</span><br />
                                    <span>month	1-12 (or names, e.g: Jan, Feb, March, April)</span><br />
                                    <span>day of week	0-7 (0 or 7 are sunday, or names, e.g. Sunday, Monday, Tue, Wed)</span><br />
                                    </p><br />

                                    <p>Example: 0 */5 * * * * - this will run the job every 5 mins.</p>
                                    </div>
                                    <br />
                                </p>

                                <label htmlFor="snapBackupFolder">
                                    Backup Folder Path:
                                    <span className={snapValidBackupFolder ? "valid" : "hide"}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={snapValidBackupFolder || !snapFolderPath ? "hide" : "invalid"}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </label>
                                <input type="text"
                                    autoComplete="off"
                                    onFocus={() => setSnapBackupFolderFocus(true)}
                                    onBlur={() => setSnapBackupFolderFocus(false)}
                                    value={snapFolderPath}
                                    required
                                    onChange={e => setSnapFolderPath(e.target.value)}
                                />
                                <p id="snapbackupfoldernote" className={snapBackupFolderFocus && snapFolderPath && !snapValidBackupFolder ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Should be a valid directory path for {server_os_type}.<br />
                                </p>
                                <div>
                                    <button disabled={!snapValidBackupFolder || !snapValidCronExp ? true : false}>Save</button>
                                </div>
                            </form>


                        </div>
                        <div>
                            <p>{snapStatusResponseMessage}</p>
                        </div>

                    </ul>
                </div>

            </div>

        )
    }
}