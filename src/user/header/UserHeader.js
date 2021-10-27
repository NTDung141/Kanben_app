import React from 'react';
import "./UserHeader.css"
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import * as authActions from "../../redux/actions/AuthAction"
import axios from 'axios';
import Cookies from "js-cookie";

function UserHeader() {

    const user = useSelector(state => state.AuthReducer)
    const dispatch = useDispatch()
    const history = useHistory()

    const logout = async () => {
        const token = Cookies.get('KB-Token')

        Cookies.remove('KB-Token')

        dispatch(authActions.dispatchLogout())
        history.push("/")
    }

    const avatar = () => {
        if (user.username) {
            return (
                <div className="dropdown show">
                    <div className="user-header-avatar" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {user.username.slice(0, 1).toUpperCase()}
                    </div>

                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                        {user.isAdmin && <NavLink className="dropdown-item" to="/admin">Admin</NavLink>}
                        <NavLink className="dropdown-item" to="/folder">My folder</NavLink>
                        <NavLink className="dropdown-item" to="/my-profile">My profile</NavLink>
                        <div className="dropdown-item" onClick={logout}>Log out</div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <NavLink className="btn btn-outline-light my-2 my-sm-0" to="/login">Log in</NavLink>
            )
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark user-header">
                <NavLink className="navbar-brand" to="/">Kanben</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">

                    </ul>

                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search folder" />

                        {avatar()}
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default UserHeader;