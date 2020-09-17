import React, { Component } from 'react';
import './root.css';
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

import Menu from "./Menu";
import User from "./User";
import Admin from './Admin';
import History from './History';
class Root extends Component {
  constructor(props) {
    super(props);
    this.state={
      isOpenAdmin:false,
      isOpenUser:true,
      HistoryAdmin:null,
      history:false
    }
    this.ChooseAdmin = this.ChooseAdmin.bind(this)
    this.ChooseUser = this.ChooseUser.bind(this)
    this.HistoryforOneAdmin = this.HistoryforOneAdmin.bind(this)
    this.OpenHistoryAdmin = this.OpenHistoryAdmin.bind(this)
  }

  ChooseAdmin=()=>{
    this.setState({
      isOpenAdmin:true,
      isOpenUser:false,
      history:false
    })
  }
  ChooseUser=()=>{
    this.setState({
      isOpenAdmin:false,
      isOpenUser:true,
      history:false
    })
  }
  HistoryforOneAdmin=(data)=>{
   this.setState({
     HistoryAdmin:data,
     isOpenAdmin:false,
     isOpenUser:false,
     history:true
   })
  }
  OpenHistoryAdmin=()=>{
    this.setState({
      isOpenAdmin:false,
      isOpenUser:false,
      history:true,
      HistoryAdmin:null
    })
   }
  
  render() {
    return (
      <Container fluid className="p-0">
        <Col xl="12"className="linehight">
          <Menu isOpenAdmin={()=>{this.ChooseAdmin()}}  isOpenUser={()=>{this.ChooseUser()}}/>
        </Col>
        {this.state.isOpenAdmin&&<Admin  OpenHistoryAdmin={()=>{this.OpenHistoryAdmin()}} HistoryforOneAdmin={(data)=>{this.HistoryforOneAdmin(data)}} />}
        {this.state.isOpenUser&&<User HistoryforOneAdmin={(data)=>{this.HistoryforOneAdmin(data)}} />}
        {this.state.history&&<History isAdmin={this.state.HistoryAdmin}/>}
    </Container>
    );
  }
}



export default Root;
