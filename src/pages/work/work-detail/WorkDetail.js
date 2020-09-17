import React from "react";

import "./WorkDetail.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faPlus, faAngleDown, faAngleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    PlusCircle, MoreHorizontal, Trash, Save, EditRounded
} from "react-feather"

import Tasks from "./CardLeft/Tasks";
import CustomAttachments from "./CardLeft/CustomAttachments";
import Actions from "./CardLeft/Actions";
import Financial from "./CardRight/Financial";

import {
    Container, Row, Col,
    Card, CardHeader, CardTitle, CardBody, CardSubtitle, Table,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, Progress
} from "reactstrap"
import Notification from "../../../components/Notification";


import { ModalAssignUser, ModalConfirm } from "../../../components/Modal";
import { CustomImg, LoadingSprinner, Attachments, Description } from "../../../components/CustomTag";

const api = require("./api/api");
const utils = require("../../../utils/utils");

const work_id = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;

class CardLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                project: {}
            },

            edit_subject: false,
            remove: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data
            };
        }
        return null;
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
            api.modifyWork(work_id, { subject: subject, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    handleRemove() {
        api.removeWork(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                window.location.replace("/project/work")
            }
        })
    }

    handleChangeDescription(description) {
        if (description !== this.state.data.description) {
            api.modifyWork(work_id, { description: description, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
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
                <Card className="card-left">
                    <CardHeader>
                        <div className="card-actions float-right">
                            <UncontrolledDropdown>
                                <DropdownToggle tag="a">
                                    <MoreHorizontal />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.toggle.bind(this, "remove")}><Trash />&nbsp;Deletework</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                        <CardTitle>
                            <div className="width-percent-30">
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
                                            <Save className="feather-md m-1 cursor-pointer" color="black" onClick={this.handleSave.bind(this)} />
                                        </div>
                                        :
                                        <div>
                                            <span>{this.state.data.subject}</span>
                                            <span>
                                                <FontAwesomeIcon icon={faPen} className="mr-1 cursor-pointer" onClick={this.toggle.bind(this, "edit_subject")} />
                                            </span>
                                        </div>
                                }
                            </div>
                        </CardTitle>
                        <CardSubtitle># {this.state.data.project.subject}</CardSubtitle>
                    </CardHeader>
                    <CardBody>

                        <Row>
                            <Col>
                                <Description
                                    description={this.state.data.description}
                                    handleSave={this.handleChangeDescription.bind(this)}
                                />
                            </Col>
                        </Row>

                        <Row className="mt-3 row-task">
                            <Col>
                                <Tasks memberInProject={memberInProject} />
                            </Col>
                        </Row>

                        <Row className="mt-3 row-attachments">
                            <Col>
                                <CustomAttachments memberInProject={memberInProject} />
                            </Col>
                        </Row>
{/* 
                        <Row className="mt-3 row-actions">
                            <Col>
                                <Actions handleLoading={this.props.handleLoading} />
                            </Col>
                        </Row> */}

                    </CardBody>
                </Card>
            </React.Fragment>


        )
    }
}

class CardRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                assigned_users: [],
                watchers: [],
                due_date: null
            },
            assign_user: false,
            assign_watcher: false,
            display_User: true,
            display_Watcher: true,
            data_user:[],
            data_watcher: []
        }
    }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if (nextProps !== undefined)
    //         this.setState({data: nextProps.data})
    // }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleAssignUser(id) {
        let data = utils.copyState(this.state.data);
        data.assigned_users = id;
        this.setState({ data: data });
        this.toggle('assign_user');
        api.modifyWork(work_id, { assigned_users: data.assigned_users, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                this.setState({ display_User: false, data_user: result.assigned_users });
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleAssignWatcher(id) {
        console.log(id);
        let data = utils.copyState(this.state.data);
        data.watchers = id;
        console.log(data.watchers);
        
        this.setState({ data: data });
        this.toggle('assign_watcher');
        api.modifyWork(work_id, { watchers: data.watchers, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                this.setState({ display_Watcher: false, data_watcher: result.watchers });
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleChangeDueDate(event) {
        let due_date = event.target.value;
        console.log(due_date);
        
        api.modifyWork(work_id, { due_date: due_date, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
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
            api.modifyWork(work_id, { subject: subject, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    render() {
        console.log(this.state.data_user);
        console.log(this.state.data_watcher);
        
        const selected_user = []
        if(this.state.data_user.length===0){
            this.props.data_user.map((value) => {
                selected_user.push(value._id)
            })
        }
        else{
            this.state.data_user.map((value) => {
                selected_user.push(value)
            })
        }    
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
        const {memberInProject} = this.props;
        return (
            <Card>
                                    <CardHeader>
                        <div className="card-actions float-right">
                            <UncontrolledDropdown>
                                <DropdownToggle tag="a">
                                    <MoreHorizontal />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.toggle.bind(this, "remove")}><Trash />&nbsp;Deletework</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                        <CardTitle>
                            <div className="width-percent-30">
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
                                            <Save className="feather-md m-1 cursor-pointer" color="black" onClick={this.handleSave.bind(this)} />
                                        </div>
                                        :
                                        <div>
                                            <span>{this.state.data.subject}</span>
                                            <span>
                                                <FontAwesomeIcon icon={faPen} className="mr-1 cursor-pointer" onClick={this.toggle.bind(this, "edit_subject")} />
                                            </span>
                                        </div>
                                }
                            </div>
                        </CardTitle>
                        <CardSubtitle>#sss</CardSubtitle>
                    </CardHeader>
                <CardBody>
                    <div className="pb-4 border-bottom">
                        <Input type="select">
                            <option>New</option>
                            <option>Ready</option>
                            <option>In Progress</option>
                            <option>Ready for test</option>
                            <option>Done</option>
                            <option>Archived</option>
                        </Input>
                    </div>
                    <div className="border-bottom">
                        <FormGroup>
                            <Label className="mt-3" >
                                Assigned to
                            </Label>
                            <div className="mb-2">
                                {
                                    this.state.data.assigned_users.map((id, key) => {
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

                                {this.state.display_User && this.props.data_user.map((value, key) => {
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
                                onClick={this.toggle.bind(this, "assign_user")}
                            >
                                Assigned to
                            </Button>
                        </FormGroup>
                    
                    </div>
                    <div className="
                    order-bottom">
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
                            <Input type="date" defaultValue={this.state.data.due_date} onKeyDown={(e) => e.preventDefault()} onChange={this.handleChangeDueDate.bind(this)} />
                        </FormGroup>
                    </div>
                    <div className="mt-3">
                        <FormGroup>
                            <Label>Progress</Label>
                            <Progress animated value={20} color="primary" />
                        </FormGroup>
                    </div>
                    <div className="mt-4 mb-3 border-bottom financial">
                        <Financial />
                    </div>
                </CardBody>
                <ModalAssignUser
                    isOpen={this.state.assign_user}
                    allUsers={memberInProject}
                    mode={"multiple"}
                    userSelected={selected_user}
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

class WorkDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                owner: {},
                project: {},
                description: "",
                assigned_to: null,
                watchers: [],
                due_date: null,
                isLoadedInfoProject: false,
                isLoadedWorkDetail: false
            },
            data_user: [],
            data_watcher: [],
            project: {}
        }
    }

    componentDidMount() {
        api.getInfoProject((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                this.setState({ project: result, isLoadedInfoProject: true });
            }
        });

        api.getWorkDetail(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                result.description = result.description_html;
                this.setState({
                    data: result,
                    data_user: result.assigned_users,
                    data_watcher: result.watchers,
                    isLoadedWorkDetail: true
                })
            }
        });
    }

    handleUpdateData(data) {
        this.setState({ data: data })
    }

    render() {
        const { project, isLoadedInfoProject, isLoadedWorkDetail, data } = this.state;
        const memberInProject = project.members;


        return (
            // work_id === undefined ? <LoadingSprinner /> :
            (isLoadedInfoProject === true && isLoadedWorkDetail === true) ?
                <Container fluid className="WorkDetail">
                    <Row>
                        <Col xl={8}>
                            <CardLeft
                                handleLoading={this.props.handleLoading}
                                data={data}
                                memberInProject={memberInProject}
                                handleUpdateData={this.handleUpdateData.bind(this)}
                            />
                        </Col>
                        <Col xl={4}>
                        <CardRight
                            data_user={this.state.data_user}
                           data_watcher={this.state.data_watcher}
                            handleLoading={this.props.handleLoading}
                            data={data}
                            memberInProject={memberInProject}
                            handleUpdateData={this.handleUpdateData.bind(this)}
                />
                    </Col>
                    </Row>
                </Container>
                :
                <LoadingSprinner />
        )
    }
}

export default WorkDetail;
