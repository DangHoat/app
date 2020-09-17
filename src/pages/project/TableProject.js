import React from "react";
import { Progress } from "react-sweet-progress";
import "./Project.css";
import Notification from "../../components/Notification";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    Card, CardTitle,
    Table,
    Badge,
    UncontrolledTooltip,
    Container,
} from "reactstrap";
import { CustomImg } from "../../components/CustomTag";

const api = require("./api/api");
const none = "none";

class TableProject extends React.Component {
    constructor(props) {
        super(props);
        const { id, name, is_private, created_date, budget, works, i_am_owner, logo, owner } = this.props;
        this.state = {
            data: {
                id: id,
                name: name,
                is_private: is_private,
                created_date: created_date,
                i_am_owner: i_am_owner,
                budget: budget,
                works: works,
                logo: logo,
                owner: owner,
            }
        };
    }

    handleSelectProject() {
        api.getInfoProject(this.state.data.id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member, members } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member
                }
                sessionStorage.setItem('project', JSON.stringify(project));
                window.location.replace("/project/work");
            }
        });
    }

    render() {
        return (
            <Container fluid className="table-project mt-4 pr-0">
                <Card id={"table-project-" + this.state.data.id} className="table-project__card border-bottom-0" >
                    <Link to="#" onClick={this.handleSelectProject.bind(this)} className="table-project__card-header mb-0 px-2 py-1 hover-pointer:hover text-decoration-none overflow-hidden position-relative table-project__card__header">
                        <CustomImg className="img--user--square-3x mr-2" src={this.state.data.logo === null ? none : this.state.data.logo} alt="avt" />
                        <CardTitle className="align-middle d-inline-block mb-0 font-size-3x font-weight-bold text-color-black mt-0 border-bottom-0">
                            <div>
                                <div className="d-inline-block" id={"tooltip-project-" + this.state.data.id}>{this.state.data.name}</div>

                                <div className="d-inline-block ml-1 pt-1 font-size-1x">
                                    <Badge
                                        color={this.state.data.is_private ? "info" : "primary"}
                                        className="badge-pill px-1 mr-1 mb-1"
                                    >
                                        {this.state.data.is_private ? "Private" : "Public"}
                                    </Badge>
                                </div>
                                <div className="d-inline-block ml-1 pt-1 font-size-1x">
                                    <Badge
                                        color={(this.state.data.i_am_owner) ? "info" : "primary"}
                                        className="badge-pill px-1 mr-1 mb-1"
                                    >
                                        {this.state.data.i_am_owner ? "Owner" : "Member"}
                                    </Badge>
                                </div>
                                <h6 className="text-muted table-project__h6">Created by: {this.state.data.owner.full_name}</h6>
                                <UncontrolledTooltip
                                    placement={"bottom"}
                                    target={"tooltip-project-" + this.state.data.id}
                                >
                                    Click to show detail
                                </UncontrolledTooltip>
                            </div>
                        </CardTitle>
                    </Link>
                    <Table bordered responsive="xl" size="sm" className="table-project__card__table" >
                        <tbody className="table-project__card__table-color">
                            <tr>
                                <td rowSpan="3" className="table-project__card__table__col-id text-center pl-0 pr-0 h5">{this.props.index}</td>
                                <td rowSpan="3" className="width-percent-15">
                                    <p><span className="table-project__card__table__title-text pt-0 m-0 h5">Time: </span><span
                                        className="table-project__card__table__content-text"> </span></p>
                                    <p><span className="table-project__card__table__title-text pt-0 m-0 h5">Start: </span><span
                                        className="table-project__card__table__content-text">{this.state.data.created_date.split("T")[0]}</span></p>
                                    <p><span className="table-project__card__table__title-text pt-0 m-0 h5">Finish: </span><span
                                        className="table-project__card__table__content-text"> </span></p>
                                </td>
                                <td rowSpan="3" className="table-project__card__table__col-budget">
                                    <p><span className="table-project__card__table__title-text pt-0 m-0 h5">Budget: </span><span
                                        className="table-project__card__table__content-text">{this.state.data.budget.total}$</span></p>
                                    <p><span className="table-project__card__table__title-text pt-0 m-0 h5">Cost: </span><span
                                        className="table-project__card__table__content-text">{this.state.data.budget.cost}$</span></p>
                                    <p><span className="table-project__card__table__title-text pt-0 m-0 h5">Revenue: </span><span
                                        className="table-project__card__table__content-text">{this.state.data.budget.revenue}$</span></p>
                                </td>
                                <td colSpan="6" className="table-project__card__table__col-work-total font-weight-bold h4 ">
                                    <p className="text-center align-middle p-0 m-0"><span className="table-project__card__table__title-text ">Total work: </span><span
                                        className="table-project__card__table__content-text">{this.state.data.works.total}</span></p>
                                </td>
                                <td rowSpan="3" className="width-percent-15 pl-0 pr-0">
                                    <center>
                                        <Progress
                                            theme={
                                                {
                                                    success: {
                                                        symbol: this.state.data.works.total === 0 ? 0 : Math.floor(this.state.data.works["Done"] / this.state.data.works.total * 100) + '%',
                                                        trailColor: 'rgb(239, 239, 239)',
                                                        color: 'rgb(4, 158, 81)'
                                                    }
                                                }
                                            }
                                            width={70}
                                            percent={this.state.data.works.total === 0 ? 0 : Math.floor(this.state.data.works["Done"] / this.state.data.works.total * 100)}
                                            type="circle"
                                            status="success"
                                        />
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td className="table-project__card__table__col-work-new table-project__card__table__col-work border-bottom-0">
                                    <p className="m-0 text-center">{this.state.data.works["New"]}</p>
                                </td>
                                <td className="table-project__card__table__col-work-ready table-project__card__table__col-work border-bottom-0">
                                    <p className="m-0 text-center">{this.state.data.works["Ready"]}</p>
                                </td>
                                <td className="table-project__card__table__col-work-in-progress table-project__card__table__col-work border-bottom-0">
                                    <p className="m-0 text-center">{this.state.data.works["In_progress"]}</p>
                                </td>
                                <td className="table-project__card__table__col-work-ready-for-test table-project__card__table__col-work border-bottom-0">
                                    <p className="m-0 text-center">{this.state.data.works["Ready_for_test"]}</p>
                                </td>
                                <td className="table-project__card__table__col-work-done table-project__card__table__col-work border-bottom-0">
                                    <p className="m-0 text-center">{this.state.data.works["Done"]}</p>
                                </td>
                                <td className="table-project__card__table__col-work-archived table-project__card__table__col-work border-bottom-0">
                                    <p className="m-0 text-center">{this.state.data.works["Archived"]}</p>
                                </td>
                            </tr>

                            <tr>
                                <td className=" table-project__card__table__col-work h6 border-top-0 border-bottom p-0">
                                    <p className="m-0 text-center">New</p>
                                </td>
                                <td className=" table-project__card__table__col-work h6 border-top-0 border-bottom p-0">
                                    <p className="m-0 text-center">Ready</p>
                                </td>
                                <td className=" table-project__card__table__col-work h6 border-top-0 border-bottom p-0">
                                    <p className="m-0 text-center">In progress</p>
                                </td>
                                <td className=" table-project__card__table__col-work h6 border-top-0 border-bottom p-0">
                                    <p className="m-0 text-center">Ready for test</p>
                                </td>
                                <td className=" table-project__card__table__col-work h6 border-top-0 border-bottom p-0">
                                    <p className="m-0 text-center">Done</p>
                                </td>
                                <td className="table-project__card__table__col-work h6 border-top-0 border-bottom p-0">
                                    <p className="m-0 text-center">Archived</p>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            </Container>
        )
    }
}

export default connect()(TableProject);