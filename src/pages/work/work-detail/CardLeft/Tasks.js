import React from "react";
import "../WorkDetail.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    Card, CardHeader, CardBody, Table,
    Input,
    FormGroup
} from "reactstrap"
import { ModalAssignUser, ModalConfirm } from "../../../../components/Modal";
import { CustomImg, LoadingSprinner, Attachments, Description, Notification } from "../../../../components/CustomTag";
import moment from 'moment'
const api = require("../api/api");
const ValidInput = require("../../../../utils/ValidInput");
const utils = require("../../../../utils/utils");

let memberInProject = [];

const work_id = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;


class RowTaskCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assign: false,
            assigned_to: null,
            data: {},
            due_date: null
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        this.props.handleSetDueDate(this.props.data.id, event.target.value);
    }
    handleAssignUser(userSelected) {
        this.setState({ assigned_to: utils.returnThisWhenNull(userSelected[0], null) });
        this.toggle("assign");
    }

    handleCreateTask() {
        let subject = document.getElementById("tasks-input-subject-new").value;
        let status = document.getElementById("tasks-input-status-new").value;
        let due_date = utils.ValidInput.isEmpty(document.getElementById("tasks-input-due-date-new").value) ? null : document.getElementById("tasks-input-due-date-new").value;
        this.props.handleCreateTask({ subject: subject, status: status, due_date: due_date, assigned_to: this.state.assigned_to });
    }

    handleCancel() {
        this.props.handleCancel();
    }

    onKeyDown(e) {
        if (e.key === "Escape") {
            this.handleCancel()
        }
        if (e.key === "Enter") {
            this.handleCreateTask();
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data
            };
        }
        return null;
    }
    render() {
        const { memberInProject } = this.props;
        return (
            <React.Fragment>
                <ModalAssignUser
                    isOpen={this.state.assign}
                    userSelected={utils.ValidInput.isEmpty(this.state.assigned_to) ? [] : [this.state.assigned_to]}
                    allUsers={memberInProject}
                    mode="single"
                    handleSave={this.handleAssignUser.bind(this)}
                />
                <tr>
                    <td className="width-percent-10 text-left">
                        {
                            // !this.state.isHover
                            //     ?
                            // this.props.id + 1
                            // :
                            // <React.Fragment>
                            //     <FontAwesomeIcon icon={faPen}
                            //                     onClick={this.toggle.bind(this, "edit")}
                            //                     className="mr-2 cursor-pointer"/>
                            //     <FontAwesomeIcon icon={faTrash}
                            //                     onClick={this.toggle.bind(this, "remove")}
                            //                     className="cursor-pointer"/>
                            // </React.Fragment>
                            <React.Fragment>
                                <FontAwesomeIcon icon={faSave}
                                    onClick={this.handleCreateTask.bind(this)}
                                    className="cursor-pointer mr-1"
                                />
                                {/* <FontAwesomeIcon 
                                        icon={faTrash}
                                        onClick={this.handleCancel.bind(this)}
                                        className="cursor-pointer"
                                    /> */}
                            </React.Fragment>
                        }
                    </td>
                    <td className="width-percent-20">
                        <Input type="text"
                            className="width-percent-80 display-clear"
                            onKeyDown={this.onKeyDown.bind(this)}
                            id={"tasks-input-subject-new"}
                        />
                    </td>
                    <td className="width-percent-25" >
                        {
                            <Input
                                type="date"
                                name="due_date"
                                id={"tasks-input-due-date-new"}
                            />
                        }
                    </td>
                    <td className="width-percent-25">
                        <Input type="select" id={"tasks-input-status-new"}>
                            <option>New</option>
                            <option>Ready</option>
                            <option>In Progress</option>
                            <option>Ready for test</option>
                            <option>Done</option>
                            <option>Archived</option>
                        </Input>
                    </td>
                    <td className="width-percent-20">
                        {
                            this.state.assigned_to === null
                                ? <a onClick={this.toggle.bind(this, "assign")}>Not assign</a>
                                :
                                <a onClick={this.toggle.bind(this, "assign")}>
                                    <CustomImg
                                        src={utils.getMemberInProject().find(member => member.id === this.state.assigned_to).photo}
                                        className="img--user--square-2x mr-1"
                                    />
                                    {utils.getMemberInProject().find(member => member.id === this.state.assigned_to).full_name}
                                </a>
                        }
                    </td>
                </tr>
            </React.Fragment>
        )
    }
}

class RowTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: false,
            edit: false,
            remove: false,
            assign: false,
            data: {},
            due_date: null,
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        this.props.handleSetDueDate(this.props.data.id, event.target.value);
    }
    handleRemove() {
        this.toggle("remove");
        this.props.handleRemove(this.props.data.id);
    }

    handleChangeSubject() {
        let subject = document.getElementById("tasks-input-subject-" + this.props.data.id).value;
        this.props.handleChangeSubject(this.props.data.id, subject);
    }

    handleChangeStatus() {
        let status = document.getElementById("tasks-input-status-" + this.props.data.id).value;
        this.props.handleChangeStatus(this.props.data.id, status);
    }

    handleAssignUser(userSelected) {
        this.props.handleAssignUser(this.props.data.id, userSelected);
        this.toggle("assign")
    }

    onKeyDown(e) {
        if (e.key === "Escape") {
            this.toggle("edit")
        }
        if (e.key === "Enter") {
            this.handleChangeSubject();
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data
            };
        }
        return null;
    }
    render() {
        const { memberInProject } = this.props;
        return (
            <React.Fragment>
                <ModalConfirm
                    isOpen={this.state.remove}
                    handleOk={this.handleRemove.bind(this)}
                    handleCancel={this.toggle.bind(this, "remove")}
                />
                <ModalAssignUser
                    isOpen={this.state.assign}
                    userSelected={utils.ValidInput.isEmpty(this.state.data.assigned_to) ? [] : [this.state.data.assigned_to]}
                    allUsers={memberInProject}
                    mode="single"
                    handleSave={this.handleAssignUser.bind(this)}
                />
                <tr
                    onMouseOver={() => this.setState({ isHover: true })}
                    onMouseLeave={() => this.setState({ isHover: false })}
                >
                    <td className="width-percent-10 text-left">
                        {
                            !this.state.isHover
                                ?
                                this.props.id + 1
                                :
                                <React.Fragment>
                                    <FontAwesomeIcon icon={faPen}
                                        onClick={this.toggle.bind(this, "edit")}
                                        className="mr-2 cursor-pointer" />
                                    <FontAwesomeIcon icon={faTrash}
                                        onClick={this.toggle.bind(this, "remove")}
                                        className="cursor-pointer" />
                                </React.Fragment>
                        }
                    </td>
                    <td className="width-percent-20">
                        {
                            this.state.edit
                                ?
                                <Input type="text"
                                    defaultValue={this.state.data.subject}
                                    className="width-percent-80 display-clear"
                                    onKeyDown={this.onKeyDown.bind(this)}
                                    id={"tasks-input-subject-" + this.state.data.id}
                                />
                                :
                                <Link to={"/project/work/task?id=" + this.state.data.id}>{this.state.data.subject}</Link>
                        }
                    </td>

                    <td className="width-percent-25">
                        {
                            this.state.edit
                                ?
                                <Input
                                    type="date"
                                    name="due_date"
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.due_date === null ? '' : this.state.due_date}
                                />
                                :
                                this.state.data.due_date === null ? "--/--/--" : moment(this.state.data.due_date).format('DD-MM-YYYY')
                        }
                    </td>
                    <td className="width-percent-20">
                        {
                            this.state.edit
                                ?
                                <Input type="select" id={"tasks-input-status-" + this.state.data.id}
                                    onChange={this.handleChangeStatus.bind(this)}
                                    defaultValue={this.state.data.status}
                                >
                                    <option>New</option>
                                    <option>Ready</option>
                                    <option>In Progress</option>
                                    <option>Ready for test</option>
                                    <option>Done</option>
                                    <option>Archived</option>
                                </Input>
                                :
                                <h5 className="pt-1">{this.state.data.status}</h5>
                        }
                    </td>
                    <td className="width-percent-25">
                        {
                            this.state.data.assigned_to === null
                                ?
                                this.state.edit
                                    ?
                                    <a onClick={this.toggle.bind(this, "assign")}>Not assign</a>
                                    :
                                    <p>Not assign</p>
                                :
                                this.state.edit
                                    ?
                                    <a onClick={this.toggle.bind(this, "assign")}>
                                        <CustomImg
                                            src={this.state.data.assigned_to.photo}
                                            className="img--user--square-2x mr-1"
                                        />
                                        {this.state.data.assigned_to.full_name}
                                    </a>
                                    :
                                    <React.Fragment>
                                        <CustomImg
                                            src={this.state.data.assigned_to.photo}
                                            className="img--user--square-2x mr-1"
                                        />
                                        {this.state.data.assigned_to.full_name}
                                    </React.Fragment>
                        }
                    </td>
                </tr>
            </React.Fragment>
        )
    }
}

