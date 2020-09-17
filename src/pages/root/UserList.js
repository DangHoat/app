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
import listuser from './ListUser.json';
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all: true,
            active: false,
            incative: false,
            lock: false,
            listuserOrigin: listuser,
            listuser: listuser
        }

        this.handleSearch = this.handleSearch.bind(this)
        this.FilterUser = this.FilterUser.bind(this)
        this.ListUser = this.ListUser.bind(this)
    }

    ListUser = (Data) =>
        Data.map((val, key) => {
            return (
                <tr key={key}>
                    <td className="colavatar" >
                        <img
                            src={val.avatar === 'avatar1' ? avatar1 : val.avatar === 'avatar2' ? avatar2 : val.avatar === 'avatar3' ? avatar3 : val.avatar === 'avatar4' ? avatar4 : avatar5}
                            width="32"
                            height="32"
                            className="rounded-circle my-n1"
                            alt="Avatar"
                        />
                    </td>
                    <td className="align">{val.username}</td>
                    <td className="align">{val.position}</td>
                    <td className="align">{val.Email}</td>
                    <td>
                        <Badge className="badgeAlign" color={
                            val.Status === "active" ? 'success' : val.Status === "inactive" ? 'warning' : 'secondary'
                        }>{
                                val.Status === "active" ? 'Active' : val.Status === "inactive" ? 'Inactive' : 'Lock'
                            }</Badge>
                        {this.state.lock === true && <Button onClick={(event)=>{this.getValueUser(val.username)}} size="sm" color="danger">Delete</Button>}
                        {this.state.inactive === true && <Button onClick={(event)=>{this.getValueUser(val.username)}} size="sm" color="secondary">Lock</Button>}
                    </td>
                </tr>
            )
        })
    //end ListUser

    //Get Value User
    getValueUser = (value) => {
        alert(`${value} vừa làm gì đó...`)

    }
    //end Get Value User

    //Filter
    FilterUser = () => {
        if (this.state.all) {
            return this.state.listuser
        }
        else if (this.state.active) {
            return this.state.listuser.filter((user) => (user.Status === 'active'))
        }
        else if (this.state.inactive) {
            return this.state.listuser.filter((user) => (user.Status === 'inactive'))
        }
        else if (this.state.lock) {
            return this.state.listuser.filter((user) => (user.Status === 'lock'))
        }
    }
    //end Filter

    //Search
    handleSearch = (event) => {
        var value = event.target.value
        var name = event.target.name
        let listuserTemp = []
        if (value.length > 0) {
            this.state.listuserOrigin.map((item) => {
                if ((name === 'username' ? item.username : name === 'position' ? item.position : name === 'Email' ? item.Email : item.Status).toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    listuserTemp.push(item)
                }
            })
            this.setState({
                listuser: listuserTemp
            });
        }
        else
            this.setState({
                listuser: this.state.listuserOrigin
            })
    }
    //end Search

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className="card-actions float-right">
                        <Button onClick={() => this.setState({ all: true, active: false, inactive: false, lock: false })} color="primary">All</Button>{' '}
                        <Button onClick={() => this.setState({ all: false, active: true, inactive: false, lock: false })} color="success">Active</Button>{' '}
                        <Button onClick={() => this.setState({ all: false, active: false, inactive: true, lock: false })} color="warning">Inactive</Button>{' '}
                        <Button onClick={() => this.setState({ all: false, active: false, inactive: false, lock: true })} color="secondary">Lock</Button>{' '}
                    </div>
                    <CardTitle className="mb-0">
                        <h1 className="h3 mb-0"><Badge color="primary">List User</Badge></h1>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th className="colavatar">#</th>
                                <th className="align">Name
                                    <Col lg="12" className="mb-0">
                                        <Input name="username" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                                <th className="align">Position
                                    <Col lg="12" className="mb-0">
                                        <Input name="position" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                                <th className="align">Email
                                    <Col lg="12" className="mb-0">
                                        <Input name="Email" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                                <th className="align">Status({this.FilterUser().length})
                                    <Col lg="12" className="mb-0">
                                        <Input name="Status" onChange={(event) => { this.handleSearch(event) }} placeholder="Search for..." />
                                    </Col>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                             {this.ListUser(this.FilterUser())}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

        );
    }
}

export default UserList;