import React from "react";
import moment from 'moment'
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button,
    FormGroup, Input, Row, Col, Label, Badge,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Pagination, PaginationItem, PaginationLink,
    Media,
} from "reactstrap"
import { Link } from "react-router-dom";
import { CustomImg } from "../../components/CustomTag"
import Notification from "../../components/Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faAtom, faExclamation, faBomb } from "@fortawesome/free-solid-svg-icons";
import { ChevronRight, ChevronLeft, X } from 'react-feather'
import { getScrollParent } from "fullcalendar";

const ValidInput = require('../../utils/ValidInput');

const utils = require("../../utils/utils");

class ModalAssignUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        }
    }

    handleSelectUser(id) {
        let state = utils.copyState(this.state);
        if (this.state.mode === "single") {
            if (state.userSelected.indexOf(id) === -1) {
                state.userSelected[0] = id;
            } else {
                state.userSelected = [];
            }
        } else {
            let pos = state.userSelected.indexOf(id);
            if (pos === -1) {
                state.userSelected.push(id);
            } else {
                state.userSelected.splice(pos, 1);
            }
        }
        this.setState(state)
    }

    handleSave() {
        this.props.handleSave(this.state.userSelected)
    }
    handleCancel() {
        this.props.handleCancel()
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            ...nextProps
        })
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.handleCancel.bind(this)}>
                <ModalHeader toggle={this.handleCancel.bind(this)}>
                    Assign users
                </ModalHeader>
                <ModalBody>
                    <Input type="search" placeholder="Search member" />
                    <div className="mt-3 overflow-y-20x">
                        {
                            this.state.allUsers.map(({ id, photo, full_name }, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={"border-bottom hover-color " + (this.state.userSelected.indexOf(id) === -1 ? "" : "active-color")}
                                        onClick={this.handleSelectUser.bind(this, id)}
                                    >
                                        <CustomImg className="img--user--square-3x" src={photo} />
                                        <span className="ml-2">{full_name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.handleCancel.bind(this)}>
                        Cancel
                        </Button>
                    <Button color="success" onClick={this.handleSave.bind(this)}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}


class ModalConfirm extends React.Component {
    constructor(props) {
        super(props);
    }

    handleOk() {
        this.props.handleOk();
    }

    handleCancel() {
        this.props.handleCancel();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody>
                    {
                        ValidInput.isEmpty(this.props.message) ?
                            "Are you sure?"
                            :
                            this.props.message
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.handleCancel}>
                        Cancel
                    </Button>
                    <Button color="success" onClick={this.props.handleOk}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}

class ModalIssue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            subject: "",
            type: "Bug",
            severity: "Wishlist",
            priority: "Low",
            tags: [],
            description: "",
            status: "New",
            due_date: "",
            assigned_users: [],

            assign_user: false
        };
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleRemoveTag = this.handleRemoveTag.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const copy_props = utils.copyState(nextProps);
        const { subject, tags, status, assigned_users, due_date, description, isOpen, type, severity, priority } = copy_props;
        this.setState({
            isOpen: isOpen,
            subject: utils.returnThisWhenNull(subject, ""),
            type: utils.returnThisWhenNull(type, "Bug"),
            severity: utils.returnThisWhenNull(severity, "Wishlist"),
            priority: utils.returnThisWhenNull(priority, "Low"),
            tags: utils.returnThisWhenNull(tags, []),
            assigned_users: utils.returnThisWhenNull(assigned_users, []),
            description: utils.returnThisWhenNull(description, ""),
            status: utils.returnThisWhenNull(status, "New"),
            due_date: utils.returnThisWhenNull(due_date, "")
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSelect(component, value) {
        this.setState({
            [component]: value
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
            if (utils.ValidInput.isEmpty(tag)) {
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

    handleOk() {
        if (utils.ValidInput.isEmpty(this.state.subject) || utils.ValidInput.isEmpty(this.state.description) || utils.ValidInput.isEmpty(this.state.due_date)) {
            let obj = "";

            switch (true) {
                case utils.ValidInput.isEmpty(this.state.subject):
                    obj = "Subject"
                    break;
                case utils.ValidInput.isEmpty(this.state.description):
                    obj = "Description"
                    break;
                case utils.ValidInput.isEmpty(this.state.due_date):
                    obj = "Due Date"
                    break;
            }
            Notification("warning", "Warning", obj + " is required!")
        } else {
            this.props.handleOk(this.state);
        }
    }

    handleCancel() {
        this.props.handleCancel();
    }

    CancleAssign() {
        this.setState({
            assign_user: false,
        });
    }
    AssignToMe() {
        let me = []
        me.push(this.props.me)
        this.setState({
            assigned_users: me
        });
    }

    render() {
        const { memberInProject } = this.props;
        return (
            <React.Fragment>
                <ModalAssignUser
                    isOpen={this.state.assign_user}
                    allUsers={memberInProject}
                    userSelected={this.state.assigned_users}
                    handleSave={this.handleAssignUsers.bind(this)}
                    handleCancel={this.CancleAssign.bind(this)}
                />
                <Modal isOpen={this.state.isOpen} size="lg" toggle={this.handleCancel.bind(this)}>
                    <ModalHeader toggle={this.handleCancel.bind(this)}>
                        {this.props.id === "add" ? "New Issue" : "Modify Issue"}
                    </ModalHeader>
                    <ModalBody>
                        <Row form>
                            <Col>
                                <Label>Type >> Severity >> Priority</Label>
                            </Col>
                        </Row>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <UncontrolledDropdown>
                                        <DropdownToggle caret outline color="info" className="full-width">
                                            <FontAwesomeIcon icon={faAtom} className="mr-1" />
                                            <span className="mr-1">{this.state.type}</span>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "type", "Bug")}>Bug</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "type", "Question")}>Question</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "type", "Enhancement")}>Enhancement</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <UncontrolledDropdown>
                                        <DropdownToggle caret outline color="danger" className="full-width">
                                            <FontAwesomeIcon icon={faBomb} className="mr-1" />
                                            <span className="mr-1">{this.state.severity}</span>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "severity", "Wishlist")}>Wishlist</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "severity", "Minor")}>Minor</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "severity", "Normal")}>Normal</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "severity", "Important")}>Important</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "severity", "Critical")}>Critical</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <UncontrolledDropdown>
                                        <DropdownToggle caret outline color="warning" className="full-width">
                                            <FontAwesomeIcon icon={faExclamation} className="mr-1" />
                                            <span className="mr-1">{this.state.priority}</span>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "priority", "Low")}>Low</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "priority", "Normal")}>Normal</DropdownItem>
                                            <DropdownItem onClick={this.handleSelect.bind(this, "priority", "High")}>High</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>

                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md="8">
                                <FormGroup className="mr-3">
                                    <Label>Subject</Label>
                                    <Input
                                        name="subject"
                                        onChange={this.handleChange.bind(this)}
                                        type="text"
                                        value={this.state.subject}
                                        placeholder="Subject"
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
                                        <option> In progress</option>
                                        <option>Ready for test</option>
                                        <option>Closed</option>
                                        <option>Needs info</option>
                                        <option>Rejected</option>
                                        <option>Postponed</option>
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
                                        value={utils.ValidInput.isEmpty(this.state.due_date) ? "--/--/--" : this.state.due_date}
                                        max="2100-12-31"
                                        min={`${new Date().getFullYear()}- ${new Date().getMonth() + 1}-${new Date().getDate()}`}
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
                                                                className="rounded-circle img--user--square-2x ml-1 mt-1"
                                                            />
                                                        )
                                                })
                                            }
                                        </div>

                                        <div className="mt-3" >
                                            <a className="font-size-1x"><span
                                                className="text-color-orange" onClick={this.toggle.bind(this, "assign_user")}>Assign</span> or <span
                                                    className="text-color-orange" onClick={this.AssignToMe.bind(this)}>Assign to me</span></a>
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

class ModalStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const status = ["New", "In progress", "Ready for test", "Closed", "Needs info", "Rejected", "Postponed"]
        let locate = this.props.locate;
        return (
            <Modal isOpen={this.props.isChange} toggle={this.props.toggle} >
                <ModalHeader toggle={this.props.toggle}>Update Status  "{this.props.subject}"</ModalHeader>
                <ModalBody>
                    <div className="mt-3 overflow-y-20x" >
                        {status.map((value, key) => (
                            <div key={key}
                                className={"border-bottom hover-color " + (locate != value ? "" : "active-color")}
                                onClick={this.props.setStatus.bind(this, value)}
                            >
                                <span className="ml-2">{value}</span>
                            </div>
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.toggle}>Cancel</Button>{' '}
                    <Button color="secondary" onClick={this.props.handleOK.bind(this, locate)}>OK</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

class ModalAddTag extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.handleCancel}>
                <ModalHeader toggle={this.props.handleCancel}>Confirm</ModalHeader>
                <ModalBody>
                   
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.handleCancel}>
                        Cancel
                </Button>
                    <Button color="success" onClick={this.props.handleOk}>
                        OK
                </Button>
                </ModalFooter>
            </Modal>
        )
    }

}
class CircleCircle extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const color = [
            ["Bug", "#a90707"],
            ["Hight", "#a90707"],
            ["Minor", "#729fcf"],
            ["Question", "#729fcf"],
            ["Important", "#f57900"],
            ["Normal", "#4e9a06"],
            ["Enhancement", "#4e9a06"],
            ["Normal", "#4e9a06"],
            ["Low", "#999"],
            ["Wishlist", "#999"],
            ["Critical", "#cc0000"]
        ]
        const mapCorlor = new Map(color);
        return (
            <svg height="30" width="30" >
                <circle cx="15" cy="15" r="10" fill={!ValidInput.isEmpty(mapCorlor.get(this.props.status)) ? mapCorlor.get(this.props.status) : null} />
                Sorry, your browser does not support inline SVG.
        </svg>
        )
    }
}

