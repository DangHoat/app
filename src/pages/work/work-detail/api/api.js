const config_api = require("../../../../config/config").config_api;
// const ModalAPI = require("../../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../../utils/utils");
const api_work = require("../../api/api");
const api_task = require("../../../task/api/api");
const axios = require("axios");

function getInfoProject(callback) {
  /* Check valid input */
  axios({
    url: config_api.project + "/" + utils.getProjectId(),
    method: "GET",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
    },
    data: {}
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

function getAttachmentsOfWork(id, callback) {
  axios({
    url:
      "http://uy-private-server.tinasoft.com.vn:3001/api/v1/works/attachments?object_id=" +
      id,
    method: "GET",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
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

function removeAttachments(id, callback) {
  axios({
    url:
      "http://uy-private-server.tinasoft.com.vn:3001/api/v1/works/attachments/" +
      id,
    method: "DELETE",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    },
    body: null
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
function postAttachments(id, file, callback, process) {
  // console.log(utils.getProjectId());
  const data = new FormData();
  data.append("project", utils.getProjectId());
  data.append("object_id", id);
  data.append("attached_file", file);
  data.append("from_comment", false);
  axios({
    url:
      "http://uy-private-server.tinasoft.com.vn:3001/api/v1/works/attachments",
    method: "POST",
    withCredentials: true,
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    },
    data: data,
    onUploadProgress: ProgressEvent => {
      return process(((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0);
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
function getActivities(id, page, callback) {
  axios({
    url: config_api.activities + id + "?page=" + page + "&type=activity",
    method: "GET",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
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

function getComment(id, callback) {
  axios({
    url: config_api.comment + id + "?type=comment",
    method: "GET",
    withCredentials: true,
    headers: {
      "Content-type": "application/json",
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
    url: config_api.work + "/" + id,
    method: "PATCH",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
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

function getWorkDetail(id, callback) {
  console.log(id);

  axios({
    url: config_api.work + "/" + id,
    method: "GET",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
    },
    data: {}
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

function getTaskOfWork(id, callback) {
  axios({
    url: config_api.task + "?work=" + id,
    method: "GET",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
    },
    data: {}
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

function createTask(id, data, callback) {
  axios({
    url: config_api.task,
    method: "POST",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
    },
    data: {
      subject: data.subject,
      work: id,
      project: utils.getProjectId(),
      status: data.status,
      assigned_to: data.assigned_to,
      due_date: data.due_date
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

function removeTask(id, callback) {
  axios({
    url: config_api.task + "/" + id,
    method: "DELETE",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
    },
    data: {}
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

function modifyTask(id, data, callback) {
  axios({
    url: config_api.task + "/" + id,
    method: "PATCH",
    withCredentials: true,
    headers: {
      "Content-type": "application/json"
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

  // ModalAPI({
  //     url: config_api.task + "/" + id,
  //     method: "PATCH",
  //     headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + utils.getAuthToken()
  //     },
  //     body: data
  // }, utils.getObjectValueSameKey(["id", "project_extra_info", "subject", "version", "description_html", "due_date", "assigned_to", "watchers", "tags", "status"]), (err, result)=>{
  //     if(err){
  //         return callback(err);
  //     } else {
  //         return callback(null, result);
  //     }
  // })
}

module.exports = {
  getInfoProject: getInfoProject,

  getActivities: getActivities,
  getComment: getComment,
  sendComment: sendComment,

  getTaskOfWork: getTaskOfWork,
  createTask: createTask,
  removeTask: removeTask,
  modifyTask: modifyTask,
  getTaskStatus: api_task.getTaskStatus,

  getAttachmentsOfWork: getAttachmentsOfWork,
  postAttachments: postAttachments,
  removeAttachments: removeAttachments,

  getWorkDetail: getWorkDetail,
  removeWork: api_work.removeWork,
  modifyWork: api_work.modifyWork
};
