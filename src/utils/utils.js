/**
 * @return {string}
 */
Array.prototype.findIndex = function (obj) {
    let keys = Object.keys(obj);
    for (let i = 0; i < this.length; i++) {
        let check = true;
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j];
            if (obj[key] !== this[i][key]) {
                check = false;
                break;
            }
        }
        if (check)
            return i;
    }
    return -1;
};


const ValidInput = require("./ValidInput");


function Fencode(str) {
    let tmp = '';
    for (let i = 0; i < str.length; i++) {
        if ((str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) || (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) || (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) || str[i] === '_' || str[i] === '-')
            tmp = tmp + str[i];
    }
    return tmp;
}

function returnThisWhenNull(source, result_when_null) {
    return (ValidInput.isEmpty(source) ? result_when_null : source);
}

function copyState(state) {
    return JSON.parse(JSON.stringify(state));
}

function randomString(length) {
    if (length === undefined)
        length = 20;
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function isExpired(date) {
    if (ValidInput.isEmpty(date))
        return false;
    let now = new Date();
    let dt = new Date(date);
    return (dt.getTime() - now.getTime() < 0);
}

function getObjectValueSameKey(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        obj[arr[i].toString()] = arr[i].toString();
    }
    return obj;
}



//-----------------Project--------------//
function getProjectId() {
    try {
        return JSON.parse(sessionStorage.getItem("project")).id;
    } catch (e) {
        return null;
    }
}

function getPermissionInProject() {
    let project = JSON.parse(sessionStorage.getItem("project"));
    let role = {
        "admin": project.i_am_admin,
        "member": project.i_am_member,
        "owner": project.i_am_owner
    };
    return (role);
}

//--------------------------------------//

function getWikiId() {
    try {
        return JSON.parse(localStorage.getItem('wiki')).id;
    } catch (e) {
        return null;
    }
}
function getWikiVersion() {
    try {
        return JSON.parse(localStorage.getItem('wiki')).version;
    } catch (e) {
        return null;
    }
}


module.exports = {
    Fencode: Fencode,
    returnThisWhenNull: returnThisWhenNull,
    copyState: copyState,
    randomString: randomString,
    isExpired: isExpired,
    getPermissionInProject: getPermissionInProject,
    ValidInput: ValidInput,
    getObjectValueSameKey: getObjectValueSameKey,
    getProjectId: getProjectId,
    getWikiId: getWikiId,
    getWikiVersion: getWikiVersion,
}