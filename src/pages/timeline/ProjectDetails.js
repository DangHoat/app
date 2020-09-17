import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, CardTitle,
} from "reactstrap";
import { CustomImg } from "../../components/CustomTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

const utils = require("../../utils/utils");

class ProjectDetails extends React.Component {
    constructor(props) {
        super(props);
        const { dataInfoProject } = this.props;
        this.toggle = this.toggle.bind(this);
        this.state = {
            dataInfoProject: dataInfoProject,
            tooltipOpen: false
        }
    }
    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    project() {
        let member = this.state.dataInfoProject.members;
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0">
                        Project Details
                </CardTitle>
                </CardHeader>
                <CardBody className="text-center">
                    <CustomImg
                        key={utils.randomString()}
                        src={this.state.dataInfoProject.owner.photo}
                        alt="avatar"
                        className="rounded-circle img--user--square-7x"
                    />
                    <CardTitle tag="h5" className="m-1">
                        {this.state.dataInfoProject.name}<FontAwesomeIcon icon={this.state.dataInfoProject.is_private === true ? faKey : faGlobeAmericas} className="ml-1" />
                    </CardTitle>
                    <div className="text-muted mb-1"></div>
                    {this.state.dataInfoProject.description}
                </CardBody>
                <hr className="my-0" />
                <CardBody>
                    <CardTitle tag="h5">Team {"(" + member.length + ")"}</CardTitle>
                    {member.map((img, index) => {
                        const linkUser = `/profile${img.id === this.state.dataInfoProject.owner.id ? '' : `?email=${img.email}`}`;
                        return (
                            <React.Fragment key={index}>
                                <Link to={linkUser} activeclassname="active">
                                    <CustomImg
                                        key={utils.randomString()}
                                        src={img.photo}
                                        alt="avatar"
                                        className={
                                            img.id === this.state.dataInfoProject.owner.id
                                                ?
                                                "rounded-circle mr-2 mt-2 rounded-circle border border-success img--user--square-2x"
                                                :
                                                "rounded-circle mr-2 mt-2 img--user--square-2x"
                                        }
                                        data-for='img'
                                        data-tip={img.full_name}
                                        title={img.full_name}
                                    />
                                    <ReactTooltip id='img'></ReactTooltip>
                                </Link>
                            </React.Fragment>
                        );
                    })}
                </CardBody>
                <hr className="my-0" />
                <CardBody>
                    <CardTitle tag="h5">Description</CardTitle>
                    <ul className="list-unstyled mb-0">
                        <li className="mb-1">
                            <div className="d-inline-block">
                                <span className="mx-0">Date created:</span>
                                <span className="Timeline___linkto ml-1">{moment(this.state.dataInfoProject.created_date).format('DD-MM-YYYY')}</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div className="d-inline-block">
                                <span className="mx-0">Total work:</span>
                                <span className="Timeline___linkto ml-1">{this.state.dataInfoProject.works.total}</span>
                            </div>
                        </li>
                    </ul>
                </CardBody>
                <hr className="my-0" />
            </Card>
        );
    }
    render() {
        // let project = this.state.dataInfoProject.map((data, index) => {
        //     let member = data.members;
        //     return (
        //         <Card key={index}>
        //             <CardHeader>
        //                 <CardTitle tag="h5" className="mb-0">
        //                     Project Details
        //     </CardTitle>
        //             </CardHeader>
        //             <CardBody className="text-center">
        //                 <CustomImg
        //                     key={utils.randomString()}
        //                     src={data.owner.photo}
        //                     alt="avatar"
        //                     className="rounded-circle img--user--square-7x"
        //                 />
        //                 <CardTitle tag="h5" className="m-1">
        //                     {data.name}<FontAwesomeIcon icon={data.is_private === true ? faKey : faGlobeAmericas} className="ml-1" />
        //                 </CardTitle>
        //                 <div className="text-muted mb-1"></div>
        //                 {data.description}
        //             </CardBody>
        //             <hr className="my-0" />
        //             <CardBody>
        //                 <CardTitle tag="h5">Team {"(" + member.length + ")"}</CardTitle>
        //                 {member.map((img, index) => {
        //                     const linkUser = `/profile${img.id === data.owner.id ? '' : `?email=${img.email}`}`;
        //                     return (
        //                         <React.Fragment key={index}>
        //                             <Link to={linkUser} activeclassname="active">
        //                                 <CustomImg
        //                                     key={utils.randomString()}
        //                                     src={img.photo}
        //                                     alt="avatar"
        //                                     className={
        //                                         img.id === data.owner.id
        //                                             ?
        //                                             "rounded-circle mr-2 mt-2 rounded-circle border border-success img--user--square-2x"
        //                                             :
        //                                             "rounded-circle mr-2 mt-2 img--user--square-2x"
        //                                     }
        //                                     data-for='img'
        //                                     data-tip={img.full_name}
        //                                     title={img.full_name}
        //                                 />
        //                                 <ReactTooltip id='img'></ReactTooltip>
        //                             </Link>
        //                         </React.Fragment>
        //                     );
        //                 })}
        //             </CardBody>
        //             <hr className="my-0" />
        //             <CardBody>
        //                 <CardTitle tag="h5">Description</CardTitle>
        //                 <ul className="list-unstyled mb-0">
        //                     <li className="mb-1">
        //                         <div className="d-inline-block">
        //                             <span className="mx-0">Date created:</span>
        //                             <span className="Timeline___linkto ml-1">{moment(data.created_date).format('DD-MM-YYYY')}</span>
        //                         </div>
        //                     </li>
        //                     <li className="mb-1">
        //                         <div className="d-inline-block">
        //                             <span className="mx-0">Total work:</span>
        //                             <span className="Timeline___linkto ml-1">{data.works.total}</span>
        //                         </div>
        //                     </li>
        //                 </ul>
        //             </CardBody>
        //             <hr className="my-0" />
        //         </Card>
        //     );
        // })
        return (
            <React.Fragment>
                {/* {project} */}
                {this.project()}
            </React.Fragment>
        );
    }
}

export default ProjectDetails;