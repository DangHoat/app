import React, { Component } from 'react';
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Table,
    Button,
    Input

} from "reactstrap";
import './root.css';
import avatar1 from "../../assets/img/avatars/avatar.jpg";
import avatar2 from "../../assets/img/avatars/avatar-2.jpg";
import avatar3 from "../../assets/img/avatars/avatar-3.jpg";
import avatar4 from "../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../assets/img/avatars/avatar-5.jpg";
import listadmin from './ListAdmin.json';
class AdminList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listadminOrigin: listadmin,
            listadmin: listadmin
        }
        this.handleSearch = this.handleSearch.bind(this)
  
    }

    //Search
    handleSearch = (event) => {
        var value = event.target.value
        var name = event.target.name
        let listadminTemp = []
        if (value.length > 0) {
            this.state.listadminOrigin.map((item) => {
                if ((name === 'username' ? item.username : name === 'role' ? item.role : name === 'email' ? item.email : item.Status).toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    listadminTemp.push(item)
                }
            })
            this.setState({
                listadmin: listadminTemp
            });
        }
        else
            this.setState({
                listadmin: this.state.listadminOrigin
            })
    }
    //end Search

    

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle  className="mb-0">
                    <h1 className="h3 mb-0"><Badge color="primary">List Admin</Badge></h1>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th className="colavatar">#</th>
                                <th className="align">Name
                                    <Col lg="12" className="mb-0">
                                        <Input  name="username" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                                <th className="align">Role
                                <Col lg="12" className="mb-0">
                                        <Input  name="role" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                                <th className="align">Email
                                <Col lg="12" className="mb-0">
                                        <Input  name="email" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                                <th onClick={()=>{this.props.OpenHistoryAdmin1()}} className="align"><Button className="btnhistoryall" color="success">History All</Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listadmin.map((val, key) => {
                                    var avatar = val.avatar==="avatar1"?avatar1:val.avatar==="avatar2"?avatar2:val.avatar==="avatar3"?avatar3:val.avatar==="avatar4"?avatar4:avatar5 
                                    return (
                                    <tr key={key}>
                                        <td className="colavatar" >
                                            <img
                                                src={avatar}
                                                width="32"
                                                height="32"
                                                className="rounded-circle my-n1"
                                                alt="Avatar"
                                            />
                                        </td>
                                        <td  className="texttable clickAdmin" onClick={()=>this.props.openAdmin(val)}>{val.username}</td>
                                        <td  className="texttable">{val.role}</td>
                                        <td  className="texttable">{val.email}</td>
                                        <td> <Button  className="btnhistory"  color="primary" onClick={(data)=>this.props.HistoryforOneAdmin1(val.username)}>History</Button></td>
                                    </tr>)
                                })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

        );
    }
}

export default AdminList;