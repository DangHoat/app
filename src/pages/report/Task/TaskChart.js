import React, { PureComponent } from 'react';
import {
    Card, CardBody, CardHeader, CardTitle, CardFooter,
    Col, Row,
    Input, Table,
    Button, Label,
    DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown

} from "reactstrap";
import { CSVLink } from 'react-csv';

import Notification from "../../../components/Notification"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import CardSubtitle from "reactstrap/es/CardSubtitle";
import ReactTooltip from "react-tooltip";
import { CustomImg, LoadingSprinner } from "../../../components/CustomTag";
import { ChevronsUp, ChevronDown, PlusCircle, MoreHorizontal, Plus, ChevronRight } from 'react-feather'
//img 
import empty_avatar from "../../../assets/img/avatars/empty_avatar.png"
import ApexCharts from "react-apexcharts";
//date time
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';


//api
const api = require("../api/api");
const ValidInput = require("../../../utils/ValidInput");
const utils = require("../../../utils/utils");
class TaskChart extends React.Component {
    constructor(props) {
        super(props);
        const { New, Ready, In_progress, Ready_for_test, Done, Archived } = this.props.taskChartData;
        this.state = {
            options: {
                chart: {
                    width: 200,
                    events: {
                        click: function (event, chartContext, config) {
                            var el = event.target;
                            var seriesIndex = parseInt(el.getAttribute("i"));
                            var dataPointIndex = parseInt(el.getAttribute("j"));
                            props.handleSearchStatus(seriesIndex, dataPointIndex);
                        }
                    },
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 500,
                        animateGradually: {
                            enabled: true,
                            delay: 200
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 500
                        }
                    },
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            customIcons: []
                        },
                        autoSelected: 'zoom'
                    },
                    type: "donut",
                },
                plotOptions: {
                    pie: {
                        size: undefined,
                        customScale: 1,
                        offsetX: 0,
                        offsetY: 0,
                        expandOnClick: true,
                        dataLabels: {
                            offset: 0,
                        },
                        donut: {
                            size: '60%',
                            background: 'transparent',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: '25px',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    offsetY: -10
                                },
                                value: {
                                    show: true,
                                    fontSize: '30px',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    offsetY: 16,
                                    formatter: function (val) {
                                        return val
                                    }
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    color: 'red',
                                    formatter: function (w) {
                                        return w.globals.seriesTotals.reduce((a, b) => {
                                            return a + b
                                        }, 0)
                                    }
                                }
                            }
                        },
                    },
                    legend: {
                        show: true,
                        offsetY: -20,
                    },

                },
                labels: ["New", "Ready", "In Progress", "Ready for test", "Done", "Archived"],
                colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800', '#66DA26'],
            },
            series: [New, Ready, In_progress, Ready_for_test, Done, Archived],
        }
    }

    render() {
        const { Done, Archived } = this.props.taskChartData;
        let performance = ((Done + Archived) * 100 / this.props.totalTasks).toFixed(2)
        return (
            <Card >
                <CardHeader >
                    <CardTitle className="d-inline mt-2">Tasks Report</CardTitle>
                    <CardSubtitle className="float-right d-inline mt-1 mb-2">Phase:
                                {' ' + moment(this.props.start_date).format('DD/MM/YYYY')} - {moment(this.props.end_date).format('DD/MM/YYYY')}
                    </CardSubtitle>
                </CardHeader>
                <CardBody >
                    <div id="total_task">
                        <Table responsive hover bordered >
                            <thead >
                                <tr className="text-center">
                                    <th>Total tasks</th>
                                    <th>Performance</th>
                                    <th>Total budget</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center" >{this.props.totalTasks}</td>
                                    <td className="text-center">{performance} %</td>
                                    <td className="text-center" >{this.props.totalBudget}</td>
                                </tr >
                            </tbody>
                        </Table>
                    </div>
                    <h3 className="text-center">Evaluation Chart</h3>
                    <ApexCharts options={this.state.options} series={this.state.series} type="donut" />
                </CardBody>
            </Card>

        );
    }
}
export default TaskChart;