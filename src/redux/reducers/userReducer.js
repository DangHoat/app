import * as types from "../constants";

const userInitialState = {
    user: {}
}

export default function reducer(state = userInitialState, action) {
    switch (action.type) {
        case types.LOGIN_USER:
            return { ...state, user: action.user };
        case types.ME_FROM_TOKEN:
            return { ...state, user: {} };
        default:
            return state;
    }
}


