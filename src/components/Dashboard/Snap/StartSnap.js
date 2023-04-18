
import React, { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

var api_host = process.env.REACT_APP_API_URL;
var statusCode = '';

export default function StartSnap(id) {
    var token = JSON.parse(sessionStorage.getItem('token'))['token'];
        return fetch(api_host + '/api/snaps/start/' + id, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': token
            }
        }).then((res) => {
            statusCode = res.status;
            return res.json();
        }, (error) => {
            console.log(error);
        });
}