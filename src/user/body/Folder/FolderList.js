import React, { useEffect, useState } from 'react';
import "./Folder.css"
import FolderItem from './FolderItem';
import axios from 'axios'
import Cookies from "js-cookie";
import { useSelector } from "react-redux"
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify';

function FolderList() {
    const token = Cookies.get('KB-Token')
    const user = useSelector(state => state.AuthReducer)

    const [folderList, setFolderList] = useState([])

    const fetchMyFolderList = async () => {
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/listFolder/${user.id}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setFolderList(res.data.data)
                }
            }
        }
    }

    useEffect(async () => {
        await fetchMyFolderList()
    }, [])

    const initialEdittingFolder = {
        id: "",
        name: ""
    }

    const [edittingFolder, setEdittingFolder] = useState(initialEdittingFolder)

    const handleChangeFolderName = (e) => {
        e.preventDefault()
        const { value } = e.target
        setEdittingFolder({
            ...edittingFolder,
            name: value
        })
    }

    const onEditFolder = (item) => {
        setEdittingFolder(item)
    }

    const onSaveEdittingFolder = async () => {
        const updateRequest = {
            visibility: true,
            name: edittingFolder.name
        }

        const res = await axios.put(`https://kanben-deploy.herokuapp.com/folder/${edittingFolder.id}`, updateRequest, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            toast.success("Updated successful!", {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await fetchMyFolderList()
        }
    }

    const onDeleteEdittingFolder = async () => {
        const res = await axios.delete(`https://kanben-deploy.herokuapp.com/folder/${edittingFolder.id}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            toast.success("Deleted successful!", {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await fetchMyFolderList()
        }
    }

    const showFolderList = () => {
        if (folderList.length > 0) {
            return folderList.map(item => {
                return (
                    <div className="folder-item">
                        <NavLink className="folder-item-name" to={"/folder-detail/" + item.id}>
                            <i className="fas fa-folder mr-3"></i>
                            {item.name}
                        </NavLink>

                        <div className="folder-item-action">
                            <i className="fas fa-pen mr-3 cursor-pointer" data-toggle="modal" data-target="#exampleModalCenterFolderUpdate" onClick={() => onEditFolder(item)}></i>

                            <i className="fas fa-trash cursor-pointer" data-toggle="modal" data-target="#exampleModalCenterFolderDelete" onClick={() => onEditFolder(item)}></i>
                        </div>

                        <div className="modal fade" id="exampleModalCenterFolderUpdate" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Update folder</h5>

                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        <input type="text" className="form-control" name="folderName" value={edittingFolder.name} onChange={handleChangeFolderName} />
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

                                        <button type="button" className="btn btn-primary" onClick={onSaveEdittingFolder} data-dismiss="modal">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="exampleModalCenterFolderDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Delete folder</h5>

                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        Are you sure to delete {edittingFolder.name}?
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>

                                        <button type="button" className="btn btn-primary" onClick={onDeleteEdittingFolder} data-dismiss="modal">Ok</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    return (
        <div className="bg-color min-vh-100">
            <div className="folder-list">
                <div className="create-quiz-btn">
                    {/* <button className="btn btn-primary">Create quiz</button> */}
                </div>

                {showFolderList()}
            </div>
        </div>
    );
}

export default FolderList;