import React from 'react';
import { Link } from "react-router-dom";
import moment from 'moment'
import {
    Button,
    Card, CardBody, CardHeader, CardTitle,
    Media
} from "reactstrap";
import { CustomImg } from "../../components/CustomTag";
import "./Timeline.css";
const api = require("./api/api");
const utils = require("../../utils/utils");

class Activities extends React.Component {
    constructor(props) {
        super(props);
        const { dataTimeline } = this.props;
        this.state = {
            dataTimeline: dataTimeline,
            max: 10,
            page: 2,
            status_load: true
        }
        this.handerUpdate = this.handerUpdate.bind(this)
    }

    // ham load them du lieu tu API
    handerUpdate() {
        const that = this;
        this.setState({ page: this.state.page + 1 });
        api.getActivities(this.state.page, (err, result) => {
            if (err) {
                this.setState({ status_load: false })
            } else {
                this.setState({ status_load: true })
                that.setState({ max: this.state.max + 10 });
                let state = Object.assign({}, that.state);
                for (let i = 0; i < result.length; i++) {
                    state.dataTimeline.push(result[i])
                }
                that.setState(state);
            }
        })
    }
    //xu li API
    renderDataEventType(data) {
        switch (data.event_type) {
            case 'projects_projects.create':
                return (
                    <React.Fragment>
                        has created project {" "}
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                            {data.data.user.id.snapshot.subject}
                        </Link>
                    </React.Fragment>
                );
            case 'projects_memberships.change':
                return (
                    <React.Fragment>
                        membership change role?
                    </React.Fragment>
                );
            case 'projects_works.create':
                return (
                    <React.Fragment>
                        has created a new US {" "}
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                            {data.data.user.id.snapshot.subject}
                        </Link>
                        {" "} in {" "}
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                            {data.data.user.id.snapshot.project_name}
                        </Link>
                    </React.Fragment>
                );
            case 'projects_works.changes':
                return (
                    <React.Fragment>
                        has updated the attribute {" "}
                        {data.data.user.id.diff.subject === undefined ? null :
                            <React.Fragment>
                                "Subject" of the US {" "}
                                {" "} from {" " + data.data.user.id.diff.subject[0]} to {data.data.user.id.diff.subject[1]}
                            </React.Fragment>
                        }
                        {data.data.values_diff.assigned_users === undefined ? null :
                            <React.Fragment>
                                "Assigned users" of the US {" "}
                                <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                                    {data.data.userstory.subject}
                                </Link>
                                {" "} to {data.data.values_diff.assigned_users[1]}
                            </React.Fragment>
                        }
                        {data.data.values_diff.status === undefined ? null :
                            <React.Fragment>
                                "Status" of the US {" "}
                                <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                                    {data.data.userstory.subject}
                                </Link>
                                {" "} from {" " + data.data.values_diff.status[0]} to {data.data.values_diff.status[1]}
                            </React.Fragment>
                        }
                        {data.data.values_diff.due_date === undefined ? null :
                            <React.Fragment>
                                "Due date" of the US {" "}
                                <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                                    {"#" + data.data.userstory.ref + " " + data.data.userstory.subject}
                                </Link>
                                {" "} from {" " + data.data.values_diff.due_date[0]} to {data.data.values_diff.due_date[1]}
                            </React.Fragment>
                        }
                    </React.Fragment>
                );
            case 'tasks.task.create':
                return (
                    <React.Fragment>
                        has created a new task {" "}
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                            {"#" + data.data.task.ref + " " + data.data.task.subject}
                        </Link>
                        {" "} in {" "}
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                            {data.data.project.name}
                        </Link>
                        {" "} which belongs to the US  {" "}
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                            {"#" + data.data.task.userstory.ref + " " + data.data.task.userstory.subject}
                        </Link>
                    </React.Fragment>
                );
            case 'tasks.task.change':
                return (
                    <React.Fragment>
                        has updated the attribute {" "}
                        {/* {data.data.values_diff.assigned_users ===  undefined ? null : ' "Assigned users" of the ' } */}
                        {data.data.values_diff.subject === undefined
                            ?
                            null
                            :
                            <React.Fragment>
                                "Subject" of the task {" "}
                                <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                                    {"#" + data.data.task.ref + " " + data.data.task.subject}
                                </Link>
                                {" "} from {" " + data.data.values_diff.subject[0]} to {data.data.values_diff.subject[1]}
                            </React.Fragment>
                        }
                    </React.Fragment>
                );
            case 'projects_memberships.create':
                return (
                    <React.Fragment>
                        is a new member {" "}
                    </React.Fragment>
                );
            default:
                return null;
        }
    }
    // Hien thi noi dung 
    render() {
        // console.log("data:", this.state.dataTimeline)
        let actions = this.state.dataTimeline.slice(0, this.state.max).map((data, index) => {
            const linkUser = `/profile${data.data.user.id === utils.getUserId() ? '' : `?email=${data.data.user.username}`}`;
            return (
                <div key={index}>
                    <Media>
                        <Link to={linkUser} activeclassname="active">
                            <CustomImg
                                key={utils.randomString()}
                                src={data.data.user.photo}
                                alt="avatar"
                                className="rounded-circle img--user--square-2x"
                            />
                        </Link>
                        <Media body className="p-2" >
                            <React.Fragment>
                                <small className="float-right text-navy"> {moment(data.created).fromNow()}</small>
                                <Link to={linkUser} className="Timeline___linkto"><strong >{data.data.user.id.user_id}</strong></Link>
                                {" "}
                                {this.renderDataEventType(data)}
                                <br />
                            </React.Fragment>
                        </Media>
                    </Media>
                    <hr />
                </div>
            );
        })
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0" >
                        Activities
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    {actions}
                    {this.state.max < this.state.dataTimeline.length ? <Button block color="primary" className="load-more" onClick={() => this.setState({ max: this.state.max + 10 })}>Load More</Button>
                        :
                        this.state.status_load === true && this.state.dataTimeline.length > 10
                            ?
                            <Button block color="primary" className="load-more" onClick={() => this.handerUpdate()}>Load More</Button>
                            :
                            null
                    }
                </CardBody>
            </Card>
        );
    }
}

export default Activities;