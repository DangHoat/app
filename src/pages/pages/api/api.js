const config_api = require("../../../config/config").config_api;
const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../utils/utils");
const axios = require('axios');
/***
 *
 * @param id
 * @param callback
 * @returns {*}
 * result modal
 * [
 * {
 *     id: Number,
 *     version: Number,
 *     name: String,
 *     time: {
 *         created_date: String,
 *         due_date: String
 *     },
 *     member: [Number],
 *     tags: [String],
 *     status: String
 * }
 * ]
 */

function listMemberships(callback) {
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

module.exports = {
    listMemberships: listMemberships,
    getIdRole: getIdRole
};
