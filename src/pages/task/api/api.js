const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../utils/utils");
const config_api = require("../../../config/config").config_api;
const axios = require('axios');

function getTaskOfWork(id, callback) {
    axios({
        url: config_api.task + "?project=" + utils.getProjectId() + "&user_story=" + id,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

function getTaskDetail(id, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

function createTask(id, data, callback) {
    axios({
        url: config_api.task,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
        },
        data: {
            project: utils.getProjectId(),
            user_story: id,
            subject: data.subject,
            assigned_to: data.assigned_to
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

function removeTask(id, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
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

function modifyTask(id, data, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
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

function getTaskStatus(callback) {
    axios({
        url: config_api.task_status + "?project=" + utils.getProjectId(),
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

function postAttachments(id, file, callback, process) {
    const data = new FormData()
    data.append('project', utils.getProjectId())
    data.append('object_id', id)
    data.append('attached_file', file)
    axios({
        url: "http://80.211.131.237:3001/api/v1/tasks/attachments",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
            Authorization: "Bearer " + utils.getAuthToken()
        },
        data: data,
        onUploadProgress: ProgressEvent => {

            return process(ProgressEvent.loaded / ProgressEvent.total * 100 | 0)

        }
    })
        .then(result => {
            return callback(false, result.data);

        })
        .catch(error => {
            if (error.response) {
                return callback(error.response);
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message);
            }
        });
}

function getAttachmentsOfTask(id, callback) {
    axios({
        url: config_api.task_attachments + "?object_id=" + id + "&project=" + utils.getProjectId(),
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

function removeAttachments(id, callback) {
    axios({
        url: config_api.task_attachments + "/" + id,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
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

function getComment(id, callback) {
    axios({
        url: config_api.task_comment + id + "?type=comment",
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken(),
            "x-disable-pagination": "1"
        }
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response);
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message);
            }
        });
}

function sendComment(id, data, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
        },
        data: data
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response);
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message);
            }
        });
}

module.exports = {
    getTaskDetail: getTaskDetail,

    getTaskOfWork: getTaskOfWork,

    createTask: createTask,
    removeTask: removeTask,
    modifyTask: modifyTask,
    getTaskStatus: getTaskStatus,

    removeAttachments: removeAttachments,
    postAttachments: postAttachments,
    getAttachmentsOfTask: getAttachmentsOfTask,

    getComment: getComment,
    sendComment: sendComment,
};