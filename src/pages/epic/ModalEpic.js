import React from "react";
import Notification from "../../components/Notification";
import {
    Badge, Button, Col,
    FormGroup, Input, Label,
    Modal, ModalBody, ModalFooter, ModalHeader, Row
} from "reactstrap";

import {CustomImg} from "../../components/CustomTag";
import {ModalAssignUser} from "../../components/Modal";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTags} from "@fortawesome/free-solid-svg-icons";

const ValidInput = require("../../utils/ValidInput");
const utils = require("../../utils/utils");

class ModalEpic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            subject: "",
            tags: [],
            description: "",
            status: "New",
            assigned_users: [],
            assign_users: false
        };
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleRemoveTag = this.handleRemoveTag.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const copy_props = utils.copyState(nextProps);
        const {subject, tags, status, assigned_users, description,  isOpen} = copy_props;
        this.setState({
            isOpen: isOpen,
            subject: utils.returnThisWhenNull(subject, ""),
            tags: utils.returnThisWhenNull(tags, []),
            assigned_to: utils.returnThisWhenNull(assigned_users, []),
            description: utils.returnThisWhenNull(description, ""),
            status: utils.returnThisWhenNull(status, "New"),
        })
    }

    handleChange(event){
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
                this.setState({tags: tags});
                document.getElementById("inputTags").value = "";
            }
        }
    }

    handleRemoveTag(index) {
        let tags = utils.copyState(this.state.tags);
        tags.splice(index, 1);
        this.setState({tags: tags});
    }

    handleAssignUsers(userSelected) {
        this.setState({assigned_users: userSelected});
        this.toggle("assign_user")
    }

    handleOk(){
        if(utils.ValidInput.isEmpty(this.state.subject)){
            Notification("warning", "Warning", "Subject is required!")
        } else {
            this.props.handleOk(this.state);
        }
    }

    handleCancel(){
        this.props.handleCancel();
    }

    render() {
        const {memberInProject} = this.props;
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
                        {this.props.id === "new_epic" ? "New epic" : "Modify epic"}
                    </ModalHeader>
                    <ModalBody>
                        <Row form>
                            <Col md="8">
                                <FormGroup className="mr-3">
                                    <Label>Epic name</Label>
                                    <Input
                                        name="subject"
                                        onChange={this.handleChange.bind(this)}
                                        type="text"
                                        value={this.state.subject}
                                        placeholder="Epic name"
                                    />
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
                                        <option>In progress</option>
                                        <option>Ready for test</option>
                                        <option>Done</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={8}>
                                <FormGroup className="mr-3">
                                    <Label>
                                        <FontAwesomeIcon icon={faTags} size="xs"/>
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
                                                            onClick={() => this.handleRemoveTag(index)}
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
                                        className="min-height-1x"/>
                                </FormGroup>
                            </Col>
                            {/* <Col md={4}>
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
                                                                className="rounded-circle img--user--square-2x ml-1 mt-1"
                                                            />
                                                        )
                                                })
                                            }
                                        </div>

                                        <div className="mt-3" onClick={this.toggle.bind(this, "assign_user")}>
                                            <a className="font-size-1x"><span
                                                className="text-color-orange">Assign</span> or <span
                                                className="text-color-orange">Assign to me</span></a>
                                        </div>
                                    </div>
                                </FormGroup>
                            </Col> */}
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

export default ModalEpic;