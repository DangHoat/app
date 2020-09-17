import React, { Component } from 'react';
import {
  Button, Card, CardBody, Media,
} from "reactstrap";
import Notification from "../../../components/Notification";
import "../Profile.css"
import LoadingSprinner from "../../../components/LoadingSprinner"
import {CustomImg} from "../../../components/CustomTag"
import { Eye, Key } from "react-feather"
import empty_avatar from "../../../assets/img/avatars/empty_avatar.png"
import {getUserId} from "../../../utils/utils"
import {isEmpty} from "../../../utils/ValidInput"
const api = require('../api/api')

class Watched extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoad: 10,
            listWatched: [],
        }
    }
    loadMore(){
        this.setState({ maxLoad: this.state.maxLoad + 10 })
    }
    componentDidMount() {
        this.setState({loadApiGetWatched: false});
        api.getWatched(this.props.id, (err, result) => {
            if (err) {
              Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
                this.setState({ listWatched: result, loadApiGetWatched: true});
            }
        })
    }
    render() {
        return (
            <div>
                {!this.state.loadApiGetWatched ? <LoadingSprinner /> :
                    <Card>
                        <CardBody className="tiles mb-4" aria-live="polite">
                            {this.state.listWatched.slice(0, this.state.maxLoad).map((data, index) => (
                                <div key={index}>
                                    <Media>
                                        <Media left href={data.type === "userstory" && !isEmpty(data.assigned_to_extra_info) ? (data.assigned_to_extra_info.id !== getUserId() ? `?username=${data.assigned_to_extra_info.username}` : window.location.pathname)
                                                        : data.type === "project" ? "#"
                                                        : data.type === "task" && !isEmpty(data.assigned_to_extra_info) ? (data.assigned_to_extra_info.id !== getUserId() ? `?username=${data.assigned_to_extra_info.username}` : window.location.pathname)
                                                        : "#"
                                        }>
                                            <CustomImg
                                                src={data.type === "userstory" && data.assigned_to_extra_info !== null ? data.assigned_to_extra_info.photo
                                                    : data.type === "project" ? data.logo_small_url
                                                    : data.type === "task" && data.assigned_to_extra_info !== null ? data.assigned_to_extra_info.photo
                                                    : empty_avatar}
                                                className="rounded-circle mr-2 img--user--square-3x"
                                                title={(data.type === "userstory"  || data.type === "task") && data.assigned_to_extra_info !== null ? `@${data.assigned_to_extra_info.username}`
                                                    : data.type === "project" ? data.name
                                                    : null}
                                                alt="Avatar"
                                            />
                                        </Media>
                                        <Media body>
                                            <div className="float-left">
                                                <Media heading>
                                                    {data.type === "userstory" ? <div><span>{data.project_name}</span><span> USER STORY </span> <span style={{ color: data.status_color }}>{data.status}</span></div>
                                                    : data.type === "project" ? (data.is_private ? <div><span><a title={data.name} href={`${window.location.origin}/project/${data.slug}/timeline`}>{data.name}</a></span><span className="mx-3"><Key size="20px" /></span></div> : <a href="#">{data.name}</a>)
                                                    : data.type === "task" ? <div><span>{data.project_name}</span><span> TASK </span> <span style={{ color: data.status_color }}>{data.status}</span></div>
                                                    : null
                                                    }
                                                </Media>
                                                    {data.type === "userstory" ? <strong>#{data.ref + ' '}<a href={`${window.location.origin}/project/${data.project_slug}/us/${data.ref}`} title={`#${data.ref} ${data.subject}`}>{data.subject}</a></strong>
                                                    : data.type === "project" ? data.description
                                                    : data.type === "task" ? <strong>#{data.ref + ' '}<a href={`${window.location.origin}/project/${data.project_slug}/task/${data.ref}`} title={`#${data.ref} ${data.subject}`}>{data.subject}</a></strong>
                                                    : "null"
                                                }
                                            </div>
                                            <div className="float-right">
                                                <span title={data.total_watchers < 2 ? `${data.total_watchers} watcher` : `${data.total_watchers} watchers`}>
                                                    <div className="float-right">{data.total_watchers}</div>
                                                    <Eye size="6%" className="float-right mx-1" />
                                                </span>
                                            </div>
                                        </Media>
                                    </Media>
                                    <hr />
                                </div>
                            ))}
                            {this.state.maxLoad < this.state.listWatched.length && <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>}
                        </CardBody>
                    </Card>
                }
            </div>
        );
    }
}
export default Watched;