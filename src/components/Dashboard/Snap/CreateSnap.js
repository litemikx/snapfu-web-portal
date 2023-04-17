
import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var api_host = process.env.REACT_APP_API_URL;
var statusCode = '';

export default function CreateSnap(params, view_connection_details) {
    // map params.channels to an array with key id and name using map
    var channels = [];
    // loop through json object params.channels getting key and value and push to array channels
    for (var key in params.channels) {
        channels.push({
            "id": key,
            "name": params.channels[key]
        });
    }


    console.log('channels: ' + JSON.stringify(channels));
    // create object to send to api
    var snap = {
        "name": params.name,
        "exec_path": view_connection_details.file_path,
        "folder_path": params.folder_path,
        "server_os_type": view_connection_details.server_os_type,
        "status": "inactive",
        "cron_expression": params.cron_expression,
        "connection_id": view_connection_details._id,
        "channels": channels
    }
    var token = JSON.parse(sessionStorage.getItem('token'))['token'];

    return fetch(api_host + '/api/snaps/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-access-token': token
        },
        body: JSON.stringify(snap)
    }).then((res) => {
        statusCode = res.status;
        return res.json();
    }, (error) => {
        console.log(error);
    });
}