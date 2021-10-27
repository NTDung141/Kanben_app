import "./UserLogin.css"
import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import * as authActions from "../../../redux/actions/AuthAction"
import ResetPassword from "../ResetPassword/ResetPassword"
import axios from "axios"
import axiosClient from "../../../api/axiosClient"
import Cookies from "js-cookie"
import * as Notification from "../../../utils/notification/ToastNotification"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserLogin() {

    const dispatch = useDispatch()
    const history = useHistory()

    const [user, setUser] = useState({
        username: "",
        password: "",
        error: "",
        success: ""
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user.username && user.password) {
            const loginData = {
                username: user.username,
                password: user.password
            }

            await axios.post("http://kanben-deploy.herokuapp.com/login/", loginData).then(res => {
                const resData = res.data.data

                const token = resData.token
                Cookies.set('KB-Token', token)

                const userData = resData.user
                const isAdmin = (userData.admin_type === 'Admin') ? true : false

                const userInfo = {
                    ...userData,
                    token: token,
                    isAdmin: isAdmin
                }
                dispatch(authActions.dispatchLogin(userInfo))

                setUser({
                    ...user,
                    success: "Login successed!"
                })

                history.push("/")
            }).catch(err => {
                const errorContent = err.response.data.data.username

                setUser({
                    ...user,
                    error: errorContent
                })
            })

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

    const showNotification = () => {
        if (user.success) {
            // return Notification.successNotification(user.success)
            toast.success(user.success, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    return (
        <div className="login-page">
            {/* {user.success && Notification.successNotification(user.success)} */}
            {showNotification()}

            <form className="login-form border">
                <div className="login-form-header mb-3">Login</div>

                <div className="mb-3">
                    <label className="form-label flex-start">Username</label>
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