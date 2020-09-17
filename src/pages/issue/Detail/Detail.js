import React, { Component } from 'react'
import {
    Col, Row,
} from "reactstrap";
import {connect} from "react-redux"
import { LoadingSprinner, Notification } from "../../../components/CustomTag"
import Left from "./Left"
import Right from "./Right"

const API = require("../api/api")
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            idDetail: "",
            Detail: [],
            total: 0,
            loading: true,
            map: new Map(),
            dataComment: [],
            dataActivity: []
        })
    }
    GetDetail(id) {
        API.getDetail(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
                // console.table(err)
                // window.location.replace("project/issue")
            }
            else {
                this.setState({
                    idDetail: id,
                    Detail: result,
                    loading: false
                });
            }
        })
    }
    GetAttachmentData(id) {
        API.getAttachment(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                this.setState({ dataAttachment: result })
            }
        })

    }
    componentWillMount() {
        this.GetDetail(this.props.idDetail);
        this.GetAttachmentData(this.props.idDetail);
        this.getComment(this.props.idDetail);
        this.getActivity(this.props.idDetail)

    }
    getComment(id) {
        API.getHistory(id, "comment", (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                // console.log(result.data)
                this.setState({
                    dataComment: result.data
                })
            }
        })

    }
    getActivity(id) {
        API.getHistory(id, "activity", (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                // console.log(result.data);
                this.setState({
                    dataActivity: result.data
                })

            }
        })

    }
    Exit() {
        window.location.replace("issue")
    }
    reLoad() {
        this.GetDetail(this.props.idDetail);
        this.GetAttachmentData(this.props.idDetail);
    }
    checkPromise(){
        if(this.state.Detail.owner == this.props.user.user.id){
            return true
        }else return false
    }
    render() {

        return (
            <div>
                {
                    this.state.loading ?
                        <LoadingSprinner />
                        :
                        <Row>
                            <Col xl={8} md={8}>
                                <Left
                                    memberProject={this.props.memberProject}
                                    data={this.state.Detail}
                                    idDetail={this.state.idDetail}
                                    here={this.state.here}
                                    reLoad={this.reLoad.bind(this)}
                                    getComment={this.getComment.bind(this)}
                                    getActivity={this.getActivity.bind(this)}
                                    dataAttachment={this.state.dataAttachment}
                                    dataComment={this.state.dataComment}
                                    dataActivity={this.state.dataActivity}
                                    promise={this.checkPromise()} />
                            </Col>
                            <Col xl={4} md={4}>
                                <Right
                                    memberProject={this.props.memberProject}
                                    data={this.state.Detail}
                                    reLoad={this.reLoad.bind(this)}
                                    idDetail={this.state.idDetail}
                                    Exit={this.Exit.bind(this)}
                                    getActivity={this.getActivity.bind(this)} 
                                    promise={this.checkPromise()}/>
                            </Col>
                        </Row>
                }

            </div>
        )
    }
}
export default connect(store => ({
    app: store.app,
    user: store.user,
    store : store
}))(Detail);