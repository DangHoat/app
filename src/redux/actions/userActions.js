import * as types from "../constants";
const axios = require('axios');
export function loginUser() {
    return {
        type: types.LOGIN_USER
    };
}

export function meFromToken() {
    const request = axios({
        url: 'http://uy-private-server.tinasoft.com.vn:3001/api/v1/users/me',
        method: 'GET',
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8"
        }
    });

    return {
        type: types.ME_FROM_TOKEN,
        payload: request
    };
}

