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
  UncontrolledDropdown,
  Button
} from "reactstrap";
import Timeline from "../../components/Timeline";
import TimelineItem from "../../components/TimelineItem";

import avatar1 from "../../assets/img/avatars/avatar.jpg";
import avatar2 from "../../assets/img/avatars/avatar-2.jpg";
import avatar3 from "../../assets/img/avatars/avatar-3.jpg";
import avatar4 from "../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../assets/img/avatars/avatar-5.jpg";
import { MoreHorizontal, XSquare } from "react-feather";
import HistoryList from './History.json';

class Single extends Component {
  render() {
    return (

      <Card>
        <CardHeader>
          <div className="card-actions float-right">
            {this.props.adminname!==undefined && <XSquare onClick={this.props.closeAdmin} className="clickAdmin" color="red" />}
          </div>
          <CardTitle tag="h5" className="mb-0">
            {this.props.adminname || 'Nguyễn Quốc Uy'}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row noGutters>
            <Col sm="3" xl="12" className="col-xxl-3 text-center">
              <img
                src={avatar3}
                width="64"
                height="64"
                className="rounded-circle mt-2"
                alt="Angelica Ramos"
              />
            </Col>
            <Col sm="9" xl="12" className="col-xxl-9">
              <strong>About me</strong>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Col>
          </Row>

          <Table size="sm" className="my-2">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{this.props.adminname || 'Nguyễn Quốc Uy'}</td>
              </tr>
              <tr>
                <th>Company</th>
                <td>Tinasoft Việt Nam</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{this.props.adminemail || 'uynq@gmail.com'}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{this.props.adminphone || '+84987654321'}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>
                  {this.props.adminname===undefined && <span className="badge badge-success">Super Admin</span>}
                  {this.props.adminrole==='Super Admin'
                    ? <span className="badge badge-success">{this.props.adminrole}</span>
                    : <span className="badge badge-primary">{this.props.adminrole}</span>
                  }
                </td>
              </tr>
            </tbody>
          </Table>

          <hr />

          <strong>Your History</strong>

          <Timeline className="mt-2">
            {this.props.adminname===undefined
            ?
              HistoryList.map((val, key) => {
                var date = new Date(val.Time).toString();
                var date = date.replace('GMT+0700 (Giờ Đông Dương)', ' ');
                if(val.username==="Nguyễn Quốc Uy"){
                return (
                  <div key={key}>
                    <TimelineItem>
                      <strong>Activities</strong>
                      <span className="float-right text-muted text-sm">{date}</span>
                      <p><strong>{val.username+" : "}</strong>{val.Activities}</p>
                    </TimelineItem>
                  </div>
                )
              }})
            :
              HistoryList.map((val, key) => {
                var date = new Date(val.Time).toString();
                var date = date.replace('GMT+0700 (Giờ Đông Dương)', ' ');
                if(val.username===this.props.adminname){
                return (
                  <div key={key}>
                    <TimelineItem>
                      <strong>Activities</strong>
                      <span className="float-right text-muted text-sm">{date}</span>
                      <p><strong>{val.username+" : "}</strong>{val.Activities}</p>
                    </TimelineItem>
                  </div>
                )
              }})}
          </Timeline>
          <Button className="btnXemThem" outline color="primary" onClick={(data)=>this.props.HistoryforOneAdmin1(this.props.adminname || "Nguyễn Quốc Uy")}>See More</Button>
        </CardBody>
      </Card>

    );
  }
}

export default Single;