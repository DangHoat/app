import React, { Component } from 'react';
import {
    Container,
    Card, CardHeader, CardTitle,
    Table,
}
from 'reactstrap'
import {connect} from 'react-redux'
import { CustomImg } from "../../../components/CustomTag"
import { ModalAssignUser, ModalIssue, ModalStatus,PaginationIssue,CircleCircle} from "../ModalIssue";
import { ChevronDown, PlusCircle } from 'react-feather'
import utils from "../../../utils/utils"
import Notification from "../../../components/Notification";

const API = require("../api/api")
const ValidInput = require('../../../utils/ValidInput');
const ultils = require('../../../utils/utils')


class ListIssue extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            thisSubject: "",
            isAdd: false,
            isChangeStatus: false,
            AssignTo: false,
            check: false,
            changeStatus: false,
            idAssigned: [],
            id: "",
            version: "",
            locate: "",
            pagHere : 0,
        })
        this.handleOk = this.handleOk.bind(this)
    }

    Assign(promise,id, version, id_assign) {
        if (ultils.getPermissionInProject().member&&promise) {
            this.setState({
                id: !ValidInput.isEmpty(id) ? id : "",
                version: version,
                AssignTo: !this.state.AssignTo,
                // idAssigned: ValidInput.isEmpty(id_assign) ? this.state.idAssigned.unshift(id_assign) : this.state.idAssigned.unshift("")
            });
        }
    }

    CancelAssign() {
        this.setState({
            AssignTo: !this.state.AssignTo
        });
    }
    reAsign(value) {
        let data = {
            assigned_to: value[0],
            version: this.state.version
        };
        API.Update(this.state.id, data, (err, data) => {
            if (err) {
                this.setState({
                    AssignTo: !this.state.AssignTo,
                });
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    AssignTo: !this.state.AssignTo,
                });
                Notification("success");
                this.props.reLoad();
            }
        })
    }

    //

    //thêm 1 Issue
    AddIssue() {
        if (ultils.getPermissionInProject().member){
            this.setState({
                isAdd: !this.state.isAdd
            });
        }
       
    }
    handleOk(data) {
        API.AddIssue(data, (err, result) => {
            if (err) {
                this.setState({
                    isAdd: !this.state.isAdd
                });
                //console.log(err);
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    isAdd: !this.state.isAdd
                });
                // console.log(result);
                this.props.reLoad();
                Notification("success");
            }
        })
    }
    ////Status
    toggleStatus(promise,id, version, subject, status) {
        if (ultils.getPermissionInProject().member && promise) {
            this.setState({
                id: id,
                thisSubject: subject,
                version: version,
                isChangeStatus: !this.state.isChangeStatus,
                locate: status
            });
        }
    }

    setLocateStatus(value) {
        this.setState({
            locate: value,
            isChangeStatus: true,
        });
    }
    UpdateStatus(value) {
        let data = {
            status: value,
            version: this.state.version
        };
        API.Update(this.state.id, data, (err, data) => {
            if (err) {
                this.setState({
                    isChangeStatus: !this.state.isChangeStatus,
                });
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    isChangeStatus: !this.state.isChangeStatus,
                });
                Notification("success");
                this.props.reLoad();
            }
        })
    }
    setPagHere(event){
        switch(event.target.id) {
            case "next":
                console.log(this.state.pagHere)
                if(this.state.pagHere != parseInt(event.target.value)-1){
                    this.setState({
                        pagHere :this.state.pagHere  + 1
                    });
                }    
              break;
            case "previous":
            if(this.state.pagHere > 0){
                    this.setState({
                        pagHere :this.state.pagHere  - 1
                    });
                }
              break;
            default:
                this.setState({
                    pagHere : parseInt(event.target.id)
                });
                break;  
          }
         
    }

    render() {
        let temp = this.props.Data
        let total = Math.ceil(temp.length/10)
        let start =  this.state.pagHere*10;
        let end  = start+10;
        let ListIssue = temp.slice(start,end);
        return (
            <Container fluid className="p-0">
                <Card>
                    <CardHeader className="header-list-issue">
                        <div className="float-right issue-icon">
                            <PlusCircle onClick={this.AddIssue.bind(this)} />
                        </div>
                        <CardTitle tag="h5">
                            {!ValidInput.isEmpty(localStorage.getItem('project')) ? JSON.parse(localStorage.getItem('project')).name : ""}
                            {" "} Issue
                        </CardTitle>
                    </CardHeader>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th scope="col" className="width-percent-10">Type</th>
                                <th scope="col" className="width-percent-10">Severity</th>
                                <th scope="col" className="width-percent-10">Priority</th>
                                <th scope="col" className="width-percent-25">Subject</th>
                                <th scope="col" className="width-percent-15">Status</th>
                                <th scope="col" className="width-percent-10">Created</th>
                                <th scope="col" className="width-percent-15">Assigned to</th>
                            </tr>
                        </thead>
                        <tbody >
                            {!ValidInput.isEmpty(ListIssue) ? ListIssue.map((value, key) => {
                                let promise = (value.owner === this.props.store.user.user.id)
                                if (ValidInput.isEmpty(value)) { return null }
                                return (
                                    <tr className="hover-color issue-table"  key ={key}>
                                        <td title={value.type}>
                                            <CircleCircle status={value.type} />
                                        </td>
                                        <td title={value.severity}>
                                            <CircleCircle status={value.severity} />
                                        </td>
                                        <td title={value.priority}>
                                            <CircleCircle status={value.priority} />
                                        </td>
                                        <td title={value.subject} id={value.id} >
                                            <a className="text-decoration-none text-color-black"
                                                href={"/project/issue?id=" + value.id}
                                            >
                                                {value.subject.length > 30 ? value.subject.slice(0, 25) + "...." : value.subject}
                                            </a>
                                        </td>
                                        <td className="status">

                                            <div className="text-status" title={value.status}>
                                                {value.status}
                                                {" "} <ChevronDown className="chevronDown" onClick={this.toggleStatus.bind(this,promise,value.id, value.version, value.subject, value.status)} />
                                            </div>

                                        </td>
                                        <td>{value.created_date.slice(0, 10)}</td>
                                        <td className="assign" >
                                            < CustomImg className="img--user--square-2x" src={value.photo} />
                                            {' '} {ValidInput.isEmpty( value.full_name_display) ? "Not Assign"
                                                :
                                                value.full_name_display.length < 10 ? value.full_name_display : value.full_name_display.slice(0, 9) + "..."} {' '}
                                            <ChevronDown className="chevronDown" onClick={this.Assign.bind(this,promise,value.id, value.version, value.id_assign)} />
                                        </td>
                                    </tr>
                                )
                            }
                            )
                                : null}
                        </tbody>
                    </Table>
                   
                    { this.props.Data.length>11
                    ?
                    
                       
                    <CardHeader>
                        <hr/>
                        <div className="float-right ml-2">
                            <PaginationIssue 
                                setPagHere = {this.setPagHere.bind(this)}
                                total = {total}
                                pagHere = {this.state.pagHere}
                            />
                        </div>
                    </CardHeader>
    
                    :
                        null}
                </Card>
                <ModalAssignUser
                    isOpen={this.state.AssignTo}
                    allUsers={this.props.memberProject}
                    userSelected={[this.state.idAssigned[0]]}
                    mode="single"
                    handleSave={this.reAsign.bind(this)}
                    handleCancel={this.CancelAssign.bind(this)} />

                <ModalIssue
                    id="add"
                    me = {this.props.user.user.id}
                    isOpen={this.state.isAdd}
                    memberInProject={this.props.memberProject}
                    userSelected={[this.state.idAssigned]}
                    handleOk={this.handleOk.bind(this)}
                    handleCancel={this.AddIssue.bind(this)} />

                <ModalStatus
                    isChange={this.state.isChangeStatus}
                    toggle={this.toggleStatus.bind(this,true)}
                    subject={this.state.thisSubject}
                    locate={this.state.locate}
                    handleOK={this.UpdateStatus.bind(this)}
                    setStatus={this.setLocateStatus.bind(this)}
                />
            </Container>
        );
    }
}

export default connect(store => ({
    app: store.app,
    user: store.user,
    store : store
}))(ListIssue);