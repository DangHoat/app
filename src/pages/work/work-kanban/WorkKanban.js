import React from "react";
import {
    Card, CardBody, CardHeader, CardTitle,
    Col, Container, Row,
    Button,
    Progress
} from "reactstrap";
import moment from 'moment'
import Notification from "../../../components/Notification";
import {CustomImg, LoadingSprinner} from "../../../components/CustomTag";
import "./WorkKanban.css";

import dragula from "react-dragula";
import {Edit, Trash2} from "react-feather";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import ModalWork from "../ModalWork";
import {ModalConfirm} from "../../../components/Modal";

const api = require("../api/api");

const utils = require("../../../utils/utils");

function timeRemain(time) {
    if(time === null){
        return -1;
    }
    else{
        let dif = moment(time) - moment()
        if (dif < 0)
            return -1;
        return moment().to(moment(time),true);
    }

}

function convertToClassName(string) {
    let spl = string.split(" ");
    let result = "";
    result = result + spl[0].charAt(0) + spl[0].slice(1);
    for (let i = 1; i < spl.length; i++) {
        result = result + "-" + spl[i].charAt(0) + spl[i].slice(1);
    }
    return result;
}

class Lane extends React.Component {
    constructor(props) {
        super(props);
        this.containters = []
        this.state = {
            data: []
        };
    }

    handleContainerLoaded = container => {
        if (container) {
            this.props.onContainerLoaded(container);
        }
    };

    render() {
        const {name, children, numWork} = this.props;
        return (
            <Card className="work-kanban__lane__card">
                <CardHeader className={"pb-1 work-kanban__lane--" + convertToClassName(name) + "__card__header"}>
                    {
                        name !== 'Archived'
                            ?
                            <Button onClick={() => {this.props.toggle("add_work"); this.props.handleGetStatus(name)}} size="sm" className="float-right">
                                <FontAwesomeIcon icon={faPlus}/>
                            </Button>
                            : null
                    }
                    <CardTitle tag="h5">{name}&nbsp;({numWork})</CardTitle>
                </CardHeader>
                <CardBody className="p-1 work-kanban__lane__card__body">
                    <div ref={this.handleContainerLoaded} id={"work-kanban__lane--" + convertToClassName(name)}>
                        {children}
                    </div>
                </CardBody>
            </Card>
        );
    }
}

