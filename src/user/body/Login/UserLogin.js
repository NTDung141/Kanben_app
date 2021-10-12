import "./UserLogin.css"
import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import * as authActions from "../../../redux/actions/AuthAction"
import ResetPassword from "../ResetPassword/ResetPassword"

function UserLogin() {

    const dispatch = useDispatch()
    const history = useHistory()

    const [user, setUser] = useState({
        username: "",
        password: "",
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
        if (user.username && user.password) {
            const userInfo = {
                username: user.username,
                email: user.password,
                token: "",
                isAdmin: false
            }
            dispatch(authActions.dispatchLogin(userInfo))
            history.push("/")
        }
        else {
            setUser({
                ...user,
                error: "You have not entered username or password"
            })
        }
    }

    const errorInForm = () => {
        if (user.error) {
            return (
                <div className="mb-3">
                    <div className="form-text login-form-error flex-start">{user.error}</div>
                </div>
            )
        }
    }

    return (
        <div className="login-page">
            <form className="login-form border">
                <div className="login-form-header mb-3">Login</div>

                <div className="mb-3">
                    <label className="form-label flex-start">User name</label>
                    <input type="text" className="form-control" name="username" value={user.username} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label flex-start">Password</label>
                    <input type="password" className="form-control" name="password" value={user.password} onChange={handleChange} />
                </div>

                {errorInForm()}

                <div className="mb-3">
                    <ResetPassword />
                </div>

                <button type="button" className="btn btn-primary btn-block mb-3" onClick={handleSubmit}>Login</button>

                <div className="mb-3 form-check">
                    <div className="form-text">
                        <div>
                            Not a member?
                            <NavLink className="login-form-text inline-block ml-2" to="/sign-up"> Sign up now</NavLink>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UserLogin