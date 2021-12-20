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
    const [topicList, setTopicList] = useState([])
    const [edittingUser, setEdittingUser] = useState(false)
    const [edittingTopic, setEdittingTopic] = useState(false)
    const [newTopic, setNewTopic] = useState("")
    const [pagination, setPagination] = useState({
        currentPage: 1,
        numberOfUser: 5,
        maxPage: 1
    })
    const [tabIndex, setTabIndex] = useState(1)

    const changeTab = (tabIndex) => {
        setTabIndex(tabIndex)

        let listLength = 0

        if (tabIndex === 1) {
            listLength = userList.length
        }
        else if (tabIndex === 2) {
            listLength = topicList.length
        }

        let maxPage = Math.floor(listLength / pagination.numberOfUser)
        if (maxPage === 0) {
            maxPage = 1
        }
        else if (listLength - (maxPage * pagination.numberOfUser) > 0) {
            maxPage += 1
        }

        setPagination({
            ...pagination,
            currentPage: 1,
            maxPage: maxPage
        })
    }

    const fetchUserList = async () => {
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/admin/users/`, {
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
        await fetchTopicList()
    }, [])

    const fetchTopicList = async () => {
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/listTopic/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setTopicList(res.data.data)
                }
            }
        }
    }

    const hanldeSearchUserChange = (e) => {
        e.preventDefault()
        const { value } = e.target
        setSearchValue(value)

        if (value !== "") {
            if (tabIndex === 1) {
                const result = userList.filter(item => {
                    let index = item.username.toLowerCase().indexOf(value.toLowerCase())
                    if (index > -1) {
                        return item
                    }
                })

                setSearchResult(result)
            }
            else if (tabIndex === 2) {
                const result = topicList.filter(item => {
                    let index = item.topic_name.toLowerCase().indexOf(value.toLowerCase())
                    if (index > -1) {
                        return item
                    }
                })

                setSearchResult(result)
            }

        }
        else {
            setSearchResult([])
        }
    }

    const showRecommend = () => {
        if (searchResult.length > 0) {
            return searchResult.map((item) => {
                if (tabIndex === 1) {
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
                }
                else if (tabIndex === 2) {
                    return (
                        <a
                            className="list-group-item list-group-item-action search-bar-item"
                            data-toggle="modal"
                            data-target="#exampleModalCenterUserDetail"
                        >
                            {item.topic_name}
                        </a>
                    )
                }

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

    const showTopicList = () => {
        if (topicList.length > 0) {
            const startIndex = (pagination.currentPage - 1) * pagination.numberOfUser
            const endIndex = startIndex + pagination.numberOfUser
            const topicListPagination = topicList.slice(startIndex, endIndex)

            return topicListPagination.map((item, index) => {
                return (
                    <tr>
                        <th scope="row">{(pagination.currentPage - 1) * pagination.numberOfUser + index + 1}</th>
                        <td>
                            <div>
                                {item.topic_name}
                            </div>
                        </td>

                        <td>
                            <i className="fas fa-pencil mr-3 cursor-pointer" data-toggle="modal" data-target="#exampleModalCenterTopicModal" onClick={() => onEditingTopic(item)}></i>

                            <i className="fas fa-trash cursor-pointer" data-toggle="modal" data-target="#exampleModalCenterTopicDelete" onClick={() => onEditingTopic(item)}></i>

                            {showTopicModal()}

                            {showDeleteTopicModal()}
                        </td>
                    </tr>
                )
            })
        }
    }

    const showDeleteTopicModal = () => {
        return (
            <div className="modal fade" id="exampleModalCenterTopicDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Delete topic</h5>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            Are you sure to delete {edittingTopic.topic_name}?
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>

                            <button type="button" className="btn btn-primary" onClick={onDeleteTopic} data-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const onEditing = (item) => {
        setEdittingUser(item)
    }

    const onEditingTopic = (item) => {
        setEdittingTopic(item)
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

    const showTopicModal = () => {
        return (
            <div className="modal fade" id="exampleModalCenterTopicModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">{edittingTopic ? "Update Topic" : "Add new topic"}</h5>

                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            {edittingTopic ?
                                <input type="text" className="form-control" value={edittingTopic.topic_name} onChange={handleTopicChange} />
                                :
                                <input type="text" className="form-control" value={newTopic} onChange={handleTopicChange} />
                            }
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Cancel
                            </button>

                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={onSaveTopic}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleTopicChange = (e) => {
        e.preventDefault()
        const value = e.target.value
        if (edittingTopic) {
            const newValue = {
                ...edittingTopic,
                topic_name: value
            }

            setEdittingTopic(newValue)
        }
        else {
            setNewTopic(value)
        }
    }

    const onSaveTopic = async () => {
        if (edittingTopic) {
            console.log(edittingTopic)
            const resPut = await axios.put(`https://kanben-deploy.herokuapp.com/listTopic/`, edittingTopic, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (resPut.data) {
                fetchTopicList()
                showSuccessNoti("Update topic success!")
            }
            setEdittingTopic(false)
        }
        else {
            const postTopic = {
                topic_name: newTopic
            }
            const resPost = await axios.post(`https://kanben-deploy.herokuapp.com/listTopic/`, postTopic, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (resPost.data) {
                fetchTopicList()
                showSuccessNoti("Add new topic success!")
            }
            setNewTopic("")
        }
    }

    const onDeleteTopic = async () => {
        if (edittingTopic) {
            const res = await axios.delete(`https://kanben-deploy.herokuapp.com/listTopic/${edittingTopic.id}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (res) {
                const noti = "Delete " + edittingTopic.topic_name + " success!"
                showSuccessNoti(noti)
            }
            fetchTopicList()
            setEdittingTopic(false)
        }
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

        const res = await axios.put(`https://kanben-deploy.herokuapp.com/admin/users/${item.id}`, request, {
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

        const res = await axios.put(`https://kanben-deploy.herokuapp.com/admin/users/${item.id}`, request, {
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
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <div className="nav-link cursor-pointer" onClick={() => changeTab(1)}>Users</div>
                </li>

                <li className="nav-item">
                    <div className="nav-link cursor-pointer" onClick={() => changeTab(2)}>Topics</div>
                </li>
            </ul>

            <div className="admin-page-search-box">
                <input type="text" className="form-control" placeholder={tabIndex === 1 ? "Search user" : "Search topic"} name="searchUser" value={searchValue} onChange={hanldeSearchUserChange} />

                {searchResult &&
                    <div className="admin-page-search-user-drop-box">
                        {showRecommend()}
                    </div>
                }
            </div>

            {tabIndex === 1 &&
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
                </div>}

            {tabIndex === 2 &&
                <div>
                    <div className="flex-right">
                        <button className="btn btn-primary mb-3" data-toggle="modal" data-target="#exampleModalCenterTopicModal" onClick={() => onEditingTopic(false)}>
                            <i className="fas fa-plus mr-2"></i>

                            Add new
                        </button>
                    </div>

                    <div className="admin-page-table">
                        <table class="table">
                            <thead class="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Topic name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showTopicList()}
                            </tbody>
                        </table>
                    </div>
                </div>
            }

            <div className="admin-page-change-page">
                <button className="btn btn-light mr-5" onClick={() => onChangePage(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>Prev</button>

                <h5>{pagination.currentPage}</h5>

                <button className="btn btn-light ml-5" onClick={() => onChangePage(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.maxPage}>Next</button>
            </div>
        </div>
    );
}

export default AdminPage;