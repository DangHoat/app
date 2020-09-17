import React, { Component } from 'react';
import {
    Card, CardBody, CardHeader, CardTitle, CardSubtitle,
    Badge,
    Row, Col,
    Form,Input,Button
} from "reactstrap";
import { ChevronRight, ChevronLeft, Plus } from 'react-feather'
import { Attachments, Description } from "../../../components/CustomTag";
import { Activity, Comments,BoxAddTag } from "../ModalIssue"
import Notification from "../../../components/Notification";
const ValidInput = require("../../../utils/ValidInput")
const API = require("../api/api")
class Left extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "comments",
            activeDes: false,
            isLoaded: true,
            process: 0,
            data: props.data,
            comment : "",
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab

            });
        }
    }
    handleRemoveFile(id) {
        console.log(id)
        API.editAttachment(id,"DELETE",(err,resutl)=>{
            if(err){
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            }else{
                Notification("success");
                this.props.reLoad(this.props.idDetail);
                this.props.getActivity(this.props.idDetail)
            }
        })
    }
    handleUploadFile(file) {
       API.uploadFile( this.props.idDetail,file,(err,resutl)=>{
           if(err){
               console.log(err)
           }else{
            Notification("success");
            this.props.reLoad(this.props.idDetail);
            this.props.getActivity(this.props.idDetail)
           }
       }
       ,(process)=>{
        this.setState({process:process})
        console.log(process)
        })
    }
    handleChangeDescription(value) {
        let data = {
            description: value,
            version: this.props.data.version
        };
        API.Update(this.props.idDetail, data, (err, data) => {
            if (err) {
                this.setState({
                    assign_user: !this.state.assign_user,
                });
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    assign_user: !this.state.assign_user,
                });
                Notification("success");
                this.props.reLoad(this.props.idDetail);
            }
        })

    }
    handleRemoveTag() {

    }
    toggleActiveTab(value) {
        this.setState({
            activeTab: value
        })
    }
    sendComment(){
        let data ={
            comment : this.state.comment,
            version : 1
        }
        !ValidInput.isEmpty(this.state.comment)&&
        API.sendComment(this.props.idDetail,data,(err,result)=>{
            if(err){
                Notification("error", "Error", err.data === undefined?  err : err.status + " " + err.data._error_message);
                this.setState({
                    comment : ""
                });
            }else{
                Notification("success");
                this.props.getComment(this.props.idDetail)
                this.setState({
                    comment : ""
                });
            }
        })
        
    }
    setComment(event){
        this.setState({
            comment : event.target.value
        })
    }
    render() {
        return (
            <Card>
                <CardHeader className="card-header-issue-detail">
                    <div className="float-right ">
                        <ChevronLeft className="issue-icon" onClick={this.props.getActivity.bind(this,this.props.idDetail)} />
                        <ChevronRight className="issue-icon" onClick={this.props.getComment.bind(this,this.props.idDetail)} />
                    </div>
                    <CardTitle>
                        <h3 className="card-subtitle text-muted"><code></code>{this.props.data.subject} </h3> <br></br>
                    </CardTitle>
                    <CardSubtitle>
                        {!ValidInput.isEmpty(this.props.data.tags) ?
                            this.props.data.tags.map((value, key) => (
                                <Badge
                                    key={key}
                                    className="badge-pill ml-2"
                                    color="info"
                                >
                                    <label className="mb-0">{value}</label>
                                    &nbsp;
                                        <label
                                            className="mb-0 text-color-orange cursor-pointer"
                                            id={key}
                                            onClick={this.handleRemoveTag.bind(this, 1)}
                                            >
                                                X
                                     </label>
                                </Badge>
                            ))
                            : null}
                    </CardSubtitle>
                </CardHeader>

                <CardBody>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    Description
                            </CardHeader>
                                <Description
                                    description={this.props.data.description_html}
                                    handleSave={this.handleChangeDescription.bind(this)}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-3 row-task">
                        <Col>
                            {/* <Tasks/> */}
                        </Col>
                    </Row>

                    <Row className="mt-3 row-attachments">
                        <Col>
                            <Attachments
                                isLoaded={this.state.isLoaded}
                                progress={this.state.process}
                                data={this.props.dataAttachment}
                                handleRemoveFile={this.handleRemoveFile.bind(this)}
                                handleSelectFile={this.handleUploadFile.bind(this)}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3 row-actions">
                        <Col>
                            <Card>
                                <CardHeader>
                                    <div
                                        className={"float-left " + (this.state.activeTab === "comments" ? "border-bottom font-weight-bold" : "")}
                                        onClick={this.toggleActiveTab.bind(this, "comments")}
                                    >
                                        <a>{this.props.dataComment.length || 0} comments</a>
                                    </div>
                                    <div
                                        className={"ml-3 float-left " + (this.state.activeTab === "activities" ? "border-bottom font-weight-bold" : "")}
                                        onClick={this.toggleActiveTab.bind(this, "activities")}>
                                        <a>{this.props.dataActivity.length || 0} activities</a>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    {
                                        this.state.activeTab === "comments"
                                            ?
                                            <div>
                                                <Comments dataComment ={this.props.dataComment} />
                                                <React.Fragment>
                                                    <div className="overflow-y-20x scrollbar-style-1 scrollbar-width-1x" style={{ maxHeights:  window.screen.height * 0.3, minHeight: 10 }} id="message" >
                                                        {}
                                                    </div>
                                                    <Form >
                                                        <Input type="textarea" placeholder="Your comment in here...." value ={this.state.comment} onChange={this.setComment.bind(this)}/>
                                                        <Button block color="primary"
                                                         className=" mt-3"
                                                         onClick = {this.sendComment.bind(this)}>Comment</Button>
                                                    </Form>
                                                </React.Fragment>
                                            </div>
                                                :
                                            <Activity  dataActivity ={this.props.dataActivity}/>
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>


            </Card>
        )
    }
}
export default Left;