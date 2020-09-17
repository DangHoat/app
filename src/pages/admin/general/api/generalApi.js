const config_api =  require("../../../../config/config").config_api;
const utils = require("../../../../utils/utils");
const axios = require('axios');

function getInfoProject(callback) {    
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

function modifyProject(id_project,data,callback) { 
    axios({
        url: config_api.project + "/" + id_project,
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: data
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

function deleteProject(id_project, password, callback) {
    axios({
        url: config_api.project + "/" + id_project,
        method: 'DELETE',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            "password": password
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

function changePhoto(logo,callback) {   
    axios({
        url: config_api.project + "/" + utils.getProjectId() + "/change_logo",
        method: 'POST',
        withCredentials: true,
        headers: {},
        data: logo
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

function addTag(data,callback) {   
    axios({
        url: config_api.project + "/" + utils.getProjectId(),
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            "tags": data.tags
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

function removeTag(data,callback) {   
    axios({
        url: config_api.project + "/" + utils.getProjectId(),
        method: 'PATCH',
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            "tags": data.tags
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
    modifyProject: modifyProject,
    deleteProject: deleteProject,
    changePhoto: changePhoto,
    addTag: addTag,
    removeTag: removeTag
}