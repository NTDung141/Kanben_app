import React, { useState } from 'react';

function ResetPassword() {

    const [email, setEmail] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setEmail(value)
    }

    const handleSubmit = () => {
        console.log(email)
        setEmail("")
    }

    return (
        <div>
            <div class="form-text login-form-text flex-start" data-toggle="modal" data-target="#exampleModalCenter">
                Forgot the password?
            </div>

            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Reset password</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <label className="form-label flex-start">Email address</label>
                            <input type="email" className="form-control" name="email" value={email} onChange={handleChange} />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={handleSubmit}>Get new password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;