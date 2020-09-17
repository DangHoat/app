import React, { Component } from 'react';
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    Table,
    Button,
    UncontrolledDropdown
} from "reactstrap";
import UserList from "./UserList";
import Single from "./Single";

class User extends Component {
    
    render() { 
        return (
           <Row>
                <Col xl="8">
                    <UserList />
                </Col>
                <Col xl="4">
                    < Single HistoryforOneAdmin1={(data)=>this.props.HistoryforOneAdmin(data)} />
                </Col>
                </Row>
        );
    }
}

export default User;