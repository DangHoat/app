import React from "react"
import moment from 'moment'
import {
    Card, CardHeader, CardTitle, CardBody,
    Table,
    Button,
    Progress,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./WorkTable.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

import utils from "../../../utils/utils"

import ModalWork from "../ModalWork"
import { ModalConfirm } from "../../../components/Modal";
import { CustomImg, LoadingSprinner } from "../../../components/CustomTag";
import Notification from "../../../components/Notification";

import dragula from "react-dragula";
import { CSSTransition } from "react-transition-group";

const api = require("../api/api");

class RowWorkTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isHover: false,
            modify_work: false,
            remove_work: false,
            inn: true,
        };
        this.handleModifyWork = this.handleModifyWork.bind(this);
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleModifyWork(data) {
        this.toggle("modify_work");
        this.props.handleModifyWork(this.props.data.id, data);
    }

    handleRemoveWork() {
        if (!this.state.inn) {
            this.props.handleRemoveWork(this.props.data.id);
        } else {
            this.setState({ inn: false });
            this.toggle("remove_work");
        }
    }

    render() {
        const { project } = this.props;
        const { id, subject, due_date, assigned_users, tags, status } = this.props.data;
        console.log(this.props.data);

        const role = utils.getPermissionInProject();
        const memberInProject = project.members;

        let count_member_limit = 0;
        return (
            <React.Fragment>
                <ModalConfirm
                    isOpen={this.state.remove_work}
                    handleCancel={this.toggle.bind(this, "remove_work")}
                    handleOk={this.handleRemoveWork.bind(this)}
                />
                <ModalWork
                    id="modify_work"
                    isOpen={this.state.modify_work}
                    subject={subject}
                    due_date={due_date}
                    assigned_users={assigned_users}
                    memberInProject={memberInProject}
                    tags={tags}
                    status={status}
                    handleOk={this.handleModifyWork.bind(this)}
                    handleCancel={this.toggle.bind(this, "modify_work")}
                />
                <CSSTransition
                    classNames={"item"}
                    timeout={500}
                    in={this.state.inn}
                    onExited={this.handleRemoveWork.bind(this)}
                >
                    <tr
                        onMouseOver={() => this.setState({ isHover: true })}
                        onMouseLeave={() => this.setState({ isHover: false })}
                        id={"work-" + id}
                        className="cursor-grab full-width"
                    >
                        <td className="width-percent-10 text-align-center">
                            {
                                !this.state.isHover
                                    ?
                                    this.props.index + 1
                                    :
                                    role.admin === true
                                        ?
                                        <React.Fragment>
                                            <FontAwesomeIcon
                                                icon={faPen}
                                                className="cursor-pointer"
                                                onClick={this.toggle.bind(this, "modify_work")}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="ml-2 cursor-pointer"
                                                onClick={this.toggle.bind(this, "remove_work")}
                                            />
                                        </React.Fragment>
                                        : this.props.index + 1
                            }
                        </td>
                        <td className="width-percent-20">
                            <a href={"/project/work?id=" + id} className="text-decoration-none text-color-black">
                                {subject}
                            </a>
                        </td>
                        <td className={"width-percent-20 " + (utils.isExpired(due_date) ? "text-decoration-line-through" : "")}>
                            {due_date !== null ? moment(due_date).format('DD/MM/YYYY') : "--/--/--"}
                        </td>
                        <td className="width-percent-15">
                            {

                                assigned_users.length === 0 ? "Not Assign" :
                                    assigned_users.map((member, index) => {
                                        let mem = memberInProject.find(memberInProject => memberInProject.id === member);
                                        if (mem !== undefined) {
                                            count_member_limit++;
                                            if (count_member_limit < 5)
                                                return (
                                                    <CustomImg
                                                        src={mem.photo}
                                                        alt="avatar"
                                                        className="rounded-circle img--user--square-2x cursor-pointer"
                                                    />
                                                )
                                        }
                                    })
                            }
                            {
                                count_member_limit >= 5
                                    ?
                                    <span className="rounded-circle">+{(count_member_limit - 4)}</span>
                                    :
                                    null
                            }
                        </td>
                        <td className={"width-percent-15 "}>{status}</td>
                        <td className={"width-percent-20"}>
                            <Progress color="success" value={0}>{this.props.progress} %</Progress>
                        </td>
                    </tr>
                </CSSTransition>
            </React.Fragment>
        )
    }
}

