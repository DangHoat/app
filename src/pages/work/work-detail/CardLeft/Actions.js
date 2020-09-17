import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faPlus, faAngleDown, faAngleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    PlusCircle, MoreHorizontal, Trash, Save, EditRounded
} from "react-feather"

import Comment from "./Comment";
import Activities from "./Activities";


import {
    Container, Row, Col,
    Card, CardHeader, CardTitle, CardBody, CardSubtitle, Table,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, Progress
} from "reactstrap"
import Notification from "../../../../components/Notification";


import { ModalAssignUser, ModalConfirm } from "../../../../components/Modal";
import { CustomImg, LoadingSprinner, Attachments, Description } from "../../../../components/CustomTag";

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "comments",
            total_comment: 0
        }
    }

    toggle(component) {
        this.setState({ show: component })
    }

    getTotalComment(value) {
        this.setState({
            total_comment: value
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
                            <Comment total_comment={this.getTotalComment.bind(this)} />
                            :
                     <Activities />
                    }
                </CardBody>
            </Card>
        )
    }
}
export default Actions;
