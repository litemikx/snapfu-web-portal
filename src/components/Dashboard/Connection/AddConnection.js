import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

var api_host = process.env.REACT_APP_API_URL;
var statusCode = '';

const WINDOWS_REGEX = /^(?<ParentPath>(?:[a-zA-Z]\:|\\\\[\w\s\.]+\\[\w\s\.$]+)\\(?:[\w\s\.]+\\)*)(?<BaseName>[\w\s\.]*?)$/;
const LINUX_REGEX = /^((\/)?([\w-_\.]+(\/)?)+)+$/;

async function createConnection(connection) {

    var token = JSON.parse(sessionStorage.getItem('token'))['token'];

    return fetch(api_host + '/api/connections/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-access-token': token
        },
        body: JSON.stringify(connection)
    }).then((res) => {
        /*for(const header of res.headers){
            console.log(header);
         }
         console.log('status: ' + res.status);
         var resp = res.json();
         resp["status"] = res.status;*/

        statusCode = res.status;

        return res.json();
    });
}

export default function AddConnection() {
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [auth, setAuth] = useState('');
    const [auth_type, setAuthType] = useState('');
    const [file_path, setFilePath] = useState('');
    const [validFilePath, setValidFilePath] = useState(false);
    const [filePathFocus, setFilePathFocus] = useState(false);
    const [server_os_type, setServerOSType] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [responseMessage, setReponseMessage] = useState('');

    useEffect(() => {
        if (server_os_type == 'linux') {
            var result = LINUX_REGEX.test(file_path);
            setValidFilePath(result);
            console.log('Linux: ' + file_path)
            console.log('filepath check linux: ' + result);
        } else if (server_os_type == 'windows') {
            var result = WINDOWS_REGEX.test(file_path);
            setValidFilePath(result);
            console.log('windows: ' + file_path)
            console.log('filepath check windows: ' + result);
        }

    }, [file_path, server_os_type])

    useEffect(() => {
        if (success) {
            setName('');
            setHost('');
            setPort('');
            setAuth('');
            setAuthType('');
            setFilePath('');
            setServerOSType('');
        }
    }, [success]);

    const handleSubmit = async e => {
        e.preventDefault();

        var res = await createConnection({
            "name": name,
            "host": host,
            "port": port,
            "auth": auth,
            "auth_type": auth_type,
            "file_path": file_path,
            "server_os_type" : server_os_type
        });
        if (statusCode >= 200 && statusCode <= 202) {
            setSuccess(true);
            e.target.reset();
        } else {
            setSuccess(false);
        }
        setReponseMessage(res.message.toString());
    }

    if (!success) {
        return (
            <div className="connection-form-wrapper">
                <h1>Create</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        Name
                    </label>
                    <input type="text"
                        autoComplete="off"
                        required
                        onChange={e => setName(e.target.value)}
                    />

                    <label htmlFor="host">
                        Host
                    </label>
                    <input type="text"
                        autoComplete="off"
                        required
                        onChange={e => setHost(e.target.value)}
                    />

                    <label htmlFor="port">
                        Port
                    </label>
                    <input type="number"
                        autoComplete="off"
                        required
                        onChange={e => setPort(e.target.value)}
                    />

                    <label htmlFor="auth">
                        Auth
                    </label>
                    <input type="password"
                        autoComplete="off"
                        required
                        onChange={e => setAuth(e.target.value)}
                    />

                    <label htmlFor="auth_type">
                        Auth Type
                    </label>
                    <select value={auth_type} onChange={e => setAuthType(e.target.value)}>
                        <option value=""></option>
                        <option value="basic">Basic</option>
                    </select>

                    <label htmlFor="filePath">
                        File Path of executable mccommand
                        <span className={validFilePath ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validFilePath || !file_path ? "hide" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input type="text"
                        autoComplete="off"
                        onFocus={() => setFilePathFocus(true)}
                        onBlur={() => setFilePathFocus(false)}
                        value={file_path}
                        required
                        onChange={e => setFilePath(e.target.value)}
                    />
                    <p id="filepathnote" className={filePathFocus && file_path && !validFilePath ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Should be a valid file path for {server_os_type}.<br />
                    </p>

                    <label htmlFor="server_os_type">
                        Server OS Type
                    </label>
                    <select value={server_os_type} onChange={e => setServerOSType(e.target.value)}>
                        <option value=""></option>
                        <option value="linux">Linux</option>
                        <option value="windows">Windows</option>
                    </select>
                    <div>
                        <button disabled={!validFilePath ? true : false}>Save</button>
                    </div>
                    
                </form>
                <p>
                    {responseMessage}
                </p>
            </div>
        )
    } else {
        return (
            (
                <div className="connection-form-wrapper">
                    {responseMessage}
                </div>

            )
        )
    }
}