const config_api = require("../../../../config/config").config_api;
const utils = require("../../../../utils/utils");
const axios = require('axios');

function getListMemberships(callback) {
    axios({
        url: config_api.memberships + "?project=" + utils.getProjectId(),
        method: 'GET',
        withCredentials: true,
        headers: {},
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

function getIdRole(callback) {
    axios({
        url: config_api.roles + "?project=" + utils.getProjectId(),
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

function getMemberSuggestions(callback) {
    axios({
        url: config_api.user + "?exclude_project=" + utils.getProjectId(),
        method: 'GET',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {}
    })
    .then(result => {
        return callback(false,  result.data)
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

function createMember(data, callback) {
    axios({
        url: config_api.memberships,
        method: 'POST',
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
        data: {
            "username": data.username,
            "project": utils.getProjectId(),
            "role": data.role
        }
    })
    .then(result => {
        return callback(false,  result.data)
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

function deleteMembership(id, callback) {
    axios({
        url: config_api.memberships + "/" + id,
        method: 'DELETE',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(result => {
        return callback(false,  result.data)
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

function editIsAdmin(data, callback) {
    axios({
        url: config_api.memberships + "/" + data.idMemberChange,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            "is_admin" : data.value
        }
    })
    .then(result => {
        return callback(false,  result.data)
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

function editRoleMember(data, callback) {
    axios({
        url: config_api.memberships + "/" + data.idMemberChange,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            "role": data.value
        }
    })
    .then(result => {
        return callback(false,  result.data)
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
    getListMemberships: getListMemberships,
    deleteMembership: deleteMembership,
    getIdRole: getIdRole,
    editIsAdmin: editIsAdmin,
    editRoleMember: editRoleMember,
    getMemberSuggestions: getMemberSuggestions,
    createMember: createMember
}