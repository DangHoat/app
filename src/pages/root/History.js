import React, { Component } from 'react';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Container,
    Media,
    Row,
} from "reactstrap";

import avatar1 from "../../assets/img/avatars/avatar.jpg";
import avatar2 from "../../assets/img/avatars/avatar-2.jpg";
import avatar3 from "../../assets/img/avatars/avatar-3.jpg";
import avatar4 from "../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../assets/img/avatars/avatar-5.jpg";

import HistoryList from './History.json';

class History extends Component {
    render() {
        console.log(this.props.isAdmin)
        return (
            <Container fluid className="p-4">
                <h1 className="h3 mb-3">History</h1>

                <Row>

                    <Col md xl>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h5" className="mb-0">
                                    Activities
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {
                                    HistoryList.map((val, key) => {
                                        if (this.props.isAdmin === null) {
                                            var date = new Date(val.Time).toString();
                                            var date = date.replace('GMT+0700 (Giờ Đông Dương)', ' ');
                                            return (
                                                <div key={key}>
                                                    <Media>
                                                        <img
                                                            src={val.avatar === 'avatar1' ? avatar1 : val.avatar === 'avatar2' ? avatar2 : val.avatar === 'avatar3' ? avatar3 : val.avatar === 'avatar4' ? avatar4 : avatar5}
                                                            width="36"
                                                            height="36"
                                                            className="rounded-circle mr-2"
                                                            alt="Ashley Briggs"
                                                        />
                                                        <Media body>
                                                            <small className="float-right text-navy">{date}</small>
                                                            <strong>{val.username + " : "}</strong> {val.Activities}{" "}
                                                            <br />
                                                            <small className="text-muted">{date}</small>
                                                            <br />
                                                        </Media>

                                                    </Media>
                                                    <hr />
                                                </div>
                                            )
                                        }
                                        else {
                                            if (val.username === this.props.isAdmin) {
                                                var date = new Date(val.Time).toString();
                                                var date = date.replace('GMT+0700 (Giờ Đông Dương)', ' ');
                                                return (
                                                    <div key={key}>
                                                        <Media>
                                                            <img
                                                                src={val.avatar === 'avatar1' ? avatar1 : val.avatar === 'avatar2' ? avatar2 : val.avatar === 'avatar3' ? avatar3 : val.avatar === 'avatar4' ? avatar4 : avatar5}
                                                                width="36"
                                                                height="36"
                                                                className="rounded-circle mr-2"
                                                                alt="Ashley Briggs"
                                                            />
                                                            <Media body>
                                                                <small className="float-right text-navy">{date}</small>
                                                                <strong>{val.username + " : "}</strong> {val.Activities}{" "}
                                                                <br />
                                                                <small className="text-muted">{date}</small>
                                                                <br />
                                                            </Media>

                                                        </Media>
                                                        <hr />
                                                    </div>
                                                )
                                            }
                                        }

                                    })}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default History;
