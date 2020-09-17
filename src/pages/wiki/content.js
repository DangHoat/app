import React, { Component } from 'react';
import { CustomImg, LoadingSprinner, Attachments, Description } from '../../components/CustomTag'
import {
    Card, CardBody, CardHeader, CardTitle,
    Button,
    Media,
    Col, Row,
} from 'reactstrap'
import moment from 'moment';
import './Wiki.css'
const ValidInput = require("../../utils/ValidInput")
const utils = require("../../utils/utils")
class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showfullhis: null,
            showmore: false,

        }
        this.ShowFullHis = this.ShowFullHis.bind(this)
    }
    LoadMore(){
        this.setState({ number: this.state.number + 5 })
        if(this.props.history.length<this.state.number){

        }
    }
    ShowFullHis(e) {
        this.setState({
            showfullhis: e,

        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ number: 5});
    }


    render() {
        return (
            <div>
                <Card>
                    <CardHeader className="colorheader">
                        <CardTitle tag="h5" className="mb-0">
                            Activities
            </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {this.props.isLoad && this.props.openHis ? <LoadingSprinner /> :
                            this.props.history.map((val, key) => {
                                if ( key< this.state.number) {
                                    if (ValidInput.isEmpty(val.diff.attachments)===false) {
                                        if(val.diff.attachments[0][0]===null){
                                            return (
                                                <div key={utils.randomString(20)}>
                                                    <Media>
                                                        <CustomImg
                                                            src={val.user.photo}
                                                            className="rounded-circle mr-2 img--user--square-3x"
                                                            alt={val.user.full_name}
                                                        />
                                                        <Media body>
                                                            <small className="float-right text-navy">{moment(new Date(val.created_date)).fromNow()}</small>
                                                            <strong>{val.user.full_name + " :"}</strong>
                                                            <strong>Tạo mới file có tên :</strong>
                                                            {(<p dangerouslySetInnerHTML={{ __html: val.diff.attachments[1][0].subject}} />)}{" "}
                                                        </Media>
                                                    </Media>
                                                    <hr />
                                                </div>
                                            );
                                        }
                                        else{
                                            return (
                                                <div key={utils.randomString(20)}>
                                                    <Media>
                                                        <CustomImg
                                                            src={val.user.photo}
                                                            className="rounded-circle mr-2 img--user--square-3x"
                                                            alt={val.user.full_name}
                                                        />
                                                        <Media body>
                                                            <small className="float-right text-navy">{moment(new Date(val.created_date)).fromNow()}</small>
                                                            <strong>{val.user.full_name + " :"}</strong>
                                                            <strong>Xóa File :</strong>
                                                            {(<p dangerouslySetInnerHTML={{ __html: val.diff.attachments[0][0].subject}} />)}{" "}
                                                        </Media>
                                                    </Media>
                                                    <hr />
                                                </div>
                                            );

                                        }
                                      
                                    }
                                        if(ValidInput.isEmpty(val.diff.content)===false){
                                            if (val.diff.content[1].length > 255 && this.state.showfullhis !== val.id) {
                                                return (
                                                    <div key={utils.randomString(20)}>
                                                        <Media>
                                                        <CustomImg
                                                            src={val.user.photo}
                                                            className="rounded-circle mr-2 img--user--square-3x"
                                                            alt={val.user.full_name}
                                                        />
                                                            <Media body>
                                                                <small className="float-right text-navy">{moment(new Date(val.created_date)).fromNow()}</small>
                                                                <strong>{val.user.full_name + " : Đã thay đổi Description Của Wiki thành"}</strong>
                                                                <p dangerouslySetInnerHTML={{ __html: val.diff.content[1].slice(0, 255) }} />
                                                                <div onClick={this.ShowFullHis.bind(this, val.id)} className="TextColor">Xem thêm</div>
                                                            </Media>
                                                        </Media>
                                                        <hr />
                                                    </div>
                                                );
                                            }
                                            else if ((val.diff.content[1].length > 255) && (this.state.showfullhis === val.id)) {
                                                return (
                                                    <div key={utils.randomString(20)}>
                                                        <Media>
                                                        <CustomImg
                                                            src={val.user.photo}
                                                            className="rounded-circle mr-2 img--user--square-3x"
                                                            alt={val.user.full_name}
                                                        />
                                                            <Media body>
                                                                <small className="float-right text-navy">{moment(new Date(val.created_date)).fromNow()}</small>
                                                                <strong>{val.user.full_name + " : Đã thay đổi Description Của Wiki thành"}</strong>
                                                                 {<p dangerouslySetInnerHTML={{ __html: val.diff.content[1] }} />}{" "}
    
                                                            </Media>
                                                        </Media>
    
                                                        <hr />
                                                    </div>
                                                );
                                            }
                                            else {
                                                return (
                                                    <div key={utils.randomString(20)}>
                                                        <Media>
                                                        <CustomImg
                                                            src={val.user.photo}
                                                            className="rounded-circle mr-2 img--user--square-3x"
                                                            alt={val.user.full_name}
                                                        />
                                                            <Media body>
                                                                <small className="float-right text-navy">{moment(new Date(val.created_date)).fromNow()}</small>
                                                                <strong>{val.user.full_name + " : Đã thay đổi Description Của Wiki thành"}</strong>
                                                                 {<p dangerouslySetInnerHTML={{ __html: val.diff.content[1] }} />}{" "}
    
                                                            </Media>
                                                        </Media>
    
                                                        <hr />
                                                    </div>
                                                );
                                            }
                                        }
                                    

                                    // }
                                }

                                return null;
                            })}
                        { this.props.history.length<this.state.number?null:this.props.isLoadMore && <Button onClick={this.LoadMore.bind(this)} color="primary" block>
                            Load More  </Button>}
                    </CardBody>
                </Card>
            </div>
        );
    }
}


