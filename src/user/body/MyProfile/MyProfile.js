import React, { useState } from 'react';
import "./MyProfile.css"
import { useSelector, useDispatch } from "react-redux"
import * as authActions from "../../../redux/actions/AuthAction"
import axios from 'axios';
import Cookies from "js-cookie"
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyProfile() {

    const [selectedImage, setSelectedImage] = useState(false)
    const [selectedFile, setSelectedFile] = useState(false)
    const [updateAbility, setUpdateAbility] = useState(false)
    const [successNoti, setSuccessNoti] = useState(false)

    const user = useSelector(state => state.AuthReducer)
    const [userInfo, setUserInfo] = useState(user)

    const initialChangePasswordState = {
        old_password: "",
        new_password1: "",
        new_password2: ""
    }

    const [changePassword, setChangePassword] = useState(initialChangePasswordState)
    const [changePasswordSuccess, setChangePasswordSuccess] = useState(false)
    const [changePasswordError, setChangePasswordError] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()

    const token = Cookies.get('KB-Token')

    const changeFileHandle = async (event) => {
        const file = event.target.files[0]
        if (file
            && (file.type === "image/jpeg"
                || file.type === "image/png"
                || file.type === "image/pjp"
                || file.type === "image/pjpeg"
                || file.type === "image/jpg"
                || file.type === "image/jfif")) {
            const image = URL.createObjectURL(file)
            setSelectedImage(image)
            setSelectedFile(file)
        }
    }

    const changeUpdateAbility = (value) => {
        setUpdateAbility(value)
    }

    const onSaveUpdateHandle = async () => {
        const formData = new FormData();

        if (userInfo.date_of_birth) {
            formData.append("date_of_birth", userInfo.date_of_birth)
        }

        if (userInfo.gender) {
            formData.append("gender", userInfo.gender)
        }

        if (selectedFile) {
            formData.append("profile_pic", selectedFile)
        }

        console.log(selectedFile)
        console.log(token)
        console.log(userInfo)

        const res = await axios.put("http://kanben-deploy.herokuapp.com/profile/", formData, {
            headers: {
                'Authorization': `Token ${token}`
                // 'Content-Type': 'multipart/form-data'
            }
        })

        if (res) {
            const userData = res.data.data
            const isAdmin = (userData.admin_type === 'Admin') ? true : false

            const userInfo = {
                ...userData,
                token: token,
                isAdmin: isAdmin
            }

            dispatch(authActions.dispatchLogin(userInfo))
            changeUpdateAbility(false)
            // setSelectedFile(false)
            // setSelectedImage(false)
            setSuccessNoti("Update successful!")
        }
    }

    const onCancelUpdateHandle = () => {
        changeUpdateAbility(false)
        setSelectedFile(false)
        setSelectedImage(false)
        setUserInfo(user)
    }

    const onChangeInputHandle = (e) => {
        const { name, value } = e.target
        setUserInfo({
            ...userInfo,
            [name]: value
        })
    }

    const onChangePasswordHandle = (e) => {
        setChangePasswordError(false)

        const { name, value } = e.target

        setChangePassword({
            ...changePassword,
            [name]: value
        })
    }

    const onSaveNewPassword = () => {
        if (changePassword.old_password && changePassword.new_password1 && changePassword.new_password2) {
            if (changePassword.new_password1.length < 6 || changePassword.new_password1.length > 32) {
                setChangePasswordError("Password must be between 6 and 32 characters")
            }
            else if (changePassword.new_password1 !== changePassword.new_password2) {
                setChangePasswordError("Confirm password is incorrect")
            }
            else {
                const res = axios.put("http://kanben-deploy.herokuapp.com/profile/change-password/", changePassword, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })

                if (res) {
                    Cookies.remove('KB-Token')

                    dispatch(authActions.dispatchLogout())
                    setChangePasswordSuccess(true)
                    setSuccessNoti("Change password successfully!")
                }
            }
        }
        else {
            setChangePasswordError("Need to fill in all the information")
        }
    }

    const onCancelChangePassword = () => {
        setChangePassword(initialChangePasswordState)
        if (changePasswordSuccess) {
            setChangePasswordSuccess(false)
            history.push("/")
        }
    }

    const showNotification = () => {
        if (successNoti) {
            toast.success(successNoti, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            setSuccessNoti(false)
        }
    }

    const errorInForm = () => {
        if (changePasswordError) {
            return (
                <div className="mb-3">
                    <div className="form-text login-form-error flex-start">{changePasswordError}</div>
                </div>
            )
        }
    }

    return (
        <div className="my-profile">
            {showNotification()}
            <div className="my-profile-action">
                <button className="btn btn-primary mr-2" onClick={() => changeUpdateAbility(true)}>Update profile</button>

                <button className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">Change my password</button>

                <div className="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Change password</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <label className="my-profile-info-label">Current password</label>
                                <input type="password" className="form-control mb-1" name="old_password" value={changePassword.old_password} onChange={onChangePasswordHandle} />

                                <label className="my-profile-info-label">New password</label>
                                <input type="password" className="form-control mb-1" name="new_password1" value={changePassword.new_password1} onChange={onChangePasswordHandle} />

                                <label className="my-profile-info-label">Confirm new password</label>
                                <input type="password" className="form-control" name="new_password2" value={changePassword.new_password2} onChange={onChangePasswordHandle} />

                                {errorInForm()}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onCancelChangePassword}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={onSaveNewPassword}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-profile-detail">
                <div className="my-profile-title">
                    <h2>My profile</h2>
                </div>

                <div className="my-profile-form">
                    <div className="my-profile-avatar">
                        <div className="avatar-select-image">
                            {selectedImage && <img src={selectedImage}></img>}

                            {(!selectedImage && userInfo.profile_pic) && <img src={userInfo.profile_pic}></img>}
                        </div>

                        {updateAbility &&
                            <div className="avatar-select-action">
                                <input type="file" style={{ visibility: "hidden" }} id="file" accept="image/png, image/jpeg" onChange={changeFileHandle} />

                                <label for="file">
                                    <span className="file-button">
                                        <i className="fa fa-upload mr-2" aria-hidden="true"></i>
                                        Choose Picture
                                    </span>
                                </label>
                            </div>}
                    </div>

                    <div className="my-profile-info">
                        <form>
                            <div className="form-group">
                                <label className="my-profile-info-label">Email address</label>
                                <input type="email" className="form-control mb-1" name="email" value={userInfo.email} disabled />

                                <label className="my-profile-info-label">Date of birth</label>
                                <input type="date" className="form-control mb-1" name="date_of_birth" value={userInfo.date_of_birth} disabled={!updateAbility} onChange={onChangeInputHandle} />

                                <label className="my-profile-info-label">Gender</label>

                                <div className="form-check" onChange={onChangeInputHandle}>
                                    <input className="gender-item" type="radio" name="gender" value="Male" checked={userInfo.gender === "Male"} disabled={!updateAbility} /> Male
                                    <input className="gender-item" type="radio" name="gender" value="Female" checked={userInfo.gender === "Female"} disabled={!updateAbility} /> Female
                                    <input className="gender-item" type="radio" name="gender" value="Unknown" checked={userInfo.gender === "Unknown"} disabled={!updateAbility} /> Other
                                </div>
                            </div>

                            {updateAbility && <div>
                                <button type="button" className="btn btn-danger mr-2" onClick={onCancelUpdateHandle}>Cancel</button>

                                <button type="button" className="btn btn-primary" onClick={onSaveUpdateHandle}>Save</button>
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;