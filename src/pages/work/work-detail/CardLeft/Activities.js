import React from "react";
import { Link } from "react-router-dom";
import Notification from "../../../../components/Notification"
import moment from 'moment'
import {
    Button,
    Media,
    Badge
} from "reactstrap";
//img 
import { CustomImg, LoadingSprinner } from "../../../../components/CustomTag";

const utils = require("../../../../utils/utils");
const api = require("../api/api");

const id = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;

class ContentActivities extends React.Component {

    constructor(props) {
        super(props);
        const { dataActivities } = this.props;
        this.state = {
            dataActivities: dataActivities,
            max: 4,
            ButtonColor: "primary",
            page: 2,
            status_load: true,
            add_content: 4
        }
        this.handleUpdateContent = this.handleUpdateContent.bind(this)
    }

    //Ham lay them noi dung tu API
    handleUpdateContent() {
        const that = this;
        this.setState({ page: this.state.page + 1 });
        api.getActivities(id, this.state.page, (err, result) => {
            if (err) {
                this.setState({ status_load: false })
            } else {
                this.setState({ status_load: true })
                that.setState({ max: this.state.max + that.state.add_content });
                let state = Object.assign({}, that.state);
                for (let i = 0; i < result.length; i++) {
                    state.dataActivities.push(result[i])
                }
                that.setState(state);
            }
        })
    }

    //Ham load them noi dung
    handleLoading() {
        this.setState({ max: this.state.max + this.state.add_content });
    }

    //Ham xu ly api
    renderDataEventType(data) {
        if (data.values_diff.attachments !== undefined) {
            if (data.values_diff.attachments.new.length !== 0) {
                return (
                    <React.Fragment>
                        <Badge color="primary" className="pt-1 aria-label " style={{ fontSize: 13 }}>new
                            attachments</Badge>
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto pl-2">
                            {data.values_diff.attachments.new[0].filename}
                        </Link>
                    </React.Fragment>
                );
            }
            if (data.values_diff.attachments.changed !== undefined && data.values_diff.attachments.changed.length !== 0) {
                return (
                    <React.Fragment>
                        <Badge color="secondary" className="pt-1 aria-label " style={{ fontSize: 13 }}>update
                            attachments {"( " + data.values_diff.attachments.changed[0].filename + " )"}</Badge>
                        <Link to={'#'} activeclassname="active" className="Timeline___linkto pl-2">
                            {data.values_diff.attachments.changed[0].changes.description[0] === "" ? "null " : data.values_diff.attachments.changed[0].changes.description[0]}
                            => {data.values_diff.attachments.changed[0].changes.description[1] === "" ? " null" : data.values_diff.attachments.changed[0].changes.description[1]}
                        </Link>

                    </React.Fragment>
                );
            }
        }
        if (data.values_diff.assigned_users !== undefined) {

            return (
                <React.Fragment>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>assigned user</Badge>
                    <Link to={'#'} activeclassname="active" className="Timeline___linkto pl-2">
                        {data.values_diff.assigned_users[1] + " => " + data.values_diff.assigned_users[0]}
                    </Link>
                </React.Fragment>
            );
        }
        if (data.values_diff.status !== undefined) {

            return (
                <React.Fragment>
                    <Badge color="warning" className="pt-1 aria-label " style={{ fontSize: 13 }}>status</Badge>
                    <Link to={'#'} activeclassname="active" className="Timeline___linkto pl-2">
                        {data.values_diff.status[1] + " => " + data.values_diff.status[0]}
                    </Link>
                </React.Fragment>
            );
        }
        if (data.values_diff.tags !== undefined) {

            return (
                <React.Fragment>
                    <Badge color="danger" className="pt-1 aria-label " style={{ fontSize: 13 }}>tags</Badge>
                    <Link to={'#'} activeclassname="active" className="Timeline___linkto pl-2">
                        {data.values_diff.tags[1] + " => " + data.values_diff.tags[0]}
                    </Link>
                </React.Fragment>
            );
        }
        if (data.values_diff.subject !== undefined) {

            return (
                <React.Fragment>
                    <Badge color="primary" className="pt-1 aria-label " style={{ fontSize: 13 }}>subject</Badge>
                    <Link to={'#'} activeclassname="active" className="Timeline___linkto pl-2">
                        {data.values_diff.subject[1] + " => " + data.values_diff.subject[0]}
                    </Link>
                </React.Fragment>
            );
        }
    }

    render() {
        let actions = this.state.dataActivities.slice(0, this.state.max).map((data, index) => {
            const linkUser = `/profile${data.user.pk === utils.getUserId() ? '' : `?username=${data.user.username}`}`;
            return (
                <div key={index}>
                    <Media>
                        {/* img */}
                        <Link to={linkUser} activeclassname="active" className="pt-2">
                            <CustomImg
                                key={utils.randomString()}
                                src={data.user.photo}
                                alt="avatar"
                                className="rounded-circle img--user--square-2x"
                            />
                        </Link>
                        {/* content */}
                        <Media body className="p-1">
                            <strong><Link to={linkUser} activeclassname="active"
                                className="Activities___linkto">{data.user.name}</Link>{" "}</strong>
                            {moment(data.created_at).format("DD MMM YYYY hh:mm")}
                            <br />
                            {this.renderDataEventType(data)}
                        </Media>
                    </Media>
                    <hr />
                </div>
            );
        })
        return (
            <React.Fragment>
                {actions}
                {this.state.max < this.state.dataActivities.length ?
                    <Button block color="primary" className="load-more" onClick={this.handleLoading.bind(this)}>Load
                        More</Button>
                    :
                    this.state.status_load === true && this.state.dataActivities.length > this.state.add_content
                        ?
                        <Button block color="primary" className="load-more"
                            onClick={this.handleUpdateContent.bind(this)}>Load More</Button>
                        :
                        null
                }
            </React.Fragment>
        );
    }
}

class Activities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderAPI: false
        };
    }
    componentWillMount() {
        const that = this;
        let page = 1;
        api.getActivities(id, page, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                that.setState({ dataActivities: result, isLoaderAPI: true });
            }
        })
    }
    render() {
        return (
            <React.Fragment>
                {!this.state.isLoaderAPI ? <LoadingSprinner /> : <ContentActivities dataActivities={this.state.dataActivities} />}
            </React.Fragment>
        );
    }
}

export default Activities;
