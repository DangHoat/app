const api = require("../../../config/config");
const ValidInput = require("../../../utils/ValidInput");

function getIdRole(callback) {
    try {
        // Check valid input /
        const project = localStorage.getItem("project");
        const userInfo = localStorage.getItem("userInfo");
        if (ValidInput.isEmpty(project))
        return callback("No project changed");
        if (ValidInput.isEmpty(userInfo))
            return callback("Not user changed");
    /**/
    fetch(api.config_api.roles + "?project=" + JSON.parse(project)._id, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + JSON.parse(userInfo).token
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(
            (result) => {
                let data = [];
                result.map(({id,name,permissions}) => {
                    let element = {
                        id: id,
                        name: name,
                        permissions: permissions
                    };
                    data.push(element);
                });
                return data;
            },
            (error) => {
                /* Nếu response trả về là badrequest, unauth, .... (nói chung là trừ success) thì sẽ thực hiện convert tiếp sang json lỗi */
                throw (error.statusText)
            }
        )
        .then(
            (data) => {
                /* Nếu response đúng*/
                return callback(false, data);
            },
            (error) => {
                /* Nếu có response json lỗi thì thực hiện đoạn lệnh này */
                return callback(error);
            }
        )
        .catch(
            /* Chỗ này chỉ chạy khi convert json lỗi */
            (error) => {
                return callback(error);
            }
        )
    } catch (e) {
        return callback(e);
    }
}

function createRole(inputRoleName,callback) {
    try {
        // Check valid input /
        const project = localStorage.getItem("project");
        const userInfo = localStorage.getItem("userInfo");
        if (ValidInput.isEmpty(project))
        return callback("No project changed");
        if (ValidInput.isEmpty(userInfo))
            return callback("Not user changed");
    /**/
    fetch(api.config_api.roles, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + JSON.parse(userInfo).token
        },
        body: JSON.stringify({
            "project" : JSON.parse(project)._id,
            "name": inputRoleName,
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(
            (result) => {
                let data = {
                    id: result.id,
                    name: result.name,
                    permissions: result.permissions
                };
                return data;
            },
            (error) => {
                /* Nếu response trả về là badrequest, unauth, .... (nói chung là trừ success) thì sẽ thực hiện convert tiếp sang json lỗi */
                throw (error.statusText)
            }
        )
        .then(
            (data) => {
                /* Nếu response đúng*/
                return callback(false, data);
            },
            (error) => {
                /* Nếu có response json lỗi thì thực hiện đoạn lệnh này */
                return callback(error);
            }
        )
        .catch(
            /* Chỗ này chỉ chạy khi convert json lỗi */
            (error) => {
                return callback(error);
            }
        )
    } catch (e) {
        return callback(e);
    }
}

function deleteRole(input,callback) {
    try {
        // Check valid input /
        const project = localStorage.getItem("project");
        const userInfo = localStorage.getItem("userInfo");
        if (ValidInput.isEmpty(project))
        return callback("No project changed");
        if (ValidInput.isEmpty(userInfo))
            return callback("Not user changed");
    /**/
    fetch(api.config_api.roles + "/" + input.idTeamDelete+"?moveTo="+input.idTeamMoveTo, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + JSON.parse(userInfo).token
        }
    })
        .then(res => {
            if (res.ok) {
                return res.ok;
            } else {
                throw res;
            }
        })
        .then(
            (result) =>{
                return result;
            },
            (error) => {
                /* Nếu response trả về là badrequest, unauth, .... (nói chung là trừ success) thì sẽ thực hiện convert tiếp sang json lỗi */
                throw (error.statusText)
            }
        )
        .then(
            (data) => {
                /* Nếu response đúng*/
                return callback(false, data);
            },
            (error) => {
                /* Nếu có response json lỗi thì thực hiện đoạn lệnh này */
                return callback(error);
            }
        )
        .catch(
            /* Chỗ này chỉ chạy khi convert json lỗi */
            (error) => {
                return callback(error);
            }
        )
    } catch (e) {
        return callback(e);
    }
}

function editRoleName(dataInput,callback) {
    try {
        // Check valid input /
        const project = localStorage.getItem("project");
        const userInfo = localStorage.getItem("userInfo");
        if (ValidInput.isEmpty(project))
        return callback("No project changed");
        if (ValidInput.isEmpty(userInfo))
            return callback("Not user changed");
    /**/
    fetch(api.config_api.roles + "/" + dataInput.id, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + JSON.parse(userInfo).token
        },
        body: JSON.stringify({
            "name" : dataInput.name
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(
            (result) => {
                return result.name;
            },
            (error) => {
                /* Nếu response trả về là badrequest, unauth, .... (nói chung là trừ success) thì sẽ thực hiện convert tiếp sang json lỗi */
                throw (error.statusText)
            }
        )
        .then(
            (data) => {
                /* Nếu response đúng*/
                return callback(false, data);
            },
            (error) => {
                /* Nếu có response json lỗi thì thực hiện đoạn lệnh này */
                return callback(error);
            }
        )
        .catch(
            /* Chỗ này chỉ chạy khi convert json lỗi */
            (error) => {
                return callback(error);
            }
        )
    } catch (e) {
        return callback(e);
    }
}

function editPermission(dataInput,callback) {
    try {
        // Check valid input /
        const project = localStorage.getItem("project");
        const userInfo = localStorage.getItem("userInfo");
        if (ValidInput.isEmpty(project))
        return callback("No project changed");
        if (ValidInput.isEmpty(userInfo))
            return callback("Not user changed");
    /**/
    fetch(api.config_api.roles + "/" + dataInput.id, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + JSON.parse(userInfo).token
        },
        body: JSON.stringify({
            "permissions" : JSON.stringify(dataInput.ValidInput)
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(
            (result) => {
                return result.permissions;
            },
            (error) => {
                /* Nếu response trả về là badrequest, unauth, .... (nói chung là trừ success) thì sẽ thực hiện convert tiếp sang json lỗi */
                throw (error.statusText)
            }
        )
        .then(
            (data) => {
                /* Nếu response đúng*/
                return callback(false, data);
            },
            (error) => {
                /* Nếu có response json lỗi thì thực hiện đoạn lệnh này */
                return callback(error);
            }
        )
        .catch(
            /* Chỗ này chỉ chạy khi convert json lỗi */
            (error) => {
                return callback(error);
            }
        )
    } catch (e) {
        return callback(e);
    }
}



module.exports = {
    deleteRole: deleteRole,
    getIdRole: getIdRole,
    editRoleName: editRoleName,
    createRole: createRole,
    editPermission: editPermission
}