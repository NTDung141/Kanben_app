import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function EmailVerify(props) {

    const [success, setSuccess] = useState(false)

    useEffect(async () => {
        const token = props.match.params.token
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/email-verify/?token=${token}`)

        if (res) {
            setSuccess(true)
        }
    }, [])

    return (
        <div>
            {
                success &&
                <div className="mt-5">
                    <h3 className="mb-4">Account activated</h3>
                    <div>Thank you, your email has been verified. Your account is now active.</div>
                    <div>Please use the link below to login your account.</div>
                    <NavLink className="btn btn-primary mt-4" to="/login"> LOGIN TO YOUR ACCOUNT </NavLink>
                </div>
            }

            {
                !success &&
                <div className="mt-5">
                    <h3 className="mb-4">Verification Failed</h3>
                    <div>Unfortunately, the token has expired or something went wrong.</div>
                    <div>Please use the link below to try to sign up again.</div>
                    <NavLink className="btn btn-primary mt-4" to="/sign-up"> SIGN UP NOW </NavLink>
                </div>
            }
        </div>
    );
}

export default EmailVerify;