class ListFile extends Component {

    handleRemoveFile(id) {
        this.props.DeleteFile(id)
    }

    handleUploadFile(file) {
        this.props.AddFile(file)
    }
    render() {
        return (
            <div>
                <Attachments
                    isLoaded={!this.props.isLoad}
                    progress={this.props.progress}
                    data={this.props.ListFile}
                    handleRemoveFile={this.handleRemoveFile.bind(this)}
                    handleSelectFile={this.handleUploadFile.bind(this)}
                />
            </div>
        );
    }
}


class content extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            ShowDes: false,
            wikiName: this.props.wikiName,
        })

    }

    handleChangeDescription(description) {
        if (description !== this.state.description) {
            this.props.EditWiki(description);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            description:nextProps.description,
        })
    }
    render() {
        var username = this.props.username
        return (

            <Card>
                <CardHeader className="colorheader">
                    <CardTitle className="mb-0">
                        <h4> {this.props.wikiName} </h4> <br></br>

                        <h6 className="card-subtitle text-muted">
                            Created by : {username}
                        </h6>
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    {this.props.isLoad && this.props.openDes ? <LoadingSprinner /> :
                        !this.state.ShowDes && this.props.openDes ?
                            <Row>
                                <Col>
                                    <Description
                                        isLoaded={false}
                                        description={this.state.description}
                                        handleSave={this.handleChangeDescription.bind(this)}
                                    />
                                </Col>
                            </Row> :
                            <Card className="card-attachments">

                                <CardBody className="overflow-y-20x scrollbar-style-1 scrollbar-width-1x">
                                    <br />
                                    <br />
                                    <br />

                                </CardBody>
                            </Card>
                    }
                    <Row className="mt-3 row-attachments">
                        <Col>
                            <ListFile progress={this.props.progress}isLoad={this.props.isLoadFile} ListFile={this.props.listFile} AddFile={this.props.AddFile.bind(this)} DeleteFile={this.props.DeleteFile.bind(this)} />
                        </Col>
                    </Row>
                    <History openHis={this.props.openDes} isLoad={this.props.isLoadHis} isLoadMore={this.props.isLoadMore} history={this.props.history} />

                </CardBody>
            </Card>

        );
    }
}

export default content;