class PaginationIssue extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let Array = []
        for (let i = 0; i < this.props.total; i++) {
            Array.push(i)
        }
        return (
            <Pagination aria-label="Page navigation example">

                {/* <PaginationItem onClick ={this.props.setPagHere.bind(this)}>
                    <PaginationLink first id = {0}  onClick ={this.props.setPagHere.bind(this)}/>
                </PaginationItem> */}

                <PaginationItem onClick={this.props.setPagHere.bind(this)}>
                    <PaginationLink previous id="previous" />
                </PaginationItem>

                {Array.map((value, key) => {
                    return (
                        <PaginationItem key={key} onClick={this.props.setPagHere.bind(this)} className={this.props.pagHere == value ? "active" : ""}   >
                            <PaginationLink id={value} onClick={this.props.setPagHere.bind(this)}  >
                                {value + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })
                }
                <PaginationItem onClick={this.props.setPagHere.bind(this)} >
                    <PaginationLink next id="next" value={this.props.total} onClick={this.props.setPagHere.bind(this)} />
                </PaginationItem>
                {/* 
                <PaginationItem onClick ={this.props.setPagHere.bind(this)}>
                    <PaginationLink last id = {this.props.total - 1}  onClick ={this.props.setPagHere.bind(this)}/>
                </PaginationItem> */}

            </Pagination>
        );
    }
}


