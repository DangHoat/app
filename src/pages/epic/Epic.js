import React from "react";
import { 
        Container,
        Button, 
        Card, CardHeader, CardBody,
        Input,
        Progress,
        UncontrolledTooltip
    } from 'reactstrap';

import './Epic.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from 'react-bootstrap-table-next';

import { randomString } from "../../utils/utils";

import Notification from "../../components/Notification"
import ModalEpic from "./ModalEpic"
import { 
    CustomImg, 
    LoadingSprinner 
} from "../../components/CustomTag";

const utils = require("../../utils/utils");

const ValidInput = require("../../utils/ValidInput");

const api = require("./api/api");

// let subEpic_data_file = require('./epicData.json');

function epicNameFormatter(string) {
    return (
        <div>
            <b>{string}</b>
        </div>
    );
}

function epicProjectFormatter(src) {
    let tooltipId = randomString(3)
    return (
        <div>
        <CustomImg id={"_" + tooltipId} className="img--user--square-3x rounded" src={src.logo}/>
            <UncontrolledTooltip placement="right" target={"_" + tooltipId}>
                {src.subject}
            </UncontrolledTooltip>
        </div>
    );
}

function epicOwnerFormatter(src) {
    let tooltipId = randomString(3)
    return (
        <div>
        <CustomImg id={"_" + tooltipId} className="img--user--square-3x rounded" src={src.photo}/>
            <UncontrolledTooltip placement="right" target={"_" + tooltipId}>
                {src.full_name}
            </UncontrolledTooltip>
        </div>
    );
}

function epicCreatedFormatter(date) {
    return (
        <div>
            {date.slice(0, 10)}
        </div>
    );
}

function epicStatusFormatter(string) {
    return (
        <div>
            {string}
        </div>
    );
}

function epicProgressFormatter(number) {
    return (
        <div>
            <Progress animated color="success" value={number}>{number}%</Progress>
        </div>
    );
}

const { SearchBar } = Search;

const epicColumns = [
    {
        dataField: "subject",
        text: "Name",
        sort: true,
        formatter: epicNameFormatter
    },
    {
        dataField: "project",
        text: "Project",
        sort: true,
        formatter: epicProjectFormatter
    },
    {
        dataField: "owner",
        text: "Owner",
        sort: true,
        formatter: epicOwnerFormatter
    },
    {
        dataField: "created_date",
        text: "Created",
        sort: true,
        formatter: epicCreatedFormatter
    },
    {
        dataField: "status",
        text: "Status",
        sort: true,
        formatter: epicStatusFormatter
    },
    {
        dataField: "total_comments",
        text: "Progress",
        sort: true,
        formatter: epicProgressFormatter
    }
]

const epicColumnsHidden = [
    {
        dataField: "subject",
        text: "",
        // sort: true,
        formatter: epicNameFormatter
    },
    {
        dataField: "project",
        text: "",
        // sort: true,
        formatter: epicProjectFormatter
    },
    {
        dataField: "owner",
        text: "",
        // sort: true,
        formatter: epicOwnerFormatter
    },
    {
        dataField: "created_date",
        text: "",
        formatter: epicCreatedFormatter
    },
    {
        dataField: "status",
        text: "",
        // sort: true,
        formatter: epicStatusFormatter
    },
    {
        dataField: "total_comments",
        text: "",
        // sort: true,
        formatter: epicProgressFormatter
    }
]

function getProjectName(){
    let project = localStorage.getItem("project");
    if(ValidInput.isEmpty(project))
        return null;
    return (JSON.parse(project).name);
}

class Epic extends React.Component{
    constructor(props){
        super(props);
        this.state={
            epic_data: [],
            expandData: [],
            new_epic: false,
            isLoaded: false
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleNewEpic(data) {
        const that = this;
        this.toggle("new_epic");
        let state_data = utils.copyState(this.state.epic_data);
        api.createEpic(data, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                Notification("success");
                state_data.push(result);
                that.setState({epic_data: state_data});
            }
        })
        console.log("epic_data after add:");
        console.log(this.state.epic_data);
    }

