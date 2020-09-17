import React, { Component } from 'react';
import { PureComponent } from 'react';
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown  } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col} from 'reactstrap';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ComposedChart, Line, Area, Bar, AreaChart,
    Legend, Scatter,  BarChart, } from 'recharts';
import { formatDate, parseDate } from 'react-day-picker/moment';
import Mixed from "./Mixed";
import {CustomImg, LoadingSprinner} from "../../../components/CustomTag";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import { Table } from 'reactstrap';
import "./CashFlow.css";


const data2 = [
    {
        name: 'Revenue', uv: 4000, pv: 2400, amt: 2400,
    },
    {
        name: 'Expenses', uv: 3000, pv: 1398, amt: 2210,
    },
    {
        name: 'Profit', uv: 2000, pv: 9800, amt: 2290,
    },
];

const tabledata =[
    {
        tt: '1', date: '01/05/2019', workname: 'cv1', content: 'buy items', expenses: '50', revenue: '80', profit: '30'
    },
    {
        tt: '1', date: '01/05/2019', workname: 'cv1', content: 'buy items', expenses: '50', revenue: '80', profit: '30'
    },
    {
        tt: '1', date: '01/05/2019', workname: 'cv1', content: 'buy items', expenses: '50', revenue: '80', profit: '30'
    },
    {
        tt: '1', date: '01/05/2019', workname: 'cv1', content: 'buy items', expenses: '50', revenue: '80', profit: '30'
    }

];

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                {/*<p className="intro">{getIntroOfPage(label)}</p>*/}
                {/*<p className="desc">Anything you want can be displayed here.</p>*/}
            </div>
        );
    }

    return null;
};

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

    handleFromChange(from) {
        this.setState({ from });
        this.props.handerSetDueDate(from,null);
    }
    
    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
        this.props.handerSetDueDate(null,to);
    }

    render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
        <div className="InputFromTo" >
            <UncontrolledDropdown >
                <DropdownToggle  caret color="light">
                   Phase: {moment(from).format('L')} - {moment(to).format('L')} {' '}
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
class ProjectList extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (          
                <div className="my-3 mx-2" >
                
                <UncontrolledButtonDropdown>
                    <DropdownToggle caret  className="bg-light text-dark !important border-0">
                        Choose project: LEAST ONE PROJECT [$]
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
                </div>
                
            
        );
    }
}

class BarChart1 extends Component {
    static jsfiddleUrl = 'https://jsfiddle.net/alidingling/vxq4ep63/';

    render() {
        return (
            <BarChart
                width={500}
                height={400}
                data={data2}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="pv" barSize={20} fill="#8884d8" />
            </BarChart>
        );
    }
}



class CashTable extends Component {
    render() {
        return (
            <Table borderless>
                <thead className="border">
                <tr>
                    <th>TT</th>
                    <th>Date</th>
                    <th>Work Name</th>
                    <th>Content</th>
                    <th>Expenses [$]</th>
                    <th>Revenue [$]</th>
                    <th>Profit [$]</th>
                </tr>
                </thead>
                <tbody className="border">
                {
                    tabledata.map((value, key) => {
                        return(
                            <tr>
                                <th scope="row">{value.tt}</th>
                                <td>{value.date} </td>
                                <td>{value.workname}</td>
                                <td>{value.content}</td>
                                <td>{value.expenses}</td>
                                <td>{value.revenue}</td>
                                <td>{value.profit}</td>
                            </tr>
                        )
                    })
                }

                </tbody>
            </Table>
        );
    }
}


class CashFlow extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className="mt-3">
                    <Col xs="3.5" className="border bg-white mr-3">
                        <div>
                            <div className="float-left">
                                <ProjectList/>
                            </div>
                            <div className="float-right mt-3">
                                <DateTimePicker/>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <h4 className="font-weight-bolder mt-4  text-danger !important">SUMMARY OF BUDGET</h4>
                        </div>
                        <div className="CashFlow__row__col-barchart">
                            <BarChart1/>
                        </div>
                    </Col>
                    <Col xs="6" className="border bg-white ">
                        <div>
                            <div className="mt-3"></div>
                            <Mixed/>
                        </div>
                    </Col>
                </Row>
                {/*-------------------------------------------*/}
                <Row className="mt-4">
                    <Col xs="6" className="border bg-white float-right CashFlow__row__col--cashtable">
                        <div>
                            <div className="mt-3"></div>
                            <div>
                                <div className="h5 float-left mt-2">SUMMARY OF DOCUMENTS</div>
                                <div className="float-right mb-3 "><input id="inputSearch" placeholder="Search" type="text" className="form-control" /></div>
                            </div>
                            <CashTable/>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default CashFlow;