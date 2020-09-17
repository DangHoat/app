import React from "react";

// import "./TaskDetail.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faPlus, faAngleDown, faAngleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    PlusCircle, MoreHorizontal, Trash
} from "react-feather"

import Comment from "../../components/Comment";
// import Activities from "./Activities";

import {
    Container, Row, Col,
    Card, CardHeader, CardTitle, CardBody, CardSubtitle, Table,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, Progress
} from "reactstrap"

import { ModalAssignUser, ModalConfirm } from "../../components/Modal";
import { CustomImg, LoadingSprinner, Attachments, Description, Notification } from "../../components/CustomTag";
import { lookup } from "dns";

const api = require("./api/api");
const utils = require("../../utils/utils");
let memberInProject = [];

const work_id = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "comments",
            total_comment: 0,
            data_comment: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle(component) {
        this.setState({ show: component })
    }
    componentDidMount() {
        let state = Object.assign({}, this.state);
        //loading comment 
        api.getComment(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.total_comment = result.length;
                state.dataComment = result;
                state.isLoaderApi = true;
                this.setState(state);
            }
        })
    }

    handleSubmit(data_comment) {
        let state = Object.assign({}, this.state);
        const that = this;
        // post_comment
        api.sendComment(this.state.task_id, data_comment, function (err, result) {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.total_comment = result.total_comments;
                //get_comment
                api.getComment(this.state.task_id, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        state.dataComment = result;
                        that.setState(state)
                    }
                })
            }
        });
    }
    render() {
        return (
            <Card>
                <CardHeader>
                    <div
                        className={"float-left " + (this.state.show === "comments" ? "border-bottom font-weight-bold" : "")}
                        onClick={this.toggle.bind(this, "comments")}
                    >
                        <a>{this.state.total_comment} comments</a>
                    </div>
                    <div
                        className={"ml-3 float-left " + (this.state.show === "activities" ? "border-bottom font-weight-bold" : "")}
                        onClick={this.toggle.bind(this, "activities")}>
                        <a>0 activities</a>
                    </div>
                </CardHeader>
                <CardBody>
                    {
                        this.state.show === "comments"
                            ?
                            <Comment
                                handleSubmit={this.handleSubmit.bind(this)}
                                dataComment={this.state.dataComment}
                                isLoaderApi={this.state.isLoaderApi}
                            /> :
                            null
                        //<Activities />
                    }
                </CardBody>
            </Card>
        )
    }
}

class CustomAttachments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            percentage: 0,
            data: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
    }

    componentDidMount() {
        api.getAttachmentsOfTask(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                this.setState({
                    data: result,
                    isLoaded: true
                })
            }
        })
    }

    handleRemoveFile(id) {
        api.removeAttachments(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                let data = utils.copyState(this.state.data);
                let index = data.findIndex({ id: id });
                data.splice(index, 1);
                this.setState({ data: data });
            }
        })
    }

    handleUploadFile(file) {
        let that = this;
        var listFile = utils.copyState(this.state.data)
        api.postAttachments(this.state.task_id, file, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                listFile.push(result);
                this.setState({
                    data: listFile
                })
                Notification("success");
            }
        }
            , (process) => {
                this.setState({
                    percentage: process
                });
            })
    }

    render() {
        return (
            <Attachments
                isLoaded={this.state.isLoaded}
                progress={this.state.percentage}
                data={this.state.data}
                handleRemoveFile={this.handleRemoveFile.bind(this)}
                handleSelectFile={this.handleUploadFile.bind(this)}
            />
        )
    }
}

class CardLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                description_html: "",
                subject: "",
                project: {}
            },

            edit_subject: false,
            remove: false,
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({ data: nextProps.data })
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleOnKeyUp(event) {
        if (event.key === "Enter") {
            this.toggle("edit_subject");
            this.handleSave();
        }

        if (event.key === "Escape") {
            this.toggle("edit_subject");
        }
    }

    handleSave() {
        this.toggle("edit_subject");
        let subject = document.getElementById("work-input-subject").value;
        if (subject !== this.state.data.subject) {
            api.modifyTask(this.state.task_id, { subject: subject, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    handleRemove() {
        api.removeTask(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                window.location.replace("/project/work")
            }
        })
    }

    handleChangeDescription(description) {
        if (description !== this.state.data.description_html) {
            api.modifyTask(this.state.task_id, { description: description, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    render() {
        return (
            <>
                <ModalConfirm
                    isOpen={this.state.remove}
                    handleOk={this.handleRemove.bind(this)}
                    handleCancel={this.toggle.bind(this, "remove")}
                />
                <Card className="card-left">
                    <CardHeader>
                        <div className="card-actions float-right">
                            <UncontrolledDropdown>
                                <DropdownToggle tag="a">
                                    <MoreHorizontal />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.toggle.bind(this, "remove")}><Trash />&nbsp;Delete
                                        work</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                        <CardTitle>
                            <div className="width-percent-80">
                                {
                                    this.state.edit_subject
                                        ?
                                        <div className="d-flex">
                                            <Input
                                                id="work-input-subject"
                                                type="text"
                                                defaultValue={this.state.data.subject}
                                                onKeyUp={this.handleOnKeyUp.bind(this)}
                                            />
                                            <FontAwesomeIcon icon={faSave} className="ml-2 cursor-pointer"
                                                onClick={this.handleSave.bind(this)} />
                                        </div>
                                        :
                                        <div>
                                            <span>{this.state.data.subject}</span>
                                            <span>
                                                <FontAwesomeIcon icon={faPen} className="ml-2 cursor-pointer"
                                                    onClick={this.toggle.bind(this, "edit_subject")} />
                                            </span>
                                        </div>
                                }
                            </div>
                        </CardTitle>
                        <CardSubtitle>#{utils.ValidInput.isEmpty(this.state.data.project) ? null : this.state.data.project.subject}</CardSubtitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Description
                                    description={this.state.data.description_html}
                                    handleSave={this.handleChangeDescription.bind(this)}
                                />
                            </Col>
                        </Row>

                        <Row className="mt-3 row-attachments">
                            <Col>
                                <CustomAttachments />
                            </Col>
                        </Row>
                        <Row className="mt-3 row-actions">
                            <Col>
                                <Actions handleLoading={this.props.handleLoading} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </>
        )
    }
}

class CardRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                assigned_to: [],
                watchers: [],
                due_date: null,
                version: 1
            },
            assign_user: false,
            assign_watcher: false,
            display_Watcher: true,
            data_watcher: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if (nextProps !== undefined)
    //         this.setState({ data: nextProps.data })
    // }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleAssignUser(id) {
        let data = utils.copyState(this.state.data);
        data.assigned_to = id[0];
        this.setState({ data: data });
        this.toggle('assign_user');
        api.modifyTask(this.state.task_id, {
            assigned_to: data.assigned_to,
            version: this.state.data.version
        }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleAssignWatcher(id) {
        let data = utils.copyState(this.state.data);
        data.watchers = id;
        this.setState({ data: data });
        this.toggle('assign_watcher');
        api.modifyTask(this.state.task_id, { watchers: data.watchers, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                this.setState({ display_Watcher: false, data_watcher: result.watchers });
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleChangeDueDate(event) {
        let due_date = event.target.value;
        api.modifyTask(this.state.task_id, { due_date: due_date, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    render() {
        const selected_watcher = []
        if (this.state.data_watcher.length === 0) {
            this.props.data_watcher.map((value) => {
                selected_watcher.push(value._id)
            })
        }
        else {
            this.state.data_watcher.map((value) => {
                selected_watcher.push(value)
            })
        }
        const memberInProject = utils.getMemberInProject();
        return (
            <Card>
                <CardBody>
                    <div className="pb-4 border-bottom">
                        <Input type="select">
                            <option>New</option>
                            <option>Ready</option>
                            <option>In progress</option>
                            <option>Ready for test</option>
                            <option>Done</option>
                            <option>Archived</option>
                        </Input>
                    </div>
                    <div className="border-bottom">
                        <FormGroup>
                            <Label className="mt-3">
                                Assigned to
                            </Label>
                            <div className="mb-2">
                                {
                                    utils.ValidInput.isEmpty(this.state.data.assigned_to) ? null :
                                        <CustomImg
                                            src={memberInProject.find(member => member.id === this.state.data.assigned_to).photo}
                                            className="mt-1 mb-1 ml-1 img--user--square-3x rounded-circle hover-color"
                                        />
                                }
                            </div>
                            <Button
                                type="button"
                                className="full-width"
                                onClick={this.toggle.bind(this, "assign_user")}
                            >
                                Assigned to
                            </Button>
                        </FormGroup>
                    </div>
                    <div className="mt-3 border-bottom">
                        <FormGroup>
                            <Label>
                                Watcher
                            </Label>
                            <div className="mb-2">
                                {
                                    this.state.data.watchers.map((id, key) => {
                                        return (
                                            <CustomImg
                                                key={key}
                                                src={memberInProject.find(element => element.id === id).photo}
                                                className="mt-1 mb-1 ml-1 img--user--square-3x rounded-circle hover-color"
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div>

                                {this.state.display_Watcher && this.props.data_watcher.map((value, key) => {
                                    return (
                                        <CustomImg
                                            key={key}
                                            src={value.photo}
                                            alt="avatar"
                                            className="rounded-circle img--user--square-2x cursor-pointer"
                                        />)
                                })}
                            </div>
                            <Button
                                type="button"
                                className="full-width"
                                onClick={this.toggle.bind(this, "assign_watcher")}
                            >
                                Add watcher
                            </Button>
                        </FormGroup>
                    </div>
                    <div className="mt-3">
                        <FormGroup>
                            <Label>Due date</Label>
                            <Input type="date" defaultValue={this.state.data.due_date}
                                onKeyDown={(e) => e.preventDefault()}
                                onChange={this.handleChangeDueDate.bind(this)} />
                        </FormGroup>
                    </div>
                    <div className="mt-3">
                        <FormGroup>
                            <Label>Progress</Label>
                            <Progress animated value={20} color="primary" />
                        </FormGroup>
                    </div>
                </CardBody>
                <ModalAssignUser
                    isOpen={this.state.assign_user}
                    userSelected={[this.state.data.assigned_to]}
                    allUsers={memberInProject}
                    mode={"single"}
                    handleSave={this.handleAssignUser.bind(this)}
                />
                <ModalAssignUser
                    isOpen={this.state.assign_watcher}
                    userSelected={this.state.data.watchers}
                    allUsers={memberInProject}
                    mode="multiple"
                    handleSave={this.handleAssignWatcher.bind(this)}
                />
            </Card>
        )
    }
}

class TaskDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                description: "",
                subject: "",
                project: {},
                assigned_to: null,
                watchers: [],
                due_date: null
            },
            data_user: [],
            data_watcher: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
    }

    componentDidMount() {
        api.getTaskDetail(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                throw err;
            } else {
                result.description = result.description_html;
                this.setState({
                    data: result,
                    data_watcher: result.watchers
                })
            }
        });
    }

    handleUpdateData(data) {
        this.setState({ data: data })
    }

    render() {
        memberInProject = utils.getMemberInProject();
        return (
            <Container fluid className="TaskDetail">
                <Row>
                    <Col xl={8}>
                        <CardLeft
                            handleLoading={this.props.handleLoading}
                            data={this.state.data}
                            handleUpdateData={this.handleUpdateData.bind(this)}
                        />
                    </Col>
                    <Col xl={4}>
                        {/* <CardRight
                            data_watcher={this.state.data_watcher}
                            data={this.state.data}
                            handleLoading={this.props.handleLoading}
                            handleUpdateData={this.handleUpdateData.bind(this)}
                        /> */}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default TaskDetail;