    handleModifyEpic(id, data) {
        const that = this;
        let state_data = utils.copyState(this.state.data);
        let index = state_data.findIndex({id: id});
        state_data[index].subject = data.subject;
        state_data[index].description = data.description;
        state_data[index].tag = data.tags;
        // state_data[index].assigned_users = data.assigned_users;
        // state_data[index].status = utils.getIdStatusOfWork(data.status);
        api.modifyWork(id, state_data[index], (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                Notification("success");
                state_data[index] = result;
                that.setState({data: state_data})
            }
        })
    }

    handleExpandEpic(epicID) {
        const that = this;
        api.getEpicWorks(epicID, (err, result) => {
            if (err) {
                Notification("error", "Error". err);
                console.log("err");
            } else {
                console.log("handleExpandEpic: ");
                console.log(result)
                that.setState({expandData: result})
            }
        }
        )
    }

    componentWillMount() {
        api.getEpics((err, result) => {
            if (err) {
                console.log(err);
                Notification("error", "Error", err);
            }
            else {
                this.setState({epic_data: result, isLoaded: true});
            }
            console.log("this.state.epic_data");
            console.log(this.state.epic_data);
        })
    }

    render(){
        let expandRow = {
            onlyOneExpanding: true,
            // showExpandColumn: true,
            // expandByColumnOnly: true,
            expandHeaderColumnRenderer: ({ isAnyExpands }) =>
                isAnyExpands ? null : null,
            expandColumnRenderer: ({ expanded }) =>
                expanded ? ( <FontAwesomeIcon icon={faAngleUp} width={16} height={16} /> ) : ( <FontAwesomeIcon icon={faAngleDown} width={16} height={16} /> ),
            onExpand: (row, isExpand, rowIndex, e) => {
                console.log(row.id);
                console.log(isExpand);
                console.log(rowIndex);
                if (isExpand === true) { 
                    api.getEpicWorks(row.id, (err, result) => {
                        if (err) {
                            Notification("error", "Error". err);
                            console.log("err");
                        } else {
                            console.log("handleExpandEpic: ");
                            console.log(result)
                            this.setState({expandData: result})
                        }
                    })
                }
            },
            onExpandAll: (isExpandAll, rows, e) => {
                console.log(isExpandAll);
                console.log(rows);
            },
            className: "epic__expanded--table",
            renderer: row => (
                <BootstrapTable
                    bootstrap4
                    striped
                    hover
                    bordered={false}
                    keyField="subject"
                    data={this.state.expandData}
                    columns={epicColumnsHidden}
                    headerClasses={"epic__table__hidden--header"}
                    />
                ),
        };
        const memberInProject = utils.getMemberInProject();
        return(
            !this.state.isLoaded ? <LoadingSprinner/> :
            <React.Fragment>
                <React.Fragment>
                        <ModalEpic
                            id="new_epic"
                            isOpen={this.state.new_epic}
                            memberInProject={memberInProject}
                            handleOk={this.handleNewEpic.bind(this)}
                            handleCancel={this.toggle.bind(this, "new_epic")}
                        />
                </React.Fragment>
                <React.Fragment>
                    <Container style={{maxWidth: "100%"}}>
                        <Card>
                            <CardHeader>
                                <span><h1 style={{float: "left"}} ><b>{getProjectName()}</b> &emsp;EPICS</h1></span>
                            </CardHeader>
                            <CardBody>
                            <ToolkitProvider
                                search
                                keyField="subject"
                                data={this.state.epic_data}
                                columns={epicColumns}
                            >
                                {props => (
                                    <div>
                                        <SearchBar { ...props.searchProps }/>
                                        <span><Button style={{float: "right"}} onClick={() => this.toggle("new_epic")} color="primary">+ NEW EPIC</Button></span>
                                        <hr />
                                        <BootstrapTable
                                            { ...props.baseProps }
                                            bootstrap4
                                            striped
                                            hover
                                            bordered={false}
                                            expandRow={expandRow}
                                            pagination={paginationFactory({
                                                sizePerPage: 5,
                                                sizePerPageList: [5, 10, 25, 50]
                                            })}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                            </CardBody>
                        </Card>
                    </Container>
                </React.Fragment>
            </React.Fragment>
        )
    }
}

export default Epic;