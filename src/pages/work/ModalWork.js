import React from "react";
import Notification from "../../components/Notification";
import {
    Badge,
    Button, Input,
    FormGroup, FormFeedback, Label,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Row, Col
} from "reactstrap";
import moment from 'moment'
import { CustomImg } from "../../components/CustomTag";
import { ModalAssignUser } from "../../components/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

const ValidInput = require("../../utils/ValidInput");
const utils = require("../../utils/utils");

class ModalWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            subject: null,
            tags: [],
            description: null,
            status: null,
            due_date: null,
            assigned_users: [],
            assign_user: false,
            submitted: false,
        };
        this.handleOk = this.handleOk.bind(this);
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleRemoveTag = this.handleRemoveTag.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const copy_props = utils.copyState(nextProps);
        const { subject, tags, status, assigned_users, due_date, description, isOpen } = copy_props;
        this.setState({
            isOpen: isOpen,
            subject: utils.returnThisWhenNull(subject, null),
            tags: utils.returnThisWhenNull(tags, []),
            assigned_users: utils.returnThisWhenNull(assigned_users, []),
            description: utils.returnThisWhenNull(description, null),
            status: utils.returnThisWhenNull(status, null),
            due_date: utils.returnThisWhenNull(due_date, null),
            submitted: false
        })
    }
    componentDidUpdate(nextProps, nextState) {
        if (this.state === nextState || this.props === nextProps) {
            return false
        }
        return true
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })

    }

    handleAddTag(event) {
        if (event.key === "Enter") {
            let tag = document.getElementById("inputTags").value;
            if (ValidInput.isEmpty(tag)) {
                Notification("warning", "Empty value", "Tag is empty value")
            } else {
                let tags = utils.copyState(this.state.tags);
                tags.push(tag);
                this.setState({ tags: tags });
                document.getElementById("inputTags").value = "";
            }
        }
    }

    handleRemoveTag(index) {
        let tags = utils.copyState(this.state.tags);
        tags.splice(index, 1);
        this.setState({ tags: tags });
    }

    handleAssignUsers(userSelected) {
        this.setState({ assigned_users: userSelected });
        this.toggle("assign_user")

    }

    handleOk(event) {
        event.preventDefault();
        this.setState({ submitted: true });

        const { subject } = this.state;

        // stop here if form is invalid
        if (!subject) {
            return;
        }
        this.props.handleOk(this.state);

    }

    handleCancel() {
        this.setState({ submitted: false });
        this.props.handleCancel();
    }

    render() {
        const { memberInProject } = this.props;
        console.log(memberInProject);

        return (
            <React.Fragment>
                <ModalAssignUser
                    isOpen={this.state.assign_user}
                    allUsers={memberInProject}
                    userSelected={this.state.assigned_users}
                    handleSave={this.handleAssignUsers.bind(this)}
                />
                <Modal isOpen={this.state.isOpen} size="lg">
                    <ModalHeader>
                        {this.props.id === "add_work" ? "New work" : "Modify work"}
                    </ModalHeader>
                    <ModalBody>
                        <Row form>
                            <Col md="8">
                                <FormGroup className="mr-3">
                                    <Label>Work name</Label>
                                    <Input
                                        name="subject"
                                        onChange={this.handleChange.bind(this)}
                                        type="text"
                                        value={this.state.subject}
                                        placeholder="Work name"
                                        invalid={this.state.submitted && !this.state.subject ? true : false}
                                    />
                                    <FormFeedback invalid>
                                        Work name is a required field!
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>Status</Label>
                                    <Input
                                        name="status"
                                        onChange={this.handleChange.bind(this)}
                                        type="select"
                                        value={this.state.status}
                                    >
                                        <option>New</option>
                                        <option>Ready</option>
                                        <option>In Progress</option>
                                        <option>Ready for test</option>
                                        <option>Done</option>
                                        <option>Archived</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={8}>
                                <FormGroup className="mr-3">
                                    <Label>
                                        <FontAwesomeIcon icon={faTags} size="xs" />
                                        {
                                            this.state.tags.map((tag, index) => {
                                                return (
                                                    <Badge
                                                        key={index}
                                                        className="badge-pill ml-2"
                                                        color="info"
                                                    >
                                                        <label className="mb-0">{tag}</label>
                                                        &nbsp;
                                                        <label
                                                            className="mb-0 text-color-orange cursor-pointer"
                                                            id={index}
                                                            onClick={this.handleRemoveTag.bind(this, index)}
                                                        >
                                                            X
                                                        </label>
                                                    </Badge>
                                                )
                                            })
                                        }
                                    </Label>
                                    <Input type="text"
                                        id="inputTags"
                                        placeholder="Enter tag"
                                        autoComplete="off"
                                        onKeyPress={this.handleAddTag}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>Due date</Label>
                                    <Input
                                        type="date"
                                        name="due_date"
                                        onChange={this.handleChange.bind(this)}
                                        value={ValidInput.isEmpty(this.state.due_date) ? "--/--/--" : moment(this.state.due_date).format('YYYY-MM-DD')}
                                        max="2100-12-31"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={8}>
                                <FormGroup className="mr-3">
                                    <Label>Description</Label>
                                    <Input
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleChange.bind(this)}
                                        type="textarea" autoComplete="off"
                                        placeholder="Description"
                                        className="min-height-1x" />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>
                                        Assigned users
                                    </Label>
                                    <div>
                                        <div>
                                            {
                                                this.state.assigned_users.map((member, index) => {
                                                    let mem = memberInProject.find(memberInProject => memberInProject.id === member);
                                                    if (mem !== undefined)
                                                        return (
                                                            <CustomImg
                                                                key={index}
                                                                src={mem.photo}
                                                                alt="avatar"
                                                                className="rounded-circle img--user--square-2x m-2"
                                                            />
                                                        )
                                                })
                                            }
                                        </div>

                                        <div className="mt-3" onClick={this.toggle.bind(this, "assign_user")}>
                                            <a className="font-size-1x"><span
                                                className="text-color-orange">Assign</span>or  <span
                                                    className="text-color-orange">Assign to me</span></a>
                                        </div>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.handleCancel.bind(this)}>
                            Cancel
                        </Button>
                        <Button color="success" onClick={this.handleOk.bind(this)}>
                            OK
                        </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default ModalWork;