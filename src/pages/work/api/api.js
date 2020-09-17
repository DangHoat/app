const config_api = require("../../../config/config").config_api;
const utils = require("../../../utils/utils");
const axios = require('axios');

function getInfoProject(callback) {
    /* Check valid input */
    axios({
        url: config_api.project + "/" + utils.getProjectId(),
        method: 'GET',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {}
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

function getWorkOfProject(callback) {
    axios({
        url: config_api.work + "?project=" + utils.getProjectId(),
        method: 'GET',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {}
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

function removeWork(id, callback) {
    axios({
        url: config_api.work + "/" + id,
        method: 'DELETE',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {}
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

function createWork(data, callback) {
    axios({
        url: config_api.work,
        method: 'POST',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            "project": utils.getProjectId(),
            "subject": data.subject,
            "description": data.description,
            "assigned_users": data.assigned_users,
            "due_date": data.due_date,
            "tags": data.tags,
            "status": data.status
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

function modifyWork(id, data, callback) {
    axios({
        url: config_api.work + "/" + id,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
        data: {
            "project": utils.getProjectId(),
            "subject": data.subject,
            "description": data.description,
            "version": 1,
            "assigned_users": data.assigned_users,
            "due_date": data.due_date,
            "tags": data.tags,
            "status": data.status
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
    getInfoProject: getInfoProject,
    getWorkOfProject: getWorkOfProject,
    removeWork: removeWork,
    createWork: createWork,
    modifyWork: modifyWork
};




