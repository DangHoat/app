const config_api = require("../../../config/config").config_api;
const axios = require('axios');
const utils = require("../../../utils/utils");

function getInfoProjectAll(callback) {        
    axios({
        url: config_api.project,
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
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

function getInfoProject(id,callback) {
    /* Check valid input */
    let id_project;
    if(id==="this"){
        id_project = utils.getProjectId();
    } else {
        id_project = id;
    }
    
    axios({
        url: config_api.project + "/" + id_project,
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
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

module.exports = {
    getInfoProjectAll: getInfoProjectAll,
    getInfoProject: getInfoProject
};