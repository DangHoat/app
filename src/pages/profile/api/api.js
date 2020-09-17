const config_api = require("../../../config/config").config_api;
// const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const {getAuthToken, getUserId} = require("../../../utils/utils")
// const {getObjectValueSameKey} = require("../../../utils/utils")
const axios = require('axios');

function ModalAPI_(url,method,headers,data,callback){
    axios({
        url: url,
        method: method,
        headers: headers,
        data: data
    }).then(result => {
        return callback(false, result.data)
    }).catch(error => {
        if (error.response) {
            return callback(error.response)
        } else if (error.request) {
            return callback("Please check your internet connection to server");
        } else {
            return callback(error.message) 
        }
    });
}
function getUserInfo(email, callback) {
    if (email === '' && window.location.search === '')
        ModalAPI_(config_api.path+'users/me', 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err,result)=>{
                if(err) {return callback(err)}
                else {return callback(null, result)}
            }
        )
    else
        ModalAPI_(config_api.path+'users?email='+email, 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err, result) => {
                if (err) {return callback(err)}
                else {return callback(null, result[0])}
            }
        )
}
function getContacts(id, callback) {
    ModalAPI_(config_api.user+`/${id}/contacts`, 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err, result) => {
        if (err) {return callback(err)}
        else {return callback(null, result)}
    }
)
}
function getWatched(id, callback) {
    ModalAPI_(config_api.path+`users/${id}/watched`, 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err,result)=>{
        if(err) {return callback(err)}
        else {return callback(null, result)}
    }
)
}
function getProject(id, callback) {
    ModalAPI_(config_api.project+`?member=${id}`, 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err, result) => {
            if (err) {return callback(err)}
            else {return callback(null, result)}
        }
    )
}

function updateUserInfo(data, callback) {
    ModalAPI_(config_api.path+'users/'+getUserId(), 'PATCH',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, data, (err, result) => {
            if (err) {return callback(err)}
            else {return callback(null, result)}
        }
    )
}

function updateAvatar(photo, callback) {
    ModalAPI_(config_api.path+'users/change_avatar', 'POST', {'authorization':'Bearer ' + getAuthToken()}, photo, (err, result) => {
            if (err) {return callback(err)}
            else {return callback(null, result)}
        }
    )
}

function changePassword(data, callback){
    ModalAPI_(config_api.path+'users/change_password', 'POST', {'authorization':'Bearer ' + getAuthToken()}, data, (err, result) => {
            if (err) {return callback(err)}
            else {return callback(null, result)}
        }
    )
}

function getTimeline(id, callback) {
    if (id === JSON.parse(localStorage.getItem("userInfo")).id)
        ModalAPI_(config_api.path+'timeline/profile', 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err,result)=>{
        // ModalAPI_(config_api.path+'timeline/profile?order_by=-created_date', 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err,result)=>{
                if(err) {return callback(err)}
                else {return callback(null, result)}
            }
        )
    else 
        ModalAPI_(config_api.path+`timeline/user/${id}`, 'GET',{'content-type':'application/json','authorization':'Bearer '+getAuthToken()}, null, (err,result)=>{
                if(err) {return callback(err)}
                else {return callback(null, result)}
            }
        )
}
module.exports = {
    getUserInfo: getUserInfo,
    getContacts: getContacts,
    getWatched: getWatched,
    getProject: getProject,
    updateUserInfo: updateUserInfo,
    updateAvatar: updateAvatar,
    changePassword: changePassword,
    getTimeline: getTimeline,
};
