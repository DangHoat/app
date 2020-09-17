import React, { Component } from 'react';
import {
    Container,
    Card, CardBody, CardHeader, CardTitle,
    ListGroup, ListGroupItem,
    CustomInput
}
    from 'reactstrap'

import { ChevronDown, ChevronRight, Plus } from 'react-feather'

import SearchBox from '../../../components/SearchBox'
import utils from "../../../utils/utils"
const ValidInput = require('../../../utils/ValidInput');

class FilterIssue extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            statusDrop: {type: false, severity: false, priorities: false, status: false, assignTo: false },
            idAssign:"",
            type:{Bug:"Bug",Question:"Question",Enhanement:"Enhanement",},
            severity:{Wishlist:"Wishlist",Normal:"Normal",Minor:"Minor",Important:"Important",Ciritical:"Ciritical",},
            priority:{Low:"Low",Normal_priority:"Normal",Hight:"Hight",}, 
            status:{New:"New",InProgress:"In progress",Readyfortest:"Ready for test",Closed:"Closed",Rejected:"Rejected",Postponed:"Postponed",Needsinfo:"Needs info"},
            subject:"",
            assignTo:[],
        })
        
    }

    handleGetData(event) {
       this.setState({subject:event});
       
    }
    //check type
    handleChangeType(evt){
        if(evt.target.checked){
            this.setState({type:{...this.state.type,[evt.target.id]:evt.target.name} });
        }else{
            this.setState({type:{...this.state.type,[evt.target.id]:""} });
        }
    }
    //check severity
    handleChangeSeverity(evt){
        if(evt.target.checked){
            this.setState({severity:{...this.state.severity,[evt.target.id]:evt.target.name} });
        }else{
            this.setState({severity:{...this.state.severity,[evt.target.id]:""} });
        } 
    }
     //check priority
     handleChangePriority(evt){
        if(evt.target.checked){
            this.setState({priority:{...this.state.priority,[evt.target.id]:evt.target.name} });
        }else{
            this.setState({priority:{...this.state.priority,[evt.target.id]:""} });
        }      
    }
    //check status
    handleChangeStatus(evt){
        if(evt.target.checked){
            this.setState({status:{...this.state.status,[evt.target.id]:evt.target.name} });
        }else{
            this.setState({status:{...this.state.status,[evt.target.id]:""} });
        }      
    }
    //check assign
    handleChangeAssignTo(evt){
        if(!evt.target.checked){
            let temp = this.state.assignTo
            temp.push(evt.target.name)
            this.setState({assignTo:temp});
        }else{
           if(this.state.assignTo.indexOf(evt.target.name)!=-1){
                let temp = this.state.assignTo
                temp.splice(this.state.assignTo.indexOf(evt.target.name),1);
                this.setState({
                   assignTo:temp
               });
           }
        } 
    }
   
    

    clickDropDown(value){
        this.setState({ statusDrop: { ...this.state.statusDrop, [value]: !this.state.statusDrop[value]}})
    }
   componentDidUpdate(prevProps, prevState) {
       if(this.state!=prevState){
        this.props.Options(this.state.type,this.state.priority,this.state.severity,this.state.status,this.state.assignTo,this.state.subject)
       }
       
   }
    render() {
           return(
            <Container fluid className="p-0">
                <Card>
                    <CardHeader  className="header-list-issue" >
                        < CardTitle tag="h5"> Filters </CardTitle>
                        <SearchBox  handleGetData={this.handleGetData.bind(this)} />
                    </CardHeader>
                    <CardBody>
                        {/* Group type */}
                        <CardHeader>
                            <ListGroup>
                                <ListGroupItem className={this.state.statusDrop.type ? "active" : "inactive hover-color"} onClick={this.clickDropDown.bind(this,"type")}>
                                    <div className="float-right ">
                                        {!this.state.statusDrop.type
                                            ? <ChevronRight className="UpDown" />
                                            : <ChevronDown className="UpDown" />}
                                    </div>
                                    Type
                                </ListGroupItem>
                                {this.state.statusDrop.type ?
                                    <div>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Bug"
                                                id="Bug"
                                                label="Bug"
                                                checked={!ValidInput.isEmpty(this.state.type.Bug)}
                                                onChange ={this.handleChangeType.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Question"
                                                id="Question"
                                                label="Question"
                                                checked={!ValidInput.isEmpty(this.state.type.Question)}
                                                onChange ={this.handleChangeType.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Enhanement"
                                                id="Enhanement"
                                                label="Enhanement"
                                                checked={!ValidInput.isEmpty(this.state.type.Enhanement)}
                                                onChange ={this.handleChangeType.bind(this)}  
                                            />
                                        </ListGroupItem>
                                    </div> : ""
                                }
                            </ListGroup>
                        </CardHeader>
                        {/* Group Severity */}
                        <CardHeader>
                            <ListGroup>
                                <ListGroupItem className={this.state.statusDrop.severity ? "active" : "inactive hover-color" }  onClick={this.clickDropDown.bind(this,"severity")}>
                                    <div className="float-right">
                                        {!this.state.statusDrop.severity
                                            ? <ChevronRight className="UpDown" />
                                            : <ChevronDown className="UpDown"  />}
                                    </div>
                                    Severity
                                </ListGroupItem>
                                {this.state.statusDrop.severity ?
                                    <div>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Wishlist"
                                                id="Wishlist"
                                                label="Wishlist"
                                                checked={!ValidInput.isEmpty(this.state.severity.Wishlist)}
                                                onChange={this.handleChangeSeverity.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Minor"
                                                id="Minor"
                                                label="Minor"
                                                checked={!ValidInput.isEmpty(this.state.severity.Minor)}
                                                onChange={this.handleChangeSeverity.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Normal"
                                                id="Normal"
                                                label="Normal"
                                                checked={!ValidInput.isEmpty(this.state.severity.Normal)}
                                                onChange={this.handleChangeSeverity.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Important"
                                                id="Important"
                                                label="Important"
                                                checked={!ValidInput.isEmpty(this.state.severity.Important)}
                                                onChange={this.handleChangeSeverity.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Ciritical"
                                                id="Ciritical"
                                                label="Ciritical"
                                                checked={!ValidInput.isEmpty(this.state.severity.Ciritical)}
                                                onChange={this.handleChangeSeverity.bind(this)}
                                            />
                                        </ListGroupItem>
                                    </div> :null
                                }
                            </ListGroup>
                        </CardHeader>
                        {/* Group Priorities */}
                        <CardHeader>
                            <ListGroup>
                                <ListGroupItem className={this.state.statusDrop.priorities ? "active" : "inactive hover-color"} onClick={this.clickDropDown.bind(this,"priorities")} >
                                    <div className="float-right">
                                        {!this.state.statusDrop.priorities
                                            ? <ChevronRight className="UpDown"  />
                                            : <ChevronDown className="UpDown"  />}
                                    </div>
                                    Priorities
                                </ListGroupItem>
                                {this.state.statusDrop.priorities ?
                                    <div>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name ="Low"
                                                id="Low"
                                                label="Low"
                                                checked={!ValidInput.isEmpty(this.state.priority.Low)}
                                                onChange={this.handleChangePriority.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name = "Normal"
                                                id="Normal_priority"
                                                label="Normal"
                                                checked={!ValidInput.isEmpty(this.state.priority.Normal_priority)}
                                                onChange={this.handleChangePriority.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                name="Hight"
                                                id="Hight"
                                                label="Hight"
                                                checked={!ValidInput.isEmpty(this.state.priority.Hight)}
                                                onChange={this.handleChangePriority.bind(this)}
                                            />
                                        </ListGroupItem>
                                    </div> : null
                                }
                            </ListGroup>
                        </CardHeader>
                        {/* Group Status */}
                        <CardHeader>
                            <ListGroup>
                                <ListGroupItem className={this.state.statusDrop.status ? "active" : "inactive hover-color"} onClick={this.clickDropDown.bind(this,"status")}>
                                    <div className="float-right">
                                        {!this.state.statusDrop.status
                                            ? <ChevronRight className="UpDown" />
                                            : <ChevronDown className="UpDown" />}
                                    </div>
                                    Status
                                </ListGroupItem>
                                {this.state.statusDrop.status ?
                                    <div>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="New"
                                                name="New"
                                                label="New"
                                                checked={!ValidInput.isEmpty(this.state.status.New)}
                                                onChange ={this.handleChangeStatus.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="InProgress"
                                                name="In progress"
                                                label="In progress" 
                                                checked={!ValidInput.isEmpty(this.state.status.InProgress)}
                                                onChange ={this.handleChangeStatus.bind(this)}    
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="Readyfortest"
                                                name="Ready for test"
                                                label="Ready for test"
                                                checked={!ValidInput.isEmpty(this.state.status.Readyfortest)}
                                                onChange ={this.handleChangeStatus.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="Closed"
                                                name="Closed"
                                                label="Closed"
                                                checked={!ValidInput.isEmpty(this.state.status.Closed)}
                                                onChange ={this.handleChangeStatus.bind(this)}
                                            />
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="Needsinfo"
                                                name="Needs info"
                                                label="Needs info"
                                                checked={!ValidInput.isEmpty(this.state.status.Needsinfo)}
                                                onChange ={this.handleChangeStatus.bind(this)}
                                            />
                                        </ListGroupItem>
                                        
                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="Rejected"
                                                name="Rejected"
                                                label="Rejected"
                                                checked={!ValidInput.isEmpty(this.state.status.Rejected)}
                                                onChange ={this.handleChangeStatus.bind(this)}  
                                            />
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <CustomInput
                                                type="checkbox"
                                                id="Postponed"
                                                name="Postponed"
                                                label="Postponed"
                                                checked={!ValidInput.isEmpty(this.state.status.Postponed)}
                                                onChange ={this.handleChangeStatus.bind(this)}  
                                            />
                                        </ListGroupItem>
                                    </div> : null
                                }
                            </ListGroup>
                        </CardHeader>
                        {/* Group AssignTo */}
                        <CardHeader>
                            <ListGroup>
                                <ListGroupItem className={this.state.statusDrop.assignTo ? "active" : "inactive hover-color"} onClick={this.clickDropDown.bind(this,"assignTo")}>
                                    <div className="float-right">
                                        {!this.state.statusDrop.assignTo
                                            ? <ChevronRight className="UpDown"/>
                                            : <ChevronDown className="UpDown"/>}
                                    </div>
                                    Assign To
                                </ListGroupItem>
                                {this.state.statusDrop.assignTo ?
                                    <div>
                                        <ListGroupItem>
                                                <CustomInput
                                                    type="checkbox"
                                                    id="Not Assign"
                                                    label="Not Assign"
                                                    name = "nullorundefine"
                                                    checked={this.state.assignTo.indexOf("nullorundefine")!= -1?false:true}
                                                    onChange ={this.handleChangeAssignTo.bind(this)}
                                                />
                                            </ListGroupItem>
                                        {this.props.memberProject.map((value,key) => (
                                            <ListGroupItem key ={key}>
                                                <CustomInput
                                                    type="checkbox"
                                                    id={value.full_name}
                                                    label={value.full_name}
                                                    name = {value.full_name}
                                                    checked={this.state.assignTo.indexOf(value.full_name)!= -1?false:true}
                                                    onChange ={this.handleChangeAssignTo.bind(this)}
                                                />
                                            </ListGroupItem>
                                        ))}
                                    </div> : null
                                }
                            </ListGroup>
                        </CardHeader>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default FilterIssue;