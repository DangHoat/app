import React from "react";
import {
    Col, Row
} from "reactstrap";
import Notification from "../../../components/Notification";
import ReactTooltip from "react-tooltip";
import EvaluationList from "./KPIList";
import EvaluationChart from "./KPIChart";
import moment from 'moment';
import { LoadingSprinner } from "../../../components/CustomTag";
//css
import "./KPI.css";
//api
const api = require("./../api/api");

class KPI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderAPI: false,
            dataListMembers: [],
            infoMember: null,
            summaryData: null,
            start_date: new Date(moment().startOf('year').format('L')),
            end_date: new Date(moment().endOf('year').format('L'))
        };

        this.handleSetDueDateKPI = this.handleSetDueDateKPI.bind(this);
        this.handleGetInfoMemberKPI = this.handleGetInfoMemberKPI.bind(this);
    }

    handleSetDueDateKPI(from, to) {
        this.setState({ start_date: from, end_date: to });

        api.filterWorksKPI(from, to, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                const that = this;
                api.getChartKPI(from, to, result[0], (err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                    } else {
                        that.setState({
                            summaryData: result
                        });
                    }
                })
                that.setState({
                    dataListMembers: result,
                    infoMember: result[0],
                    isLoaderAPI: true
                });
            }
        })

    }

    handleGetInfoMemberKPI(info) {
        const that = this;
        api.getChartKPI(this.state.start_date, this.state.end_date, info, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({
                    summaryData: result
                });
            }
        })
        this.setState({
            infoMember: info
        });
    }

    componentDidMount() {
        const that = this;
        if (this.state.isLoaderAPI === false) {
            api.getWorksKPI((err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                } else {
                    that.setState({ dataListMembers: result, infoMember: result[0] });
                    api.getChartKPI(new Date(moment().startOf('year').format('L')), new Date(moment().endOf('year').format('L')), result[0], (err, result) => {
                        if (err) {
                            Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                        } else {
                            that.setState({
                                summaryData: result,
                                isLoaderAPI: true
                            });
                        }
                    })
                }
            })
        }
    }

    render() {
        return (
            !this.state.isLoaderAPI ? <LoadingSprinner /> :
                <React.Fragment>
                    <Row className="mt-3">
                        <Col xs="6">
                            <EvaluationList
                                dataListMembers={this.state.dataListMembers}
                                handleSetDueDateKPI={this.handleSetDueDateKPI}
                                handleGetInfoMemberKPI={this.handleGetInfoMemberKPI}
                            />
                        </Col>
                        <Col xs="6">
                            <EvaluationChart
                                infoMember={this.state.infoMember}
                                summaryData={this.state.summaryData}
                                start_date={this.state.start_date}
                                end_date={this.state.end_date}
                            />
                        </Col>
                    </Row>
                    <ReactTooltip />
                </React.Fragment>
        );
    }
}
export default KPI;