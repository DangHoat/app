import React from "react";
import {
    Row, Col, Container,
    Button,
    ModalHeader, ModalFooter, Modal, ModalBody,
    FormGroup, FormFeedback,
    Input, Label
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAmericas, faKey, faPlus } from "@fortawesome/free-solid-svg-icons";
import TableProject from "./TableProject"
import Notification from "../../components/Notification";
import { LoadingSprinner } from "../../components/CustomTag";
import "./Project.css";

const api = require("./api/api");
const ValidInput = require("../../utils/ValidInput");

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showModal: {
                create_project: false
            },
            temp: {
                name: "",
                description: "",
                is_private: false
            },
            submitted: false,
            isLoaderAPI: false,
            keyWord: null,
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);
    }

    componentDidMount() {
        const that = this;
        api.getInfoProjectAll((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                that.setState({ data: result, isLoaderAPI: true });
            }
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state === nextState) {
            return false;
        }
        return true
    }

    handleChangeType(type) {
        let tmp = Object.assign({}, this.state.temp);
        tmp.is_private = type === "private";
        this.setState({ temp: tmp });
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.temp);
        temp[event.target.name] = event.target.value;
        this.setState({ temp: temp });
    }

    handleShow() {
        let state = Object.assign({}, this.state);
        state.showModal.create_project = true;
        this.setState(state);
    }

    handleClose() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.temp.description = "";
        state.is_private = false;
        state.showModal.create_project = false;
        this.setState(state);
    }

    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }

    changeSearchChars(chars) {
        let state = Object.assign({}, this.state);
        state.keyWord = chars.toLowerCase();
        this.setState(state);
    }

    handleCreateProject() {
        let state = Object.assign({}, this.state);
        const that = this;
        this.setState({ submitted: true });

        // stop here if form is invalid
        const { name, description } = this.state.temp;
        if (!(name && description)) {
            return;
        }
        api.createProject(state.temp, (err, result) => {
            if (err) {
                Notification("error", "Error", err.status + " " + err.data._error_message)
            } else {
                state.data.push(result);
                that.setState(state);
                that.handleClose();
                Notification("success", "Create project", "Created project is successfully!!!")
            }
        });
    }

    render() {
        return (
            <React.Fragment >
                <Modal isOpen={this.state.showModal.create_project} className="modal-project">
                    <ModalHeader className="modal-project__header">New project</ModalHeader>
                    <ModalBody >
                        <FormGroup>
                            <Label for="name_of_project">Project name</Label>
                            <Input
                                type="text" name="name"
                                placeholder="Name of project"
                                value={this.state.temp.name}
                                onChange={this.handleChange}
                                invalid={this.state.submitted && !this.state.temp.name ? true : false}
                            />
                            <FormFeedback invalid>
                                Name project is a required field!
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="textarea"
                                rows="5"
                                name="description"
                                placeholder="Description"
                                value={this.state.temp.description}
                                onChange={this.handleChange}
                                invalid={this.state.submitted && !this.state.temp.description ? true : false}
                            />
                            <FormFeedback invalid>
                                Description is a required field!
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col className="col-6">
                                    <Button
                                        type="button"
                                        style={{ width: "100%" }}
                                        onClick={this.handleChangeType.bind(this, 'public')}
                                        color="primary"
                                        outline
                                        active={!this.state.temp.is_private}
                                    >
                                        <FontAwesomeIcon icon={faGlobeAmericas} /> Public
                                    </Button>
                                </Col>
                                <Col className="col-6">
                                    <Button
                                        type="button"
                                        style={{ width: "100%" }}
                                        onClick={this.handleChangeType.bind(this, 'private')}
                                        color="warning"
                                        outline
                                        active={this.state.temp.is_private}
                                    >
                                        <FontAwesomeIcon icon={faKey} /> Private
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.handleClose.bind(this)}>
                            Cancel
                        </Button>
                        <Button color="success" onClick={this.handleCreateProject.bind(this)}>
                            Create
                        </Button>
                    </ModalFooter>
                </Modal>

                <Container fluid className="width-percent-90">
                    <Row>
                        <Col>
                            <Input className="width-percent-40" id="inputSearch" placeholder="Search Project" onKeyUp={this.handleSearch.bind(this)} />
                        </Col>
                        <Col className="pr-0">
                            <Button className="float-right" onClick={this.handleShow.bind(this)}><FontAwesomeIcon icon={faPlus} /> New project</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="pr-0 pl-0 m-0">
                            {this.state.isLoaderAPI ?
                                this.state.data.map(({ id, name, created_date, is_private, i_am_owner, works, budget, logo, owner, i_am_member }, index) => {
                                    if (ValidInput.isEmpty(this.state.keyWord) && i_am_member) {
                                        return (
                                            <TableProject
                                                key={index}
                                                id={id}
                                                index={index + 1}
                                                is_private={is_private}
                                                i_am_owner={i_am_owner}
                                                name={name}
                                                created_date={created_date}
                                                budget={budget}
                                                works={works}
                                                logo={logo}
                                                owner={owner}
                                            />
                                        );
                                    }
                                    else {
                                        if (name.toLowerCase().indexOf(this.state.keyWord) !== -1) {
                                            return (
                                                <TableProject
                                                    key={index}
                                                    id={id}
                                                    index={index + 1}
                                                    is_private={is_private}
                                                    i_am_owner={i_am_owner}
                                                    name={name}
                                                    created_date={created_date}
                                                    budget={budget}
                                                    works={works}
                                                    logo={logo}
                                                    owner={owner}
                                                />
                                            );
                                        }
                                    }

                                })
                                : <LoadingSprinner />
                            }
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
};

export default Project;