class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoaded: false,
            add: false
        }
    }

    componentDidMount() {
        api.getTaskOfWork(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                this.setState({ data: result, isLoaded: true })
            }
        })
    }

    toggle(component) {
        this.setState({ [component]: !this.state[component] });
    }

    handleRemove(id) {
        let data = utils.copyState(this.state.data);
        data.splice(data.findIndex({ id: id }), 1);
        this.setState({ data: data });
        api.removeTask(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                Notification("success");
            }
        })
    }

    handleChangeSubject(id, subject) {
        let data = utils.copyState(this.state.data);
        let index = data.findIndex({ id: id });
        data[index].subject = subject;
        this.setState({ data: data });

        api.modifyTask(id, { subject: data[index].subject, version: data[index].version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                data[index].version++;
                this.setState({ data: data });
            }
        });
    }

    handleChangeStatus(id, status) {
        let data = utils.copyState(this.state.data);
        data[data.findIndex({ id: id })].status = status;
        let index = data.findIndex({ id: id });
        this.setState({ data: data });
        api.modifyTask(id, { status: status, version: data[index].version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                data[index].version++;
                this.setState({ data: data });
            }
        });
    }

    handleAssignUser(id, userSelected) {
        let data = utils.copyState(this.state.data);
        let index = data.findIndex({ id: id });
        let user_id = utils.returnThisWhenNull(userSelected[0], null);
        api.modifyTask(id, { assigned_to: user_id, version: data[index].version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                data[index].assigned_to = utils.returnThisWhenNull(result.assigned_to, null);
                data[index].version++;
                this.setState({ data: data });
            }
        });
    }

    handleSetDueDate(id, due_date) {
        let data = utils.copyState(this.state.data);
        let index = data.findIndex({ id: id });
        data[index].due_date = due_date;
        this.setState({ data: data });

        api.modifyTask(id, { due_date: data[index].due_date, version: data[index].version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                data[index].version++;
                this.setState({ data: data });
            }
        });
    }

    handleCreateTask(data) {
        this.toggle("add");
        let state_data = utils.copyState(this.state.data);
        const that = this;
        api.createTask(work_id, data, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                state_data.push(result);
                that.setState({ data: state_data });
                Notification("success");
            }
        })
    }

    handleMoveScroll() {
        let objDiv = document.getElementById("card-body--task");
        let oldScrollTop = objDiv.scrollTop;
        let itv = setInterval(function () {
            oldScrollTop = objDiv.scrollTop;
            objDiv.scrollTop += 10;
            if (oldScrollTop === objDiv.scrollTop) {
                clearInterval(itv);
            }
        }, 1);
        this.toggle("add");
    }

    render() {
        const { memberInProject } = this.props;
        return (
            <Card className="card-task">
                <CardHeader>
                    <div className="float-right">
                        <FontAwesomeIcon icon={faPlus} className="hover-pointer"
                            onClick={this.handleMoveScroll.bind(this)} />
                    </div>
                    {this.state.data.length} Tasks
                </CardHeader>
                <CardBody className="overflow-y-20x scrollbar-width-1x scrollbar-style-1" id="card-body--task">
                    {
                        !this.state.isLoaded ? <LoadingSprinner size="sm" /> :
                            <Table>
                                <thead>
                                    <tr className="text-left">
                                        <th>ID</th>
                                        <th>Task</th>
                                        <th>Due date</th>
                                        <th>Status</th>
                                        <th>Assigned to</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                <RowTask
                                                    id={index}
                                                    key={utils.randomString()}
                                                    data={data}
                                                    memberInProject={memberInProject}
                                                    handleRemove={this.handleRemove.bind(this)}
                                                    handleChangeStatus={this.handleChangeStatus.bind(this)}
                                                    handleChangeSubject={this.handleChangeSubject.bind(this)}
                                                    handleAssignUser={this.handleAssignUser.bind(this)}
                                                    handleSetDueDate={this.handleSetDueDate.bind(this)}
                                                />
                                            )
                                        })
                                    }
                                    {
                                        this.state.add
                                            ?
                                            <RowTaskCreate
                                                memberInProject={memberInProject}
                                                handleCreateTask={this.handleCreateTask.bind(this)}
                                                handleCancel={this.toggle.bind(this, "add")}
                                            />
                                            : null
                                    }

                                </tbody>
                            </Table>
                    }
                </CardBody>
            </Card>
        )
    }

}



export default Tasks;