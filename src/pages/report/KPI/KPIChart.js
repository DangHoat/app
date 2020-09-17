import React from "react";
import {
    Card, CardBody, CardHeader, CardFooter,
    Col, Row,
    Table,
    DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown,
} from "reactstrap";
import { CustomImg } from "../../../components/CustomTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import CardSubtitle from "reactstrap/es/CardSubtitle";
import { CSVLink } from 'react-csv';
import moment from 'moment';

import ApexCharts from "react-apexcharts";
const utils = require("../../../utils/utils");

class ChartReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            data: [],
            socket: true,
            type: "realtime",
        };
        this.handleChangeType = this.handleChangeType.bind(this);
        this.options = {
            stroke: {
                curve: 'smooth',
                size: 3
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            chart: {
                stacked: false,
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            yaxis: {
                decimalsInFloat: -1,
                title: {
                    text: 'Work',
                    style: {
                        color: undefined,
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },

            },
            xaxis: {
                type: "datetime",
                show: true,
                labels: {
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MM/y',
                        day: 'dd/MM',
                        hour: 'HH:mm'
                    }
                },
            },
            title: {
                text: 'Evaluation Chart',
                align: 'left',
                style: {
                    color: undefined,
                    fontSize: '16px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    cssClass: 'apexcharts-yaxis-label',
                },
                offsetX: 25,
            },

            colors: ["#0cc2aa", "#f44455"],
            legend: {
                position: 'top',
                horizontalAlign: 'center',
                floating: true,
                offsetY: -32,
            },

        };
    }

    componentDidMount() {
        // Trigger resize manually so chart doesn't fall off canvas
        window.dispatchEvent(new Event("resize"));
    }
    handleChangeType(event) {
        this.setState({
            type: event.target.value
        })
        if (event.target.value === "report") {
            this.props.handleChangeSocket(false);
        }
        else {
            this.props.handleChangeSocket(true);
        }
    }
    render() {
        const { graph } = this.props.summaryData;
        console.log(graph);

        const finished = graph.map(({ date, finished }, key) => {
            let x = date;
            let y = finished;
            return { x, y }
        })
        const unfinished = graph.map(({ date, unfinished }, key) => {
            let x = date;
            let y = unfinished;
            return { x, y }
        })


        return (
            <Card className="flex-fill">
                <CardBody>
                    <ApexCharts
                        options={this.options}

                        series={
                            [
                                {
                                    name: "Finished",
                                    data: finished
                                },
                                {
                                    name: "Unfinished",
                                    data: unfinished
                                }
                            ]
                        }
                        type="line"

                    />
                </CardBody>
            </Card >
        );
    }
}

class SummaryReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { summaryData } = this.props;

        return (
            <React.Fragment>
                <h1 className="text-center">Summary Report</h1>
                <div id="summary">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Task</th>
                                <th>Start</th>
                                <th>Finish</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                summaryData.tasks.map(({ task, start, finish, due_date, status }, index) => {
                                    return (
                                        <tr key={index} >
                                            <td>{index + 1}</td>
                                            <td>{task}</td>
                                            <td>{start}</td>
                                            <td>{finish}</td>
                                            <td>{due_date}</td>
                                            <td>{status}</td>
                                        </tr>
                                    );
                                })

                            }

                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

class EvaluationChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoMember: this.props.infoMember,

        };
    };



    printKPI() {
        var img = document.getElementById("img").innerHTML;
        var phase = document.getElementById("phase").innerHTML;
        var sumary = document.getElementById("summary").innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');
        mywindow.document.write('<html><head><title>Báo cáo công việc</title><style>img{width: 50px; height: 50px;}</style>');
        mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
        mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        mywindow.document.write('</head><body>');
        mywindow.document.write('<div class="card mt-5"><div class="card-header"><div class="row">');
        mywindow.document.write('<div class="col-md-1">' + img + '</div>');
        mywindow.document.write('<div class="col-md-5">' + phase + '</div>');
        mywindow.document.write('</div></div>');
        mywindow.document.write('<div class="card-header">' + sumary + '</div>');
        mywindow.document.write('</div>');
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        setTimeout(function () { mywindow.focus(); mywindow.print(); }, 1000);
        return true;
    }

    render() {
        const { infoMember, start_date, end_date, summaryData } = this.props;
        console.log(summaryData);

        return (
            <Card >
                <CardHeader>
                    <React.Fragment>
                        <Row>
                            <Col xs="1.5" id="img" >
                                <CustomImg
                                    key={utils.randomString()}
                                    src={infoMember.photo}
                                    alt="avatar"
                                    className="rounded-circle img--user--square-4x ml-2"
                                />
                            </Col>
                            <Col id="phase" className="m-1 ">
                                <h3 id="name_chart" className="text-muted mt-1 ">{infoMember.full_name}</h3>
                                <CardSubtitle>Phase:
                                {' ' + moment(this.props.start_date).format('DD/MM/YYYY')} - {moment(this.props.end_date).format('DD/MM/YYYY')}
                                </CardSubtitle>
                            </Col>
                            <Col xs="1.5">
                                <UncontrolledDropdown >
                                    <DropdownToggle nav>
                                        <FontAwesomeIcon icon={faDownload} size="2x" color="grey" />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.printKPI}>
                                            PDF
                                        </DropdownItem>
                                        <DropdownItem >
                                            <CSVLink data={summaryData.tasks} filename={"KPI_tasks_members.csv"}>Excel</CSVLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Col>
                        </Row>
                    </React.Fragment>
                </CardHeader>
                <CardBody  >
                    <ChartReport summaryData={summaryData} />
                </CardBody>
                <CardFooter >
                    <SummaryReport summaryData={summaryData} start_date={start_date} end_date={end_date} />
                </CardFooter>
            </Card>
        );
    }
}

export default EvaluationChart;