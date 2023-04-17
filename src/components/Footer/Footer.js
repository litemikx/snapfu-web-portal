import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';

export default function Footer() {

    const logoutUser = function() {
        sessionStorage.clear();
        return (
            <Navigate replace to="/" />
        )
    }

    return (
        <div className="footer-wrapper">
            <button onClick={logoutUser} >Log Out</button>
        </div>
    )
}