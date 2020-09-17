import React, { Component } from 'react';
import './root.css';
import {
    Col,
    Row,
} from "reactstrap";
import Single from "./Single";
import AdminList from './AdminList';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state={
            openAdminInfo:false,
            adminName: null,
            adminRole: null
        }
        this.OpenAdmin = this.OpenAdmin.bind(this)
        this.CloseAdmin = this.CloseAdmin.bind(this)
    }
    //Open Admin Info
    OpenAdmin = (adminInfo) => {
        this.setState({
            openAdminInfo: true,
            adminName: adminInfo.username,
            adminRole: adminInfo.role,
            adminEmail: adminInfo.email,
            adminPhone: adminInfo.phone
        });
    }
    CloseAdmin = () => {
        this.setState({
            openAdminInfo: false,
        });
    }
    render() { 
        return (
            <Row>
                <Col xl>
                    <AdminList openAdmin={(val)=>this.OpenAdmin(val)} OpenHistoryAdmin1={()=>{this.props.OpenHistoryAdmin()}} HistoryforOneAdmin1={(data)=>this.props.HistoryforOneAdmin(data)} />
                </Col>
                {this.state.openAdminInfo && (
                <Col xl="4">
                    < Single adminname={this.state.adminName} adminrole={this.state.adminRole} adminemail={this.state.adminEmail} adminphone={this.state.adminPhone} closeAdmin={() => this.CloseAdmin()} HistoryforOneAdmin1={(data)=>this.props.HistoryforOneAdmin(data)} />
                </Col>
                )}
            </Row>
        );
    }
}

export default Admin;