import React from "react";
import {
    Card, CardBody, CardHeader, CardTitle,
    Container, Col, Row,
    Table,
    ListGroup, ListGroupItem,
    Input, Button, CustomInput,
    ModalHeader, ModalFooter, Modal, ModalBody,
    DropdownToggle, DropdownMenu, DropdownItem, Dropdown
} from "reactstrap";
import Notification from "../../../components/Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash, faSquareFull, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Label from "reactstrap/es/Label";
import { LoadingSprinner } from "../../../components/CustomTag";
const api = require("./api/permissionApi");
const ValidInput = require("../../../utils/ValidInput");
const utils = require("../../../utils/utils");

class TableEditPermission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valuePermission: this.props.valuePermission
        }
    }
    render() {
        console.log("renderTable")
        return (
            <td colSpan="3" className={this.props.showModal.tableEditPermission ? "bg-light" : "d-none bg-light"}>
                {
                    this.state.valuePermission.map((value, index) => {
                        let permissionsName = this.props.permissionsName[index].replace(/_/g, " "); // đổi hết dấu _ thành dấu space
                        return (
                            <div key={utils.randomString()} className="mb-0">
                                <Row>
                                    <Col>
                                        <p> {permissionsName.charAt(0).toUpperCase() + permissionsName.slice(1)} </p>
                                    </Col>
                                    <Col>
                                        <CustomInput
                                            type="switch"
                                            name={this.props.permissionsName[index] + "*" + index}
                                            id={this.props.permissionsName[index] + "*" + index}
                                            checked={value}
                                            style={{ cursor: 'pointer' }}
                                            className="float-right"
                                            onChange={this.props.inverseState.bind(this, index)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                }
            </td>
        )
    }
}

class CategoryPermissionList extends React.Component {
    constructor(props) {
        super(props);
        const team = this.props.team;
        const curretTeam = this.props.currentTeam;
        this.state = {
            curretTeam: curretTeam,
            team: team,
            valueCategoryPermissionList: [],
            showModal: {
                tableEditPermission: false
            }
        }
        this.inverseState = this.inverseState.bind(this);
        this.showModal = this.showModal.bind(this);
    }
    showModal(modal) {
        let showModal = Object.assign({}, this.state.showModal);
        showModal[modal] = !showModal[modal]
        this.setState({ showModal: showModal })
    }
    inverseState(modal) {
        let state = Object.assign({}, this.state);
        this.setState(state)
        let optionDelete = state.valueCategoryPermissionList[modal]
        let fieldEdit = this.props.categoryConfigList[this.props.index][Object.keys(this.props.categoryConfigList[this.props.index])][modal]
        this.handleEditPermission(optionDelete, fieldEdit)
    }
    handleEditPermission(optionDelete, field) {
        let state = Object.assign({}, this.state);
        if (optionDelete) {
            // xoa name permisstion di
            let location = state.team.indexOf(field);
            if (location !== -1) {
                state.team.splice(location, 1);
            } else {
                Notification("error", "Does not exist permissions or permissions have been turned off")
            }
        } else {
            // them name permisstion vao
            state.team.push(field)
        }
        // API
        let dataInputApi = {
            "id": state.curretTeam,
            "ValidInput": state.team
        }
        api.editPermission(dataInputApi, (err) => {
            if (err) {
                // tra lai gia tri cu
                if (!optionDelete) {
                    // xoa name permisstion di
                    let location = state.team.indexOf(field);
                    if (location !== -1) {
                        state.team.splice(location, 1);
                    }
                } else {
                    // them name permisstion vao
                    state.team.push(field)
                }
                // thong bao
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                let that = this;
                that.props.categoryConfig[Object.keys(that.props.categoryConfig)].map((category, index) => {
                    if (ValidInput.isEmpty(state.team)) {
                        that.state.valueCategoryPermissionList[index] = false;
                    } else {
                        that.state.valueCategoryPermissionList[index] = state.team.indexOf(category) !== -1;
                    }
                })
                this.setState(state);
                Notification("success");
            }
        })
    }
    componentDidMount() {
        let that = this;
        that.props.categoryConfig[Object.keys(that.props.categoryConfig)].map((category, index) => {
            if (ValidInput.isEmpty(that.props.team)) {
                that.state.valueCategoryPermissionList[index] = false;
            } else {
                that.state.valueCategoryPermissionList[index] = that.props.team.indexOf(category) !== -1;
            }
        })
        this.setState(that.state);
    }
    render() {
        let that = this;
        return (
            <React.Fragment>
                <tr
                    className="cursor-pointer full-width"
                    onClick={() => this.showModal('tableEditPermission')}
                >
                    <td style={{ "textIndent": "15px" }}>
                        {this.props.categoryName}
                    </td>
                    <td>
                        {
                            this.state.valueCategoryPermissionList.map((value, index) => {
                                return (
                                    (value)
                                        ? <FontAwesomeIcon className="mr-1" icon={faSquareFull} key={index} color="#5baa00"></FontAwesomeIcon>
                                        : <FontAwesomeIcon className="mr-1" icon={faSquareFull} key={index} color="#767676"></FontAwesomeIcon>
                                )
                            })
                        }
                    </td>
                    <td><FontAwesomeIcon className="float-right" icon={faAngleRight} style={{ cursor: 'pointer' }} onClick={() => this.showModal('tableEditPermission')} /></td>
                </tr>
                <tr>
                    <TableEditPermission
                        valuePermission={that.state.valueCategoryPermissionList}
                        permissionsName={that.props.categoryConfig[Object.keys(that.props.categoryConfig)]}
                        showModal={this.state.showModal}
                        inverseState={this.inverseState}
                        teamKey={this.props.index}
                    />
                </tr>
            </React.Fragment>
        )
    }
}


class Permission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            dropDownValue: "",
            isLoaded: {
                team: false
            },
            showModal: {
                editTeamName: false,
                createTeam: false,
                deleteTeam: false
            },
            filter: {
                team: null
            },
            team: {
                id: [],
                name: [],
                permissions: []
            },
            categoryName: ['Epics', 'Works', 'Tasks', 'Issues', 'Wiki'],
            categoryConfigList: [
                {
                    epics: [
                        'view_epic',
                        'add_epic',
                        'modify_epic',
                        'comment_epic',
                        'delete_epic'
                    ]
                },
                {
                    work: [
                        'view_work',
                        'add_work',
                        'modify_work',
                        'delete_work'
                    ]
                },
                {
                    tasks: [
                        'view_task',
                        'add_task',
                        'modify_task',
                        'comment_task',
                        'delete_task'
                    ]
                },
                {
                    issues: [
                        'view_issue',
                        'add_issue',
                        'modify_issue',
                        'comment_issue',
                        'delete_issue'
                    ]
                },
                {
                    wiki: [
                        'view_wiki',
                        'add_wiki',
                        'modify_wiki',
                        'delete_wiki',
                    ]
                }
            ]
        };
        this.toggle = this.toggle.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.inverseState = this.inverseState.bind(this);
        this.changeOptionFilterDisplay = this.changeOptionFilterDisplay.bind(this);
        this.eventEditTeamName = this.eventEditTeamName.bind(this);
        this.handRenameTeam = this.handRenameTeam.bind(this);
        this.eventCreateTeam = this.eventCreateTeam.bind(this);
        this.handCreateTeam = this.handCreateTeam.bind(this);
        this.handDeleteTeam = this.handDeleteTeam.bind(this);
    }
    handleShowModal(modal) {
        let state = Object.assign({}, this.state.showModal);
        state[modal] = true;
        this.setState({
            showModal: state
        })
    }
    handleCloseModal(modal) {
        let state = Object.assign({}, this.state.showModal);
        state[modal] = false;
        this.setState({
            showModal: state
        });
    }
    inverseState(key1, key2) {
        let state = Object.assign({}, this.state);
        state[key1][key2] = !state[key1][key2];
        this.setState(state)
    }
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    changeValue(event, value) {
        this.setState({
            dropDownValue: event.currentTarget.textContent,
            moveMemberTo: value
        });
    }
    changeOptionFilterDisplay(setOptionTo) {
        let state = Object.assign({}, this.state);
        state.filter.team = setOptionTo;
        let array = this.state.team.id.filter((value, key) => value != setOptionTo);
        state.dropDownValue = this.state.team.name[this.state.team.id.indexOf(array[0])];
        this.setState(state);
    }
    eventEditTeamName(event) {
        if (event.key === "Enter") {
            this.handRenameTeam(this.state.filter.team, event.target.value)
            this.inverseState("showModal", "editTeamName")
        } else if (event.key === "Escape") {
            this.setState({ inputCreateTeam: "" });
            this.inverseState("showModal", "editTeamName")
        }
    }
    handRenameTeam(idTeamRename, value) {
        let state = this.state.team;
        let dataInputApi = {
            "id": idTeamRename,
            "name": value
        }
        api.editRoleName(dataInputApi, (err, result) => {
            if (err) {
                if (err === "Failed to fetch") Notification("error", "Rename team " + value + " failed", err)
                else switch (err[1]) {
                    case "Bad Request":
                        Notification("error", "Rename team " + value + " failed", "This team name already exists")
                        break;
                    case "Forbidden":
                        Notification("error", "Rename team " + value + " failed", "No permission to Rename team")
                        break;
                    default:
                        Notification("error", "Rename team " + value + " failed", err[1])
                        break;
                }
            } else {
                state.name[this.state.team.id.indexOf(idTeamRename)] = result.subject;
                this.setState({
                    team: state
                });
                Notification("success", "Rename team successful", "fix " + state.name[this.state.team.id.indexOf(idTeamRename)] + " team name done");
            }
        })
    }
    eventCreateTeam(event) {
        if (event.key === "Enter") {
            this.handCreateTeam(event.target.value)
            this.inverseState("showModal", "createTeam")
        }
        if (event.key === "Escape") {
            this.inverseState("showModal", "createTeam")
        }
    }
    handCreateTeam(teamName) {
        let state = Object.assign({}, this.state);
        api.createRole(teamName, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.team.id.push(result.id);
                state.team.name.push(result.subject);
                state.team.permissions.push(result.permissions);
                state.filter.team = result.id;
                this.setState(state);
                Notification("success");
                this.handleCloseModal('createTeam');
            }
        })
    }
    handDeleteTeam(idTeamDelete) {
        let state = this.state;
        if (this.state.filter.team !== this.state.moveMemberTo) {
            let dataInputApi = {
                idTeamDelete: this.state.filter.team,
                idTeamMoveTo: this.state.moveMemberTo
            }
            api.deleteRole(dataInputApi, (err) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    try {
                        state.team.name.splice(state.team.id.indexOf(idTeamDelete), 1);
                        state.team.id.splice(state.team.id.indexOf(idTeamDelete), 1);
                    } catch (error) { }
                    this.setState(state);
                    this.changeOptionFilterDisplay(this.state.team.id[0]);
                    Notification("success");
                    this.handleCloseModal('deleteTeam');
                }
            })
        }
    }
    componentDidMount() {
        let state = Object.assign({}, this.state);
        api.getIdRole((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                result.map((result) => {
                    state.team.id.push(result.id);
                    state.team.name.push(result.subject);
                    state.team.permissions.push(result.permissions);
                });
                state.filter.team = result[0].id;
                state.isLoaded.team = true;
                state.moveMemberTo = state.filter.team === state.team.id[0] ? state.team.id[1] : state.team.id[0]; // gán giá trị default cho ô option moveMemberTo
                state.dropDownValue = state.team.name[1];
                this.setState(state);
            }
        })
    }
    render() {
        console.log("render Permission:");
        if (!this.state.isLoaded.team) return (<LoadingSprinner />)
        else return (
            <React.Fragment>
                <React.Fragment>
                    {/* Modal delete team*/}
                    <Modal isOpen={this.state.showModal.deleteTeam}>
                        <ModalHeader>Delete team</ModalHeader>
                        <ModalBody>
                            Be careful! All team estimations will be removed
                        <Row>
                                <Col xl="5">
                                    Move all member to
                            </Col>
                                <Col xl="7">
                                    <Dropdown className="d-inline-block float-right" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                        <DropdownToggle caret >
                                            {this.state.dropDownValue}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {this.state.team.id.map((value, key) => {
                                                if (value !== this.state.filter.team) {
                                                    return <DropdownItem key={utils.randomString()} onClick={(event) => { this.changeValue(event, value) }}>{this.state.team.name[key]}</DropdownItem>
                                                }
                                            })}
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.handleCloseModal.bind(this, 'deleteTeam')}>
                                Cancel
                        </Button>
                            <Button color="success" onClick={this.handDeleteTeam.bind(this, this.state.filter.team)}>
                                Sure
                        </Button>
                        </ModalFooter>
                    </Modal>
                    {/* End modal here */}
                </React.Fragment>
                <React.Fragment>
                    <Container fluid className="p-0">
                        <Row>
                            <Col md="3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h5" className="mb-0">
                                            Team
                                        </CardTitle>
                                    </CardHeader>
                                    <ListGroup flush>
                                        {
                                            this.state.team.id.map((idTeam, index) => {
                                                return (
                                                    <ListGroupItem
                                                        tag="a"
                                                        href="#"
                                                        key={utils.randomString()} action
                                                        className={this.state.filter.team === idTeam ? "active" : "inactive"}
                                                        onClick={this.changeOptionFilterDisplay.bind(this, idTeam)}
                                                    >
                                                        {this.state.team.name[index]}
                                                    </ListGroupItem>
                                                )
                                            })
                                        }
                                        {
                                            this.state.showModal.createTeam
                                                ?
                                                <Input type="text" name="inputCreateTeam" id="inputCreateTeam" placeholder="Team name" onKeyUp={this.eventCreateTeam.bind(this)} />
                                                :
                                                <Button color="success" className="m-0" onClick={this.inverseState.bind(this, 'showModal', 'createTeam')}>
                                                    <FontAwesomeIcon icon={faPlus} />
                                                    &nbsp;Create
                                        </Button>
                                        }
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col md="9">
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h4" className="mb-0">
                                            <Row className="Permission__card__row p-2">
                                                <Col xl="11" >
                                                    {
                                                        this.state.showModal.editTeamName
                                                            ?
                                                            <Input type="text" name="inputEditTeamName" id="inputEditTeamName" defaultValue={this.state.team.name[this.state.team.id.indexOf(this.state.filter.team)]} onKeyUp={this.eventEditTeamName.bind(this)} />
                                                            :
                                                            <Label className="mb-0">
                                                                PERMISSION <span className="text-success"> {this.state.team.name[this.state.team.id.indexOf(this.state.filter.team)]}</span>
                                                            </Label>
                                                    }
                                                </Col>
                                                <Col xl="1" >
                                                    <React.Fragment>
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                            className="mr-2 cursor-pointer full-width"
                                                            onClick={this.inverseState.bind(this, "showModal", "editTeamName")}
                                                        />
                                                        <FontAwesomeIcon
                                                            className="cursor-pointer full-width"
                                                            icon={faTrash}
                                                            onClick={this.handleShowModal.bind(this, 'deleteTeam')}
                                                        />
                                                    </React.Fragment>
                                                </Col>
                                            </Row>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Table className="mb-0 table-hover">
                                            <tbody>
                                                {
                                                    this.state.categoryConfigList.map((categoryConfig, index) => {
                                                        if (this.state.team.permissions[this.state.team.id.indexOf(this.state.filter.team)]) return (
                                                            <CategoryPermissionList
                                                                key={utils.randomString()}
                                                                index={index}
                                                                categoryName={this.state.categoryName[index]}
                                                                categoryConfig={categoryConfig}
                                                                categoryConfigList={this.state.categoryConfigList}
                                                                team={this.state.team.permissions[this.state.team.id.indexOf(this.state.filter.team)]}
                                                                currentTeam={this.state.filter.team}
                                                            />
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            </React.Fragment>
        )
    }
}

export default Permission;