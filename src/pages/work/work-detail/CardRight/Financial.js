import React from 'react';
import "../WorkDetail.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    PlusCircle
} from "react-feather"

import {
    Card, CardBody, Table,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, Progress
} from "reactstrap"

import { ModalAssignUser } from "../../../../components/Modal";
import { CustomImg, Notification } from "../../../../components/CustomTag";
import { stringTypeAnnotation } from '@babel/types';


const api = require("../api/api");
const utils = require("../../../../utils/utils");
let memberInProject = [];

const work_id = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;


class Financial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModal: false,
            isShow: true,
            isHover: false,
            expenses: 0,
            revenue: 0,
            data: [
                // {
                //     created_date: "12/08/2019",
                //     description: "Test1",
                //     expenses: 0,
                //     revenue: 100,
                //     creator: 12
                // },
                // {
                //     created_date: "11/08/2019",
                //     description: "Test2",
                //     expenses: 0,
                //     revenue: 1002,
                //     creator: 12
                // },
                // {
                //     created_date: "12/08/2019",
                //     description: "Test1",
                //     expenses: 0,
                //     revenue: 200,
                //     creator: 12
                // }
            ]
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleOnMouseOver(index) {
        this.setState({
            isHover: index
        })
    }

    handleRemove(index) {
        let data = JSON.parse(JSON.stringify(this.state.data));
        data.splice(index, 1);
        this.setState({ data: data })
    }

    handleNewFinancial() {
        let dt = new Date();
        let element = {
            creator: 30,
            created_date: dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear(),
            expenses: document.getElementById("work-detail__input--financial--expenses").value,
            revenue: document.getElementById("work-detail__input--financial--revenue").value,
            description: document.getElementById("work-detail__input--financial--description").value
        };
        let data = JSON.parse(JSON.stringify(this.state.data));
        data.push(element)
        this.setState({
            data: data,
            isOpen: !this.state.isOpen,
            expenses: parseInt(this.state.expenses) + parseInt(element.expenses),
            revenue: parseInt(this.state.revenue) + parseInt(element.revenue)
        })

    }

    handleTotal() {
        let expenses = 0;
        let revenue = 0;
        for (let i = 0; i < this.state.data.length; i++) {
            expenses += this.state.data[i].expenses;
            revenue += this.state.data[i].revenue;
        }
        this.setState({
            expenses: expenses,
            revenue: revenue
        })
    }

    componentDidMount() {
        this.handleTotal()
    }

    render() {
        return (
            <>
                <Modal isOpen={this.state.isOpen}>
                    <ModalHeader>
                        Financial
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Expenses</Label>
                            <Input id="work-detail__input--financial--expenses" type="text" defaultValue={0} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Revenue</Label>
                            <Input id="work-detail__input--financial--revenue" type="text" defaultValue={0} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Description</Label>
                            <Input id="work-detail__input--financial--description" type="textarea"
                                placeHolder="Description" />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success"
                            onClick={this.handleNewFinancial.bind(this)}>
                            OK
                        </Button>
                        <Button color="secondary" onClick={this.toggle.bind(this, "isOpen")}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <a onClick={this.toggle.bind(this, "isShow")}>
                    <span>Financial</span>
                    <span className="float-right"><FontAwesomeIcon
                        icon={this.state.isShow ? faAngleDown : faAngleRight} /></span>
                    <span className="float-right mr-5"><span
                        className="text-color-red">Expenses: {this.state.expenses}</span> &nbsp; <span
                            className="text-color-green">Revenue: {this.state.revenue}</span></span>
                </a>
                <div className={this.state.isShow ? "d-block" : "d-none"}>
                    <Table responsive striped>
                        <thead>
                            <tr>
                                <th>Created</th>
                                <th>Description</th>
                                <th>Expenses</th>
                                <th>Revenue</th>
                                <th><a onClick={this.toggle.bind(this, "isOpen")}><PlusCircle /></a></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data.map(({ created_date, description, expenses, revenue, creator }, index) => {
                                    console.log(creator)
                                    return (
                                        <tr id={"financial-" + index} key={index}
                                            onMouseOver={this.handleOnMouseOver.bind(this, index)}
                                            onMouseLeave={this.handleOnMouseOver.bind(this, -1)}>
                                            <td>{created_date}</td>
                                            <td>{description}</td>
                                            <td>{parseInt(expenses)}</td>
                                            <td>{parseInt(revenue)}</td>
                                            <td className="cursor-pointer">
                                                {
                                                    this.state.isHover === index ? <FontAwesomeIcon icon={faTrash} size="2x"
                                                        onClick={this.handleRemove.bind(this, index)} /> :
                                                        <CustomImg
                                                            src={memberInProject.find(memberInProject => memberInProject.id === creator).photo}
                                                            className="img--user--square-2x" />
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </>
        )
    }
}

export default Financial;