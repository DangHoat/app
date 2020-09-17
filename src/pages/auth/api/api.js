const config_api = require("../../../config/config").config_api;
const utils = require("../../../utils/utils");
const axios = require('axios');

function login(email, password, callback) {
    axios({
        url: config_api.signin,
        method: 'POST',
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        data: {
            "email": email,
            "password": password
        }
    })
        .then(result => {
            console.log(result);

            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response)
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message)
            }
        });
}

function register(data, callback) {
    axios({
        url: config_api.register,
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {
            "email": data.email,
            "full_name": data.full_name,
            "password": data.password
        }
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function activeAccount(request, callback) {
    axios({
        method: 'POST',
        url: config_api.verify,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "token": request.token,
            "email": request.email,
        }
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function recovery(email, callback) {
    axios({
        url: config_api.forgot_password,
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {
            "email": email
        }
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function createNewPass(new_pass, request, callback) {
    axios({
        url: config_api.forgot_password + "/new",
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "new_pass": new_pass,
            "token": request.token,
            "email": request.email,
        }
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

module.exports = {
    login: login,
    register: register,
    recovery: recovery,
    createNewPass: createNewPass,
    activeAccount: activeAccount
};