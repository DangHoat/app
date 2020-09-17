const config_api = require("../../../config/config").config_api;

const api = "http://uy-private-server.tinasoft.com.vn:3001/api/v1/issues"

const ValidInput = require('../../../utils/ValidInput');

const utils = require('../../../utils/utils')

const axios = require('axios');

const moment = require('moment')


function formatTime(time) {
    if (time === null) return null
    else {
        let timeFortmat = new Date(time)
        let curr_date = timeFortmat.getDate();
        let curr_month = timeFortmat.getMonth() + 1;
        let curr_year = timeFortmat.getFullYear();
        let result = curr_year + "-" + curr_month + "-" + curr_date
        return result

    }
}

//Lấy dữ liệu Issue
function getIssue(callback) {
    try {
        axios({
            url: api + "?project=" + utils.getProjectId(),
            withCredentials: true,
            method: 'GET', // phương thức gửi lên GET
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            }

        })
            .then(result => {
                let data = []
                let full_name_display;
                let photo;
                let id_assign;
                result.data.map((value, key) => {
                    //console.log((result.data[key]).id )
                    //console.log(value)
                    try {
                    if (!ValidInput.isEmpty(value.assigned_to)) {
                        // console.log(value.assigned_to.photo)
                        full_name_display = value.assigned_to.full_name
                        photo = value.assigned_to.photo
                        id_assign = value.assigned_to.photo.id
                    } else {
                        full_name_display = undefined;
                        photo = "";
                        id_assign = "";
                    }

                    let temp = {
                        id_assign: id_assign,
                        photo: photo,
                        full_name_display: full_name_display,
                        id: value.id,
                        ref: value.ref,
                        subject: value.subject,
                        type: value.type,
                        priority: value.priority,
                        severity: value.severity,
                        status: value.status,
                        created_date: value.created_date,
                        modified_date: value.modified_date,
                        is_blocked: value.is_blocked,
                        version: value.version,
                        // due_date: moment(value.due_date).format("DD MMM YYYY hh:mm"),
                        due_date: formatTime(value.due_date),
                        owner : value.owner.id,
                        nextID : !ValidInput.isEmpty((result.data[ key+1]))?(result.data[key+1]).id : "",
                        preID : !ValidInput.isEmpty((result.data[ key-1]))?(result.data[key-1]).id : "",
                
                    }
                    data.push(temp);
                    //console.log(temp)
                } catch (error) {
                        console.log(error)
                }
                    
                })
                //console.table(result.data)
                return callback(false, data)
                
            })
            .catch(error => {

                console.log(error)
                if (error.response) {
                    console.log(error.response)
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        console.log(error)
    }

}
///Lấy chi tiết 1 Issue theo id
function getDetail(id, callback) {
    try {
        axios({

            url: api + "/" + id,
            method: 'GET', // phương thức gửi lên GET
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            }

        })
            .then(result => {
                let data = []
                let full_name_display;
                let photo;
                let id_assign;
                let value = result.data
                console.log(value)
                if (!ValidInput.isEmpty(value.assigned_to)) {
                    // console.log(value.assigned_to.photo)
                    full_name_display = value.assigned_to.full_name
                    photo = value.assigned_to.photo
                    id_assign = value.assigned_to.photo.id
                } else {
                    full_name_display = undefined;
                    photo = "";
                    id_assign = "";
                }

                let temp = {
                    id_assign: id_assign,
                    photo: photo,
                    full_name_display: full_name_display,
                    description_html: value.description_html,
                    description: value.description,
                    tags: value.tags,
                    id: value.id,
                    ref: value.ref,
                    subject: value.subject,
                    type: value.type,
                    priority: value.priority,
                    severity: value.severity,
                    status: value.status,
                    created_date: value.created_date,
                    modified_date: value.modified_date,
                    is_blocked: value.is_blocked,
                    version: value.version,
                    owner : value.owner.id,
//                    due_date: moment(value.due_date).format("DD MMM YYYY hh:mm"),
                    due_date: formatTime(value.due_date),
                }
                data.push(temp);
                return callback(false, temp)
            })
            .catch(error => {

                console.log(error)
                if (error.response) {
                    console.log(error.response)
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        console.log(error)
    }

}
// Thêm mới 1 issue
function AddIssue(data, callback) {
    console.table(data)
    try {
        axios({
            url: api,
            method: 'POST', // phương thức gửi lên POST
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                //'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: {
                assigned_to: data.assigned_users[0],
                description: data.description.trim(),
                is_closed: false,
                priority: data.priority,
                type: data.type,
                project: utils.getProjectId(),
                severity: data.severity,
                status: data.status,
                subject: data.subject.trim(),
                tags: data.tags,
                due_date: data.due_date || 0,
            }
        })
            .then(result => {
                // console.log(result)
                return callback(false, result)
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });
    } catch (error) {
        console.log(error)
    }
}
//chỉnh sửa các trạng thái , status , description
function Update(id, data, callback) {
    try {

        axios({
            url: api + "/" + id,
            method: 'PATCH', // phương thức gửi lên PATCH
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                //   'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: {
                assigned_to: data.assigned_to,
                version: data.version,
                status: data.status,
                type: data.type,
                description: data.description,
                severity: data.severity,
                priority: data.priority,
                due_date: data.due_date
            }
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }

}
function deleteIssue(id, callback) {
    try {

        axios({
            url: api + "/" + id,
            method: 'DELETE', // phương thức gửi lên 
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: {
            }
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }
}


function uploadFile(id, file, callback, process) {
    try {

        const data = new FormData()
        data.append('project', utils.getProjectId())
        data.append('object_id', id)
        data.append('attached_file', file)
        // data.append('from_comment', false)

        axios({
            url: api + "/attachments",
            method: "POST",
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
                // Authorization: "Bearer " + utils.getAuthToken()
            },
            data: data,
            onUploadProgress: ProgressEvent => {
                return process(ProgressEvent.loaded / ProgressEvent.total * 100 | 0)

            }
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }

}
function getAttachment(id, callback) {
    try {

        axios({
            url: api + "/" + "attachments?object_id=" + id,
            method: 'GET', // phương thức gửi lên 
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: {
            }
        })
            .then(result => {
                return callback(false, result.data)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }

}

function editAttachment(id, method, callback) {
    try {

        axios({
            url: api + "/" + "attachments/" + id,
            method: method, // phương thức gửi lên 
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                //'authorization': "Bearer " + utils.getAuthToken()
            },
            data: {
            }
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }


}
function sendComment(id, data, callback) {
    try {
        console.log(id)
        console.log(data)
        axios({
            url: api + "/" + id,
            method: 'PATCH', // phương thức gửi lên 
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: {
                comment: data.comment,
                version : data.version
            }
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }
}

function getHistory(id, type, callback) {
    try {
        axios({
            url: config_api.path+"history/issues/" + id +"?type="+type,
            method: 'GET', // phương thức gửi lên 
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: null
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }
}
function editComment() {

}
function getMemberProject (callback){
    try {
        axios({
            url: config_api.project + "/" + utils.getProjectId(),
            method: 'GET', // phương thức gửi lên 
            withCredentials: true,
            headers: {
                "Content-type": "application/json; charset=utf-8", //header
                // 'authorization': 'Bearer ' + JSON.parse(userInfo).token
            },
            data: null
        })
            .then(result => {
                return callback(false, result)

            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                    return callback(error.response)
                } else if (error.request) {
                    // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                    return callback("Please check your internet connection to server");
                } else {
                    console.log(error.message);
                    // Lỗi khi thiết lập request status
                    return callback(error.message)
                }
            });

    } catch (error) {
        return callback(error)
    }
}


module.exports = {
    getMemberProject : getMemberProject,
    getIssue: getIssue,
    AddIssue: AddIssue,
    Update: Update,
    deleteIssue: deleteIssue,
    getDetail: getDetail,

    uploadFile: uploadFile,
    editAttachment: editAttachment,
    getAttachment: getAttachment,

    sendComment: sendComment,
    editComment: editComment,
    getHistory: getHistory

}