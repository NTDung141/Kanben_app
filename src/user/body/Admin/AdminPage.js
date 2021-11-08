import React, { useEffect, useState } from 'react';
import './AdminPage.css'
import axios from "axios"
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPage() {
    const token = Cookies.get("KB-Token")

    const [searchValue, setSearchValue] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [userList, setUserList] = useState([])
    const [edittingUser, setEdittingUser] = useState(false)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        numberOfUser: 2,
        maxPage: 1
    })

    const fetchUserList = async () => {
        const res = await axios.get(`http://kanben-deploy.herokuapp.com/admin/users/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setUserList(res.data.data)

                    const userListLength = res.data.data.length
                    let maxPage = Math.floor(userListLength / pagination.numberOfUser)
                    if (maxPage === 0) {
                        maxPage = 1
                    }
                    else if (userListLength - (maxPage * pagination.numberOfUser) > 0) {
                        maxPage += 1
                    }

                    setPagination({
                        ...pagination,
                        maxPage: maxPage
                    })

                }
            }
        }
    }

    useEffect(async () => {
        await fetchUserList()
    }, [])

    const hanldeSearchUserChange = (e) => {
        e.preventDefault()
        const { value } = e.target
        setSearchValue(value)

        if (value !== "") {
            const result = userList.filter(item => {
                let index = item.username.toLowerCase().indexOf(value.toLowerCase())
                if (index > -1) {
                    return item
                }
            })

            setSearchResult(result)
        }
        else {
            setSearchResult([])
        }
    }

    const showRecommend = () => {
        if (searchResult.length > 0) {
            return searchResult.map((item) => {
                return (
                    <a
                        className="list-group-item list-group-item-action search-bar-item"
                        data-toggle="modal"
                        data-target="#exampleModalCenterUserDetail"
                        onClick={() => onEditing(item)}
                    >
                        {item.username}
                    </a>
                )
            })
        }
    }

    const showUserList = () => {
        if (userList.length > 0) {
            const startIndex = (pagination.currentPage - 1) * pagination.numberOfUser
            const endIndex = startIndex + pagination.numberOfUser
            const userListPagination = userList.slice(startIndex, endIndex)

            return userListPagination.map((item, index) => {
                return (
                    <tr>
                        <th scope="row">{(pagination.currentPage - 1) * pagination.numberOfUser + index + 1}</th>
                        <td>
                            <div className="admin-page-user-avatar">
                                {showImage(item)}
                            </div>
                        </td>
                        {item.is_active
                            ? <td>{item.username}</td>
                            : <td className="is-blocked">{item.username}</td>
                        }

                        <td>
                            <i className="fas fa-eye" data-toggle="modal" data-target="#exampleModalCenterUserDetail" onClick={() => onEditing(item)}></i>

                            {showUserModal()}
                        </td>
                    </tr>
                )
            })
        }
    }

    const onEditing = (item) => {
        setEdittingUser(item)
    }

    const showUserModal = () => {
        if (edittingUser) {
            return (
                <div className="modal fade" id="exampleModalCenterUserDetail" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">User Detail</h5>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                {showUserDetail(edittingUser)}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal" disabled={edittingUser.admin_type === "Admin" && edittingUser.is_active} onClick={() => onBlock(edittingUser)}>
                                    {edittingUser.is_active ? "Block" : "Unblock"}
                                </button>

                                <button type="button" className="btn btn-primary" data-dismiss="modal" disabled={edittingUser.admin_type === "Admin"} onClick={() => toAdmin(edittingUser)}>To Admin</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const showImage = (item) => {
        if (item.profile_pic) {
            const imgUrl = `http://kanben-deploy.herokuapp.com${item.profile_pic}`
            return (
                <img src={imgUrl}></img>
            )
        }
    }

    const showUserDetail = (item) => {
        return (
            <div className="row">
                <div className="col-7">
                    <div className="admin-page-user-detail">
                        <div className="admin-page-user-detail-line">{item.username}</div>

                        <div className="admin-page-user-detail-line">{item.email}</div>

                        <div className="admin-page-user-detail-line">{item.date_of_birth}</div>

                        <div className="admin-page-user-detail-line">{item.gender}</div>
                    </div>
                </div>

                <div className="col-5">
                    <div className="admin-page-user-detail-avatar">
                        <div className="admin-page-user-detail-avatar-img">
                            {showImage(item)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const showSuccessNoti = (noti) => {
        if (noti) {
            toast.success(noti, {
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

    const toAdmin = async (item) => {
        let is_active = "true"
        if (!item.is_active) {
            is_active = "false"
        }
        const request = {
            is_active: is_active,
            admin_type: "Admin"
        }

        const res = await axios.put(`http://kanben-deploy.herokuapp.com/admin/users/${item.id}`, request, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            const noti = item.username + " has become admin"
            showSuccessNoti(noti)
            await fetchUserList()
            console.log(res)
        }
    }

    const onBlock = async (item) => {
        let is_active = "false"

        if (!item.is_active) {
            is_active = "true"
        }

        const request = {
            is_active: is_active,
            admin_type: item.admin_type
        }

        const res = await axios.put(`http://kanben-deploy.herokuapp.com/admin/users/${item.id}`, request, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            let noti = item.username + " is blocked"
            if (!item.is_active) {
                noti = item.username + " is unblocked"
            }

            showSuccessNoti(noti)
            await fetchUserList()
            console.log(res)
        }
    }

    const onChangePage = (page) => {
        setPagination({
            ...pagination,
            currentPage: page
        })
    }

    return (
        <div className="admin-page">
            <div className="admin-page-search-box">
                <input type="text" className="form-control" placeholder="Search user" name="searchUser" value={searchValue} onChange={hanldeSearchUserChange} />

                {searchResult &&
                    <div className="admin-page-search-user-drop-box">
                        {showRecommend()}
                    </div>
                }
            </div>

            <div className="admin-page-table">
                <table class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Avatar</th>
                            <th scope="col">User name</th>
                            <th scope="col">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showUserList()}
                    </tbody>
                </table>
            </div>

            <div className="admin-page-change-page">
                <button className="btn btn-light mr-5" onClick={() => onChangePage(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>Prev</button>

                <h5>{pagination.currentPage}</h5>

                <button className="btn btn-light ml-5" onClick={() => onChangePage(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.maxPage}>Next</button>
            </div>
        </div>
    );
}

export default AdminPage;