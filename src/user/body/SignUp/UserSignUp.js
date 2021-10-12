import React, { useState } from 'react';
import './UserSignUp.css'
import { useHistory } from "react-router-dom"

function UserSignUp() {

    const history = useHistory()

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value,
            error: ""
        })
    }

    const handleSubmit = () => {
        if (user.username && user.email && user.password && user.confirmPassword) {
            history.push("/login")
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