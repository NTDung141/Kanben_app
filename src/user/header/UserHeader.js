import React, { useEffect, useState } from 'react';
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

    const token = Cookies.get('KB-Token')

    const [allFolderList, setAllFolderList] = useState([])
    const [searchFolderList, setSearchFolderList] = useState([])
    const [searchFolderValue, setSearchFolderValue] = useState("")

    const fetchAllFolderList = async () => {
        const res = await axios.get(`http://kanben-deploy.herokuapp.com/listFolder/`, null, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setAllFolderList(res.data.data)
                }
            }
        }
    }

    useEffect(async () => {
        await fetchAllFolderList()
        setSearchFolderList(allFolderList)
    }, [])

    const handleChangeSearchFolder = (e) => {
        const { value } = e.target
        setSearchFolderValue(value)

        const searchResult = allFolderList.filter(item => {
            let index = item.name.toLowerCase().indexOf(value.toLowerCase())
            if (index > -1) {
                return item
            }
        })

        if (value !== "") {
            setSearchFolderList(searchResult)
        }
        else {
            setSearchFolderList(allFolderList)
        }
    }

    const showSearchFolderList = () => {
        return searchFolderList.map(item => {
            return (
                <a className="list-group-item list-group-item-action search-folder-item" onClick={() => moveToFolderDetail(item)} data-dismiss="modal">
                    <div>{item.name}</div>

                    <div className="search-folder-item-author">by {item.author_name}</div>
                </a>
            )
        })
    }

    const moveToFolderDetail = (item) => {
        const destination = "/folder-detail/" + item.id
        history.push(destination)
    }

    const logout = async () => {
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
                        <input className="form-control mr-sm-2" type="search" placeholder="Search folder" data-toggle="modal" data-target="#exampleModalCenterSearchFolder" onClick={fetchAllFolderList} />

                        <div className="modal fade" id="exampleModalCenterSearchFolder" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Search folder</h5>

                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        <input className="user-header-search" type="search" placeholder="Search folder" value={searchFolderValue} onChange={handleChangeSearchFolder} />

                                        {searchFolderValue &&
                                            <div className="user-header-search-folder-drop-box">
                                                {showSearchFolderList()}
                                            </div>
                                        }
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {avatar()}
                    </form>
                </div>
            </nav>
        </div>
    );
}

export default UserHeader;