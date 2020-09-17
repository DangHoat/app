import React from "react";
import { connect } from "react-redux";
import WorkKanban from "./work-kanban/WorkKanban";
import WorkTable from "./work-table/WorkTable";
import WorkDetail from "./work-detail/WorkDetail";
import Notification from "../../components/Notification";
import {
    Container,
    Row,
    Col,
    Input
} from "reactstrap"
import { LoadingSprinner } from "../../components/CustomTag";

const api = require("./api/api");
class Works extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "table",
            isLoaded: false,
            project: {}
        };
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    handleChangeType(event) {
        this.setState({
            type: event.target.value
        })
    }

    componentDidMount() {
        api.getInfoProject((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                this.setState({ project: result, isLoaded: true });
            }
        });
    }

    render() {
        const { project } = this.state;
        const request = window.location.search
            .slice(1)
            .split('&')
            .map(p => p.split('='))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        return (
            request.id === undefined ?
                !this.state.isLoaded ? null :
                    <Container className="col-lg-12">
                        <Row className="mb-3">
                            <Col className="col-1 offset-11">
                                <Input type="select" onChange={this.handleChangeType} value={this.state.type}>
                                    <option value="table">Table</option>
                                    <option value="kanban">Kanban</option>
                                </Input>
                            </Col>
                        </Row>
                        {
                            this.state.type === "table"
                                ?
                                <WorkTable
                                    key="work-table"
                                    handleLoading={this.props.handleLoading}
                                    project={project}
                                />
                                :
                                <WorkKanban
                                    key="work-kanban"
                                    handleLoading={this.props.handleLoading}
                                    project={project}
                                />
                        }
                    </Container>
                :
                <WorkDetail />
        )
    }
}

export default Works;