import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";
import {
    Card, CardBody, CardHeader, CardTitle,
    Input, Table,
    DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import CardSubtitle from "reactstrap/es/CardSubtitle";

import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
//css
import "../KPI/KPI.css";

class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.state = {
            from: new Date(moment().startOf('year').format('L')),
            to: new Date(moment().endOf('year').format('L')),
        };
    }
    handleFilter() {
        const { from, to } = this.state;
        if (!from) {
            return;
        }
        else {
            this.props.handleSetDueDateTask(from, to);
        }
    }

    handleFromChange(from) {
        this.setState({ from });
    }

    handleToChange(to) {
        this.setState({ to }, this.handleFilter);
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <div className="InputFromTo" >
                <UncontrolledDropdown >
                    <DropdownToggle caret color="light">
                        Phase: {moment(from).format('DD/MM/YYYY')} - {moment(to).format('DD/MM/YYYY')} {' '}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>
                            Start time: {' '}
                            <DayPickerInput
                                inputProps={{ style: { width: 100 } }}
                                value={from}
                                placeholder="From"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                dayPickerProps={{
                                    selectedDays: [from, { from, to }],
                                    disabledDays: { after: to },
                                    toMonth: to,
                                    modifiers,
                                    numberOfMonths: 1,
                                    onDayClick: () => this.to.getInput().focus(),
                                }}
                                onDayChange={this.handleFromChange}
                            />
                        </DropdownItem>
                        <DropdownItem header>
                            End Time: {' '}
                            <DayPickerInput
                                ref={el => (this.to = el)}
                                inputProps={{ style: { width: 100 } }}
                                value={to}
                                placeholder="To"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                dayPickerProps={{
                                    selectedDays: [from, { from, to }],
                                    disabledDays: { before: from },
                                    modifiers,
                                    month: from,
                                    fromMonth: from,
                                    numberOfMonths: 1,
                                }}
                                onDayChange={this.handleToChange}
                            />
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        );
    }
}

class TaskListDetail extends React.Component {
    render() {
        let { task } = this.props;
        return (
            <tr>
                <td className="text-center">
                    <Link to={`/project/work/task?id=${task.id}`} className="text-decoration-none ">
                        {task.task}
                    </Link>
                </td>
                <td className="text-center" >{task.start}</td>
                <td className="text-center" >{task.start}</td>
                <td className="text-center">{task.finish}</td>
                <td className="text-center" >{task.status}</td>
                <td className="text-center" >{task.budget}</td>
            </tr>
        );
    }
}

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyWord: "",
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);

    };
    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }
    changeSearchChars(chars) {
        console.log(chars);

        let state = Object.assign({}, this.state);
        state.keyWord = chars;
        this.setState(state);
    }

    printListTask() {
        var total = document.getElementById("total_task").innerHTML;
        var list_task = document.getElementById("list_task").innerHTML;
        var phase = document.getElementById("Phaselist_task").innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');
        mywindow.document.write('<html><head><title>Báo cáo công việc</title><style>img{width: 50px; height: 50px;}</style>');
        mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
        mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        mywindow.document.write('</head><body>');
        mywindow.document.write('<h1 class="text-center">Task Report</h1>');
        mywindow.document.write('<p class="float-right">' + phase + '</p>');
        mywindow.document.write(total);
        mywindow.document.write('</br>');
        mywindow.document.write(list_task);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        setTimeout(function () { mywindow.focus(); mywindow.print(); }, 1000);
        return true;
    }

    render() {
        let height_screen = window.screen.height * 0.6;
        const { taskListData, seriesIndex, dataPointIndex } = this.props;
        let Status = { "New": 0, "Ready": 1, "In Progress": 2, "Ready for test": 3, "Done": 4, "Archived": 5 }
        return (
            <Card >
                <CardHeader >
                    <div className="float-right mt-2">
                        <Input id="inputSearch" placeholder="Search" onKeyUp={this.handleSearch.bind(this)} />
                    </div>
                    <div className="float-right mr-3">
                        <UncontrolledDropdown >
                            <DropdownToggle nav>
                                <FontAwesomeIcon icon={faDownload} size="2x" color="grey" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.printListTask}>
                                    PDF
                                    </DropdownItem>
                                <DropdownItem >
                                    {/* <CSVLink data={} filename={"KPI_list_members.csv"}>Excel</CSVLink> */}
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                    <CardTitle className="m-2">Evaluation</CardTitle>
                    <CardSubtitle id="Phaselist_task">
                        <DateTimePicker handleSetDueDateTask={this.props.handleSetDueDateTask} />
                    </CardSubtitle>
                </CardHeader>
                <CardBody style={{ overflowX: 'auto', height: height_screen }} id="list_task">
                    <Table responsive hover >
                        <thead >
                            <tr className="text-center">
                                <th>Name</th>
                                <th>Time</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Status</th>
                                <th>Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                taskListData.map((task, index) => {
                                    if (task.task.toLowerCase().indexOf(this.state.keyWord) !== -1) {
                                        return (
                                            isNaN(seriesIndex) && isNaN(dataPointIndex) ?
                                                <TaskListDetail
                                                    task={task}
                                                    key={index}
                                                />
                                                :
                                                Status[task.status] === seriesIndex || Status[task.status] === dataPointIndex ?
                                                    <TaskListDetail
                                                        task={task}
                                                        key={index}
                                                    />
                                                    :
                                                    null
                                        );

                                    }
                                })
                            }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        );
    }
}
export default TaskList;