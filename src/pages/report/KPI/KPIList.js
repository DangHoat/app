import React from "react";
import moment from 'moment';
import {
    Card, CardBody, CardHeader, CardTitle,
    Input, Table,
    DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown
} from "reactstrap";
import { CSVLink } from 'react-csv';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import CardSubtitle from "reactstrap/es/CardSubtitle";
import { CustomImg } from "../../../components/CustomTag";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
const utils = require("../../../utils/utils");

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
            this.props.handleSetDueDateKPI(from, to);
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

class MemberList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        let click = e.target.getAttribute('data-click');
        if (click !== null)
            this.props.handleGetInfoMember(JSON.parse(click))
    }

    render() {
        let { dataListMember } = this.props;
        let efficiency = (dataListMember.done / dataListMember.total) * 100;
        const linkUser = dataListMember.id !== utils.getUserId() ? `/profile?email=${dataListMember.email}` : `/profile`;
        return (
            <tr onClick={this.handleClick}>
                <td>
                    <Link to={linkUser} className="text-decoration-none">
                        <CustomImg
                            key={utils.randomString()}
                            src={dataListMember.photo}
                            alt="avatar"
                            className="rounded-circle img--user--square-2x mr-2"
                        />
                        {dataListMember.full_name}
                    </Link>
                </td>
                <td className="text-center" data-click={JSON.stringify(dataListMember)}>{dataListMember.total}</td>
                <td className="text-center" data-click={JSON.stringify(dataListMember)}>{dataListMember.done}</td>
                <td className="text-center" data-click={JSON.stringify(dataListMember)}>{dataListMember.not_done}</td>
                <td className="text-center" data-click={JSON.stringify(dataListMember)}>{dataListMember.out_of_date}</td>
                <td className="text-center" data-click={JSON.stringify(dataListMember)}>{isNaN(efficiency) === false ? efficiency.toFixed(0) : 0}%</td>
            </tr>
        );
    }
}

class EvaluationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InfoMemberKPI: null,
            keyWord: ""
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetInfoMember = this.handleGetInfoMember.bind(this);
    };
    handleGetInfoMember(info) {
        this.props.handleGetInfoMemberKPI(info);
    }
    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }


    printListMember() {
        var list_member = document.getElementById("list_member").innerHTML;
        var phase = document.getElementById("Phaselist_member").innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');
        mywindow.document.write('<html><head><title>Báo cáo công việc</title><style>img{width: 50px; height: 50px;}</style>');
        mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
        mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        mywindow.document.write('</head><body>');
        mywindow.document.write('<h1 class="text-center">KPI Report</h1>');
        mywindow.document.write('<p class="float-right">' + phase + '</p>');
        mywindow.document.write(list_member);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        setTimeout(function () { mywindow.focus(); mywindow.print(); }, 1000);
        return true;
    }

    render() {
        let height_screen = window.screen.height * 0.6;
        let data = []
        this.props.dataListMembers.map(({ full_name, total, done, not_done, out_of_date }, index) => {
            let element = {
                full_name,
                total,
                done,
                not_done,
                out_of_date,
            }
            data.push(element);
        });
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
                                <DropdownItem onClick={this.printListMember}>
                                    PDF
                                    </DropdownItem>
                                <DropdownItem >
                                    <CSVLink data={data} filename={"KPI_list_members.csv"}>Excel</CSVLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                    <CardTitle className="m-2">Evaluation</CardTitle>
                    <CardSubtitle id="Phaselist_member">
                        <DateTimePicker handleSetDueDateKPI={this.props.handleSetDueDateKPI} />
                    </CardSubtitle>
                </CardHeader>
                <CardBody style={{ overflowX: 'auto', height: height_screen }} id="list_member">
                    <Table responsive hover >
                        <thead >
                            <tr className="text-center">
                                <th>Member</th>
                                <th>Total</th>
                                <th>Done</th>
                                <th>Not done</th>
                                <th>Out of date</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                this.props.dataListMembers.map((infoMember, index) => {
                                    if (infoMember.full_name.toLowerCase().indexOf(this.state.keyWord) !== -1) {
                                        return (
                                            <MemberList
                                                dataListMember={infoMember}
                                                key={index}
                                                handleGetInfoMember={this.handleGetInfoMember}
                                            />
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

export default EvaluationList;