class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({

        });

    }
    handlingValue() {
        const data = [];
        this.props.dataActivity.map((value, key) => {
            const map = new Map();
            map.set("time", value.created_date)
            map.set("photo", value.user.photo)
            map.set("link", "")
            map.set("name", value.user.full_name)
            //console.log(value)
            // console.log(`----${key}-----`)

            let diff_values = value.diff_values;
            for (let stt in diff_values) {
                let a = diff_values[stt]
                // console.log(a)
                map.set("status", stt)
                switch (stt) {
                    case "attachments":
                        for (let act in a) {
                            if (!ValidInput.isEmpty(a[act])) {
                                map.set("action", `${act.charAt(0).toUpperCase() + act.slice(1)} attachments `)
                                map.set("object", a[act]["subject"])
                            }
                        }
                        break
                    case "assigned_to":
                        for (let act in a) {
                            if (!ValidInput.isEmpty(a[act])) {
                                map.set("action", `Assigned to :`)
                                map.set("object", `${a[1]}  ${!ValidInput.isEmpty (a[0])?`from ${a[0]}`:  ""}`)
                            }
                        }
                        break;
                    case "watchers":
                        for (let act in a) {
                            if (!ValidInput.isEmpty(a[act])) {
                                map.set("action", `${map.get("status").charAt(0).toUpperCase() + map.get("status").slice(1)} :`)
                                map.set("object", a["1"])
                            }
                        }
                        break;
                    case "description":
                        for (let act in a) {
                            if (!ValidInput.isEmpty(a[act])) {
                                map.set("action", `Change description :`)
                                map.set("object", `"${(a["0"]).replace('<p>', '').replace('</p>', '')}" 
                            =>
                            "${(a["1"]).replace('<p>', '').replace('</p>', '')}"`)
                                break;
                            }
                        }
                        break;
                    default:
                        for (let act in a) {
                            if (!ValidInput.isEmpty(a[act])) {
                                map.set("action", `Change ${map.get("status")} :`)
                                map.set("object", `"${a["0"]}" => "${a["1"]}"`)
                            }
                        }
                        break;
                }
                data.push(map);
                break;
            }
        });
        // console.log("---------------------------------")
        // console.log(data)
        return data;
    }
    render() {
        const data = this.handlingValue()
        // console.log((data))
        return (
            <div>
                {data.map((value, key) => {
                    return (
                        <React.Fragment key={key}>
                            <Media>
                                {/* img */}
                                <Link to={value.get("link")} activeclassname="active" className="pt-2">
                                    <CustomImg
                                        key={utils.randomString()}
                                        src={value.get("link")}
                                        alt="avatar"
                                        className="rounded-circle img--user--square-2x"
                                    />
                                </Link>
                                {/* content */}
                                <Media body className="p-1">
                                    <strong><Link to={value.get("link")} activeclassname="active"
                                        className="Activities___linkto">{value.get("name")}</Link>{" "}</strong>
                                    <span className="float-right" >
                                        {moment(value.get("time")).format("DD MMM YYYY hh:mm")}
                                    </span >
                                    <br />
                                    <Badge color="warning" className="pt-1 aria-label " style={{ fontSize: 13 }}>

                                        {
                                            ""
                                        }
                                    </Badge>
                                    {`${value.get("action")} ${value.get("object")}`}
                                </Media>
                            </Media>
                            <hr />
                        </React.Fragment>
                    )
                })}

            </div>
        )
    }
}



class Comments extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        // const linkUser = `/profile${this.props.dataComment.user.pk === utils.getUserId() ? '' : `?username=${data.user.username}`}`;
        //console.log(this.props.dataComment)
        const linkUser = "";
        return (
            <div >
                {
                    this.props.dataComment.map((value, key) => (
                        <div key={key}>
                            <Media >
                                {/* img */}
                                <Link to={linkUser} activeclassname="active" className="pt-2 ">
                                    <CustomImg
                                        key={utils.randomString()}
                                        src={value.user.photo}
                                        alt="avatar"
                                        className="rounded-circle img--user--square-2x mr-2"
                                    />
                                </Link>
                                {/* content */}
                                <Media body className="p-1">
                                    <React.Fragment>
                                        <Link to={linkUser} activeclassname="active" className="Comment___linkto">
                                            <strong>{value.user.full_name}</strong>
                                        </Link>
                                        {' '}
                                        <span className="float-right" >
                                            {moment(value.created_date).fromNow()}

                                        </span >
                                    </React.Fragment>
                                    <br />
                                    {value.comment}
                                </Media>
                            </Media>
                            <hr />
                        </div>
                    ))
                }

            </div>
        )
    }
}

class BoxBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FormGroup row>
                    <Col sm={2}>
                        <Input type="password" name="password" id="examplePassword" />
                    </Col>
                    <Label for="examplePassword" sm={1}><X /></Label>
                </FormGroup>
            </div>
        )
    }
}

export {
    ModalAssignUser,
    ModalConfirm,
    ModalIssue,
    ModalStatus,
    CircleCircle,
    PaginationIssue,
    Activity,
    Comments,
    ModalAddTag,
    BoxBox
}