class Work extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isHover: false,

            modify_work: false,
            confirm: false
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleModifyWork(id, data) {
        this.props.handleModifyWork(id, data);
        this.toggle("modify_work");
    }

    handleRemoveWork(id) {
        this.props.handleRemoveWork(id);
        this.toggle("confirm");
    }

    render() {
        const {id, subject, due_date, assigned_users, status, tags} = this.props.data;
        const memberInProject = utils.getMemberInProject();
        let count_member_limit = 0;
        return (
            <React.Fragment>
                <ModalWork
                    id="modify_work"
                    isOpen={this.state.modify_work}
                    subject={subject}
                    due_date={due_date}
                    assigned_users={assigned_users}
                    memberInProject={memberInProject}
                    tags={tags}
                    status={status}
                    handleOk={this.handleModifyWork.bind(this, id)}
                    handleCancel={this.toggle.bind(this, "modify_work")}
                />
                <ModalConfirm
                    isOpen={this.state.confirm}
                    handleOk={this.handleRemoveWork.bind(this, id)}
                    handleCancel={this.toggle.bind(this, "confirm")}
                />
                <Card
                    className="mb-2 bg-light cursor-grab border work-kanban__work__card"
                    id={"work-" + id}
                >
                    <Progress value={0} color="danger"/>
                    <CardHeader
                        className="work-kanban__work__card__header p-2"
                        onMouseOver={() => this.setState({isHover: true})}
                        onMouseLeave={() => this.setState({isHover: false})}
                    >
                        {
                            this.state.isHover === false
                                ?
                                <div>
                                    {
                                        assigned_users.length === 0 ? "Not Assign" :
                                            assigned_users.map((member, index) => {
                                                let mem = memberInProject.find(memberInProject => memberInProject.id === member);
                                                if (mem !== undefined) {
                                                    count_member_limit++;
                                                    if (count_member_limit < 5)
                                                        return (
                                                            <CustomImg
                                                                key={utils.randomString()}
                                                                src={mem.photo}
                                                                alt="avatar"
                                                                className="rounded-circle img--user--square-2x"
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
                                </div>
                                :
                                <div>
                                    <div className="card-actions float-right">
                                        <Edit size='80' className="mr-2"  onClick={this.toggle.bind(this, "modify_work")}>
                                            Edit
                                        </Edit>
                                        <Trash2 size='80'  onClick={this.toggle.bind(this, "confirm")}>
                                            Delete
                                        </Trash2>
                                    </div>
                                    <div className="float-left p-1">
                                        <FontAwesomeIcon icon={faClock} size="1x" color="grey"/> &nbsp;
                                        {(due_date === undefined) ? ' ' : timeRemain(due_date) === -1 ? "Expired" : timeRemain(due_date)}
                                    </div>
                                </div>
                        }
                    </CardHeader>
                    <CardBody className="p-1 work-kanban__work__card__body">
                        <a href={"/project/work?id=" + id}>#&nbsp;{subject}</a>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}

class WorkKanban extends React.Component {
    constructor(props) {
        super(props);
        this.containers = [];
        this.state = {
            data: [],
            numWork: [0, 0, 0, 0, 0, 0],

            isLoaded: false,

            add_work: false,
            status: null
        };
        this.handleGetStatus = this.handleGetStatus.bind(this);
    }
    
    toggle(component) {   
        this.setState({
            [component]: !this.state[component]
        })
    }
    handleGetStatus(status){
        this.setState({
            status: status
        })      
    }
    //Work
    handleCreateWork(data) {
        let state_data = utils.copyState(this.state.data);
        const that = this;
        this.toggle("add_work");
        api.createWork(data, (err, result) => {
            if(err){
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message)
            } else {
                state_data.push(result);
                that.setState({data: state_data});
                that.updateNumWork();
            }
        })
    }

    handleRemoveWork(id) {
        const that = this;
        let data = utils.copyState(this.state.data);
        api.removeWork(id, (err, result) => {
            if(err){
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message)
            } else {
                Notification("success", "Success", result);
                data.splice(data.findIndex({id: id}), 1);
                that.setState({
                    data: data
                });
                that.updateNumWork();
            }
        })
    }

    handleModifyWork(id, data) {
        const that = this;
        let state_data = utils.copyState(this.state.data);
        let index = state_data.findIndex({id: id});
        state_data[index].subject = data.subject;
        state_data[index].description = data.description;
        state_data[index].due_date = data.due_date;
        state_data[index].tag = data.tags;
        state_data[index].assigned_users = data.assigned_users;
        state_data[index].status = data.status;
        api.modifyWork(id, state_data[index], (err, result) => {
            if(err){
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            } else {
                state_data[index] = result;
                that.setState({data: state_data});
                that.updateNumWork();
            }
        })
    }


    onContainerReady = container => {
        this.containers.push(container);
    };

    updateNumWork() {
        const that = this;
        setTimeout(function () {
            let numWork = utils.copyState(that.state.numWork);
            for (let i = 0; i < 6; i++) {
                numWork[i] = that.containers[i].children.length;
            }
            that.setState({numWork: numWork})
        }, 200);
    }

    componentDidMount() {
        const that = this;
        api.getWorkOfProject((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            } else {
                that.setState({
                    data: result,
                    isLoaded: true
                });
                that.updateNumWork();
            }
        });
        /**
         * Add data
         */
        //  * Dragula
        //  */

        const dk = dragula(this.containers);
        dk.on('drop', function (el, handle) {
            dk.cancel(true);
            let data = utils.copyState(that.state.data);
            let id = el.id.split("-")[1];
            let index = data.findIndex({id: id});
            let newStatus = handle.id.split("--")[1];
            let Status = newStatus.replace(/-/g," ");
            data[index].status = Status;
            api.modifyWork(id, data[index], (err, result) => {
                if(err){
                    Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
                } else {
                    data[index] = result;
                    that.setState({data: data});
                    that.updateNumWork();
                }
            })
        });
    }

    render() {
        const memberInProject = utils.getMemberInProject();
        return (
            !this.state.isLoaded ? <LoadingSprinner/> :
                <>
                    <ModalWork
                        id="add_work"
                        isOpen={this.state.add_work}
                        memberInProject={memberInProject}
                        handleOk={this.handleCreateWork.bind(this)}
                        handleCancel={this.toggle.bind(this, "add_work")}
                        status={this.state.status}
                    />
                    <Container fluid className="p-0">
                        <Row>
                            <Col lg="5" xl="2" className="p-1 ">
                                <Lane
                                    name="New"
                                    onContainerLoaded={this.onContainerReady}
                                    toggle={this.toggle.bind(this)}
                                    numWork={this.state.numWork[0]}
                                    handleGetStatus={this.handleGetStatus.bind(this)}
                                >
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                data.status !== "New" ? null :
                                                    <Work
                                                        key={utils.randomString()}
                                                        data={data}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}
                                                    />
                                            );
                                        })
                                    }
                                </Lane>
                            </Col>
                            <Col lg="5" xl="2" className="p-1 ">
                                <Lane
                                    name="Ready"
                                    onContainerLoaded={this.onContainerReady}
                                    toggle={this.toggle.bind(this)}
                                    numWork={this.state.numWork[1]}
                                    handleGetStatus={this.handleGetStatus.bind(this)}
                                >
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                data.status !== "Ready" ? <></> :
                                                    <Work
                                                        key={utils.randomString()}
                                                        data={data}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}                                                       
                                                    />
                                            );
                                        })
                                    }
                                </Lane>
                            </Col>
                            <Col lg="5" xl="2" className="p-1">
                                <Lane
                                    name="In Progress"
                                    onContainerLoaded={this.onContainerReady}
                                    toggle={this.toggle.bind(this)}
                                    numWork={this.state.numWork[2]}
                                    handleGetStatus={this.handleGetStatus.bind(this)}
                                >
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                data.status !== "In Progress" ? <></> :
                                                    <Work
                                                        key={utils.randomString()}
                                                        data={data}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}                                                     
                                                    />
                                            );
                                        })
                                    }
                                </Lane>
                            </Col>
                            <Col lg="5" xl="2" className="p-1">
                                <Lane
                                    name="Ready for test"
                                    onContainerLoaded={this.onContainerReady}
                                    toggle={this.toggle.bind(this)}
                                    numWork={this.state.numWork[3]}
                                    handleGetStatus={this.handleGetStatus.bind(this)}
                                >
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                data.status !== "Ready for test" ? <></> :
                                                    <Work
                                                        key={utils.randomString()}
                                                        data={data}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}                                                      
                                                  />
                                            );
                                        })
                                    }
                                </Lane>
                            </Col>
                            <Col lg="5" xl="2" className="p-1">
                                <Lane
                                    name="Done"
                                    onContainerLoaded={this.onContainerReady}
                                    toggle={this.toggle.bind(this)}
                                    numWork={this.state.numWork[4]}
                                    handleGetStatus={this.handleGetStatus.bind(this)}
                                >
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                data.status !== "Done" ? <></> :
                                                    <Work
                                                        key={utils.randomString()}
                                                        data={data}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}                                                       
                                                    />
                                            );
                                        })
                                    }
                                </Lane>
                            </Col>
                            <Col lg="5" xl="2" className="p-1">
                                <Lane
                                    name="Archived"
                                    onContainerLoaded={this.onContainerReady}
                                    toggle={this.toggle.bind(this)}
                                    numWork={this.state.numWork[5]}
                                    handleGetStatus={this.handleGetStatus.bind(this)}
                                    >
                                    {
                                        this.state.data.map((data, index) => {
                                            return (
                                                data.status !== "Archived" ? <></> :
                                                    <Work
                                                        key={utils.randomString()}
                                                        data={data}
                                                        handleRemoveWork={this.handleRemoveWork.bind(this)}
                                                        handleModifyWork={this.handleModifyWork.bind(this)}
                                                     />
                                            );
                                        })
                                    }
                                </Lane>
                            </Col>
                        </Row>
                    </Container>
                </>
        )
    }
}

export default WorkKanban;
