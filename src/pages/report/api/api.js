const config_api = require("../../../config/config").config_api;
const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../utils/utils");
const axios = require('axios');

//KPI Report
function getWorksKPI(callback) {
    axios({
        url: config_api.kpi + "/" + utils.getProjectId(),
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
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

function filterWorksKPI(start_date, end_date, callback) {
    axios({
        url: config_api.kpi + "/" + utils.getProjectId(),
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            start_date: start_date,
            end_date: end_date,
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

function getChartKPI(start_date, end_date, member, callback) {
    axios({
        url: config_api.kpi + "/" + utils.getProjectId(),
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            memberId: member.id,
            start_date: start_date,
            end_date: end_date,

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
//Task Report
function getTaskReport(callback) {
    axios({
        url: "http://uy-private-server.tinasoft.com.vn:3001/api/v1/stats/task_report/" + utils.getProjectId(),
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(result => {
            console.log(result);

            return callback(false, result.data)
        })
        .catch(error => {
            console.log(error);

            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function filterTask(start_date, end_date, callback) {
    axios({
        url: "http://uy-private-server.tinasoft.com.vn:3001/api/v1/stats/task_report/" + utils.getProjectId(),
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
        data: {
            start_date: start_date,
            end_date: end_date,
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
    getWorksKPI: getWorksKPI,
    filterWorksKPI: filterWorksKPI,
    getChartKPI: getChartKPI,
    getTaskReport: getTaskReport,
    filterTask: filterTask
}
