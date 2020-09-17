import React from "react";
import {
    Col, Row,
    Container,
    Input
} from "reactstrap";

import KPI from "./KPI/KPI";
import TaskReport from "./Task/Task";
import CashFlow from "./CashFlow/CashFlow";

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "task",
            isLoaded: false,
        };
        this.handleChangeType = this.handleChangeType.bind(this);
    }
    handleChangeType(event) {
        this.setState({
            type: event.target.value
        })
    }

    render() {
        return (
            <Container fluid className="p-0 ">
                <Row>
                    <Col xs="1">
                        <Input type="select" onChange={this.handleChangeType} value={this.state.type}>
                            <option value="kpi">KPI</option>
                            <option value="task">Task</option>
                            <option value="cashFlow">Cash flow</option>
                        </Input>
                    </Col>
                </Row>
                {
                    this.state.type === "kpi"
                        ?
                        <KPI />
                        :
                        this.state.type === "task"
                            ?
                            <TaskReport />
                            :
                            <CashFlow />
                }
            </Container>
        );
    }
}

export default Report;
