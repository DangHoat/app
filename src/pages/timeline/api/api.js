const config_api = require("../../../config/config").config_api;
const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../utils/utils");
const axios = require('axios');

function getActivities(page, callback) {
    axios({
        url: config_api.timeline + utils.getProjectId(),
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

function getInfoProject(callback) {
    axios({
        url: config_api.project + "/" + utils.getProjectId(),
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
    getActivities: getActivities,
    getInfoProject: getInfoProject
};