class WorkTable extends React.Component {

    constructor(props) {
        super(props);
        this.containers = [];
        this.state = {
            data: [],
            add_work: false,
            isLoaded: false
        };
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleRemoveWork(id) {
        let data = utils.copyState(this.state.data);
        data.splice(data.findIndex({ id: id }), 1);
        this.setState({ data: data });
        api.removeWork(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                Notification("success");
            }
        })
    }

    handleAddWork(data) {
        const that = this;
        this.toggle("add_work");
        let state_data = utils.copyState(this.state.data);
        api.createWork(data, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
            } else {
                Notification("success");
                state_data.push(result);
                that.setState({ data: state_data });
            }
        })
    }

    handleModifyWork(id, data) {
        const that = this;
        let state_data = utils.copyState(this.state.data);
        let index = state_data.findIndex({ id: id });
        state_data[index].subject = data.subject;
        state_data[index].description = data.description;
        state_data[index].due_date = data.due_date;
        state_data[index].tag = data.tags;
        state_data[index].assigned_users = data.assigned_users;
        state_data[index].status = data.status;
        api.modifyWork(id, state_data[index], (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                Notification("success");
                state_data[index] = result;
                that.setState({ data: state_data })
            }
        })
    }

    onContainerReady = container => {
        this.containers.push(container);
    };

    handleContainerLoaded = container => {
        if (container) {
            this.onContainerReady(container);
        }
    };

    componentDidMount() {
        const dk = dragula(this.containers);
        dk.on('drag', function (el, target, handle) {
            setTimeout(function () {
                try {
                    document.querySelector("body > .gu-mirror").classList.add("drag-work")
                } catch (e) {
                    //pass
                }
            }, 50)
        });

        dk.on('drop', function (el, target, handle) {

        });
        /* ------------------------------------------------------ */
        const that = this;
        api.getWorkOfProject((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
            } else {
                that.setState({ data: result, isLoaded: true })
            }
        })
    }

    render() {
        const { project } = this.props;
        const memberInProject = project.members;
        const role = utils.getPermissionInProject();

        return (
            !this.state.isLoaded ? <LoadingSprinner /> :
                <React.Fragment>
                    <React.Fragment>
                        <ModalWork
                            id="add_work"
                            isOpen={this.state.add_work}
                            memberInProject={memberInProject}
                            handleOk={this.handleAddWork.bind(this)}
                            handleCancel={this.toggle.bind(this, "add_work")}
                        />
                    </React.Fragment>
                    <React.Fragment>
                        <Card>
                            <CardHeader>
                                {role.admin === true ?
                                    <div className="float-right">
                                        <Button
                                            className="float-right"
                                            onClick={this.toggle.bind(this, "add_work")}>
                                            <FontAwesomeIcon icon={faPlus} /> New work
                                        </Button>
                                    </div>
                                    :
                                    null
                                }
                                <CardTitle>List of work</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Table responsive striped hover>
                                    <thead>
                                        <tr>
                                            <th className="width-percent-10 text-align-center">ID</th>
                                            <th className="width-percent-20">Work</th>
                                            <th className="width-percent-20">Deadline</th>
                                            <th className="width-percent-15">Member</th>
                                            <th className="width-percent-15">Status</th>
                                            <th>Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody ref={this.handleContainerLoaded}>
                                        {
                                            this.state.data.map((data, index) => {
                                                return (
                                                    <RowWorkTable
                                                        key={utils.randomString()}
                                                        index={index}
                                                        data={data}
                                                        project={project}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}
                                                    />
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </React.Fragment>
                </React.Fragment>
        )
    }
}

export default WorkTable;