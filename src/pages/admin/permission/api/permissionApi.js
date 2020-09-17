const config_api = require("../../../../config/config").config_api;
const ValidInput = require("../../../../utils/ValidInput");
const utils = require("../../../../utils/utils");
const axios = require('axios');

function getIdRole(callback) {
    axios({
        url: config_api.roles + "?project=" + utils.getProjectId(),
        method: 'GET',
        withCredentials: true,
        headers: {
            'x-disable-pagination': 1
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
function createRole(dataInput, callback) {
    const project = utils.getProjectId();
    axios({
        url: config_api.roles,
        method: 'POST',
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        data: {
            "project": project,
            "subject": dataInput
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

function deleteRole(dataInput, callback) {
    axios({
        url: config_api.roles + "/" + dataInput.idTeamDelete + "?moveTo=" + dataInput.idTeamMoveTo,
        method: 'DELETE',
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
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

function editRoleName(dataInput, callback) {
    const project = utils.getProjectId();
    if (ValidInput.isEmpty(project))
        return callback("No project changed");
    axios({
        url: config_api.roles + "/" + dataInput.id,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        data: {
            "name": dataInput.name
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

function editPermission(dataInput, callback) {
    axios({
        url: config_api.roles + "/" + dataInput.id,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        data: {
            "permissions": dataInput.ValidInput
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
    deleteRole: deleteRole,
    getIdRole: getIdRole,
    editRoleName: editRoleName,
    createRole: createRole,
    editPermission: editPermission,
}