const config_api = require("../../../config/config").config_api;
const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../utils/utils");
const axios = require('axios');

// function getEpics(callback) {
//     ModalAPI({
//         url: config_api.epic + "?project=" + utils.getProjectId(),
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json',
//             'Authorization': 'Bearer ' + utils.getAuthToken()
//         }
//     },  [utils.getObjectValueSameKey(["id", "subject", "project_extra_info", "assigned_to_extra_info", "created_date", "status_extra_info", "user_story_count", "owner_extra_info"])], (err, result)=>{
//         // console.log("API getEpics: ");
//         // console.log(result);
//         if(err){
//             return callback(err);
//         } else {
//             return callback(null, result);
//         }
//     })
// }

function getEpics(callback) {
    axios({
        url: config_api.epic + "?project=" + utils.getProjectId(),
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + utils.getAuthToken()
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

// function getEpicWorks(epicId, callback) {
//     ModalAPI({
//         url: config_api.work + "?epic=" + epicId + "&include_tasks=true&order_by=epic_order",
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json',
//             'Authorization': 'Bearer ' + utils.getAuthToken()
//         }
//     // },  [utils.getObjectValueSameKey(["id", "assigned_to_extra_info", "created_date", "project_extra_info", "subject", "owner_extra_info"])], (err, result)=>{
//     },  [utils.getObjectValueSameKey(["id", "subject", "project_extra_info", "assigned_to_extra_info", "created_date", "status_extra_info", "owner_extra_info"])], (err, result)=>{
//         if(err){
//             return callback(err);
//         } else {
//             console.log("API getEpicWorks: ");
//             console.log(result);
//             return callback(null, result);
//         }
//     })
// }

function getEpicWorks(epicId, callback) {
    axios({
        url: config_api.work + "?epic=" + epicId + "&include_tasks=true&order_by=epic_order",
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + utils.getAuthToken()
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

    })
}

// function createEpic(data, callback){
//     ModalAPI({
//         url: config_api.epic,
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + utils.getAuthToken()
//         },
//         body: {
//             "project": utils.getProjectId(),
//             "subject": data.subject,
//             "description": data.description,
//             // "assigned_to": data.assigned_to,
//             "tags": data.tags
//         }
//     }, utils.getObjectValueSameKey(["id", "subject", "project_extra_info", "assigned_to_extra_info", "created_date", "status_extra_info", "user_story_count", "owner_extra_info"]), (err, result)=>{
//         if(err){
//             return callback(err);
//         } else {
//             return callback(null, result);
//         }
//     })
// }

function createEpic(data, callback){
    ModalAPI({
        url: config_api.epic,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
        },
        data: {
            "project": utils.getProjectId(),
            "subject": data.subject,
            "description": data.description,
            // "assigned_to": data.assigned_to,
            "tags": data.tags
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

function modifyEpic(epicId, data, callback){
    ModalAPI({
        url: config_api.epic + "/" + epicId,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
        },
        body: data
    }, utils.getObjectValueSameKey(["id", "subject", "project_extra_info", "assigned_to_extra_info", "status_extra_info", "user_story_count", "owner_extra_info"]), (err, result)=>{
        if(err){
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

module.exports = {
    getEpics: getEpics,
    getEpicWorks: getEpicWorks,
    createEpic: createEpic,
    modifyEpic: modifyEpic,
};
