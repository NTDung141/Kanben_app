import ACTIONS from "../actions";

const initialState = {
    username: "",
    email: "",
    token: "",
    isAdmin: false
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return action.payload.user

        case ACTIONS.LOGOUT:
            return initialState

        default:
            return state
    }
}

export default AuthReducer;