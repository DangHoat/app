const config_network = {
    "host": "http://uy-private-server.tinasoft.com.vn",
    "port": "3001"
};

const api_path = config_network.host + ':' + config_network.port + "/api/v1/";

const config_api = {
    "path": api_path,
    // Auth
    "signin": api_path + "auth",
    "register": api_path + "auth/register",
    "verify": api_path + "auth/verify",
    "forgot_password": api_path + "auth/create_new_pass",
    "user": api_path + "users",
    // project
    "project": api_path + "projects",
    //Epic
    "epic": api_path + "epics",
    // Work
    "work": api_path + "works",
    "work_comment": api_path + "history/works/",
    //Task
    "task": api_path + "tasks",
    "task_status": api_path + "task-statuses",
    "task_attachments": api_path + "tasks/attachments",
    "task_comment": api_path + "history/tasks/",
    // Timeline
    "timeline": api_path + "timeline/project/",
    "timeline_profile": api_path + "timeline/profile/",
    "timeline_user": api_path + "timeline/user",
    "activities": api_path + "history/userstory/",
    // Notification
    "notification": api_path + "web-notifications",
    // member
    "memberships": api_path + "memberships",
    "roles": api_path + "roles",
    // Report
    "kpi": api_path + "stats/kpi",
    //comment
    "comment": api_path + "history/works/"
};

module.exports = {
    config_network: config_network,
    config_api: config_api
};
