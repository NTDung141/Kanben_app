import React, { useState } from 'react';
import './UserSignUp.css'
import { useHistory } from "react-router-dom"
import axios from 'axios';
import * as Notification from "../../../utils/notification/ToastNotification"

function UserSignUp() {

    const history = useHistory()

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: "",
        success: ""
    })

    const axiosClient = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value,
            error: "",
            success: ""
        })
    }

    const handleSubmit = async () => {
        if (user.username && user.email && user.password && user.confirmPassword) {
            if (user.username.length > 20) {
                setUser({
                    ...user,
                    error: "Username must not exceed 20 characters",
                    success: ""
                })
            }
            else if (user.email.length > 50) {
                setUser({
                    ...user,
                    error: "Email must not exceed 50 characters",
                    success: ""
                })
            }
            else if (user.password.length < 6 || user.password.length > 32) {
                setUser({
                    ...user,
                    error: "Password must be between 6 and 32 characters",
                    success: ""
                })
            }
            else if (user.confirmPassword !== user.password) {
                setUser({
                    ...user,
                    error: "Confirm password is incorrect",
                    success: ""
                })
            }
            else {
                const res = await axios.post("http://kanben-deploy.herokuapp.com/register/", {
                    username: user.username,
                    email: user.email,
                    password: user.password
                })
                if (res) {
                    setUser({
                        ...user,
                        error: "",
                        success: "Check your email for verification!"
                    })
                    history.push("/login")
                }
            }
        }
        else {
            setUser({
                ...user,
                error: "Need to fill in all the information"
            })
        }
    }

    const errorInForm = () => {
        if (user.error) {
            return (
                <div className="mb-3">
                    <div className="form-text sign-up-form-error flex-start">{user.error}</div>
                </div>
            )
        }
    }

    return (
        <div className="sign-up-page">
            {user.success && Notification.successNotification(user.success)}

            <form className="sign-up-form border">
                <div className="mb-3 sign-up-form-header">Sign Up</div>

                <div className="mb-3">
                    <label className="form-label flex-start">User name</label>
                    <input type="text" className="form-control" name="username" value={user.username} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label flex-start">Email address</label>
                    <input type="email" className="form-control" name="email" value={user.email} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label flex-start">Password</label>
                    <input type="password" className="form-control" name="password" value={user.password} onChange={handleChange} />
                </div>

                <div className="mb-4">
                    <label className="form-label flex-start">Confirm Password</label>
                    <input type="password" className="form-control" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} />
                </div>

                {errorInForm()}

                <button type="button" className="btn btn-primary btn-block" onClick={handleSubmit}>Sign Up</button>
            </form>
        </div>
    );
}

export default UserSignUp;