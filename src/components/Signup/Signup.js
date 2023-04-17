import React, { useRef, useState, useEffect } from 'react';
import './Signup.css';
import '../../index.css';
import PropTypes from 'prop-types';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

var api_host = process.env.REACT_APP_API_URL;
console.log('api_host: ' + api_host);

var statusCode = '';

async function sendEmail(email, token) {
    return fetch(api_host + "/api/send", {
        method: "POST",
        body: JSON.stringify({
          "email": email,
          "code": token
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function(response) {
        return response;
    });
}

async function signupUser(account) {

    return fetch(api_host + '/api/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(account)
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



const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,24}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export default function Signup({ setToken }) {
    
    const userRef = useRef();
    const errRef = useRef();

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');

    const [username, setUserName] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [responseMessage, setReponseMessage] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(username);
        console.log('user: ' + username);
        console.log('result: ' + result);
        setValidName(result);
    }, [username]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log('email: ' + email);
        console.log('result: ' + result);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        console.log('result: ' + result);
        console.log('password: ' + password);
        setValidPwd(result);
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPassword]);

    const handleSubmit = async e => {
        e.preventDefault();
        const check1 = EMAIL_REGEX.test(email);
        const check2 = USER_REGEX.test(username);
        const check3 = PWD_REGEX.test(password);

        if (!check1 || !check2 || !check3) {
            setErrMsg('Invalid Entry');
            return;
        } else {
            var res = await signupUser({
                "firstname" : firstname,
                "lastname" : lastname,
                "email" : email,
                "username" : username,
                "password" : password
            });
            //setToken(token);
            console.log('res: ' + JSON.stringify(res));
            if (statusCode >= 200 && statusCode <= 202) {
                setSuccess(true);
                sendEmail(email, res.token.toString());
             } else {
                setSuccess(false);
             }
            setReponseMessage(res.message.toString());
            
        }
    }
    return !success ? (
        <div className="signup-wrapper">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname">
                    First Name
                </label>
                <input type="text"
                    autoComplete="off"
                    required
                    onChange={e => setFirstName(e.target.value)}
                />

                <label htmlFor="lastname">
                    Last Name
                </label>
                <input type="text"
                    autoComplete="off"
                    required
                    onChange={e => setLastName(e.target.value)}
                />


                <label htmlFor="email">
                    Email
                    <span className={validEmail ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validEmail || !email ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input type="email"
                    autoComplete="off"
                    required
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    onChange={e => setEmail(e.target.value)}
                />
                 <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Should be a valid email address.<br />
                </p>

                <label htmlFor="username">
                    Username
                    <span className={validName ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !username ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input type="text"
                    ref={userRef}
                    autoComplete="off"
                    required
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    onChange={e => setUserName(e.target.value)}
                />
                <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.<br />
                    Must begin with a letter.<br />
                    Leters, numbers, underscores, hyphens allowed.
                </p>
                <label htmlFor="password">
                    Password
                    <span className={validPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validPwd || !password ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>
                <input type="password"
                        id="password"
                        required
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        onChange={e => setPassword(e.target.value)}
                />
                <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: !@#$%<br />
                </p>

                <label htmlFor="confirm_password">
                    Confirm Password
                    <span className={validMatch && matchPassword ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validMatch || !matchPassword ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                    
                </label>
                <input type="password" 
                        id="confirm_password"
                        required
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        onChange={e => setMatchPassword(e.target.value)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Mush match the first password input field.<br />
                </p>
                <div>
                    <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                </div>
            </form>
            <p>
                { responseMessage }
            </p>
            <p>
                Already registered?<br />
                <span className="line">
                    { /*put router link here*/}
                    <Link to="/">Log In</Link>
                </span>
            </p>
           
        </div>
    ) : <div className="signup-wrapper">
            <p>
                Congratulations! Please wait for an email to verify your account.
            </p>
            <span className="line">
                { /*put router link here*/}
                <Link to="/">Log In</Link>
            </span>   
        </div>;
}

//export default Signup
/*Signup.propTypes = {
    setToken: PropTypes.func.isRequired
}*/