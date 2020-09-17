import React from 'react';
import {
    Col, Row
} from "reactstrap";
import ReactTooltip from "react-tooltip";
import Notification from "../../../components/Notification";
import moment from 'moment';
import TaskList from "./TaskList";
import TaskChart from "./TaskChart";
import { LoadingSprinner } from "../../../components/CustomTag";
//api
const api = require("../api/api");
const ValidInput = require("../../../utils/ValidInput");
const utils = require("../../../utils/utils");

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderAPI: false,
            taskListData: [],
            taskChartData: [],
            total_budget: null,
            total_tasks: null,
            seriesIndex: NaN,
            dataPointIndex: NaN,
            start_date: new Date(moment().startOf('year').format('L')),
            end_date: new Date(moment().endOf('year').format('L'))
        };
        this.handleSearchStatus = this.handleSearchStatus.bind(this);
        this.handleSetDueDateTask = this.handleSetDueDateTask.bind(this);
    }

    handleSearchStatus(seriesIndex, dataPointIndex) {
        if (seriesIndex === this.state.seriesIndex) {
            this.setState({
                seriesIndex: NaN,
            })
        }
        else if (dataPointIndex === this.state.dataPointIndex) {
            this.setState({
                dataPointIndex: NaN
            })
        }
        else {
            this.setState({
                seriesIndex: seriesIndex,
                dataPointIndex: dataPointIndex
            })
        }

    }

    handleSetDueDateTask(from, to) {
        this.setState({ start_date: from, end_date: to });
        const that = this;
        api.filterTask(from, to, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({
                    isLoaderAPI: true,
                    taskListData: result.tasks,
                    taskChartData: result.graph,
                    totalBudget: result.total_budget,
                    totalTasks: result.total_tasks
                });
            }
        })

    }

    componentDidMount() {
        const that = this;
        if (this.state.isLoaderAPI === false) {
            api.getTaskReport((err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                } else {
                    that.setState({
                        isLoaderAPI: true,
                        taskListData: result.tasks,
                        taskChartData: result.graph,
                        totalBudget: result.total_budget,
                        totalTasks: result.total_tasks
                    });
                }
            })
        }
    }

    render() {
        return (
            !this.state.isLoaderAPI ? <LoadingSprinner /> :
                <React.Fragment>
                    <Row className="mt-3">
                        <Col xs="7">
                            <TaskList
                                taskListData={this.state.taskListData}
                                seriesIndex={this.state.seriesIndex}
                                dataPointIndex={this.state.dataPointIndex}
                                handleSetDueDateTask={this.handleSetDueDateTask}
                            />
                        </Col>
                        <Col xs="5">
                            <TaskChart
                                taskChartData={this.state.taskChartData}
                                totalBudget={this.state.totalBudget}
                                totalTasks={this.state.totalTasks}
                                handleSearchStatus={this.handleSearchStatus}
                                start_date={this.state.start_date}
                                end_date={this.state.end_date}
                            />
                        </Col>
                    </Row>
                    <ReactTooltip />
                </React.Fragment>
        )
    }

}
export default Task;



