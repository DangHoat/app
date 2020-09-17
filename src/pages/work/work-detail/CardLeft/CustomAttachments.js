import React, { Component } from 'react';
import { Attachments, Notification } from "../../../../components/CustomTag";

const api = require("../api/api");
const utils = require("../../../../utils/utils");
const work_id = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;


class CustomAttachments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            percentage: 0,
            data: [],
            changeFile: null,
        }
    }

    componentDidMount() {
        api.getAttachmentsOfWork(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    data: result,
                    isLoaded: true
                })
            }
        })
    }

    handleRemoveFile(id) {
        api.removeAttachments(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                Notification("success");
                let data = utils.copyState(this.state.data);
                let index = data.findIndex({ id: id });
                data.splice(index, 1);
                this.setState({ data: data });
            }
        })
    }

    handleUploadFile(id) {
        let that = this;
        var listFile = utils.copyState(this.state.data)
        api.postAttachments(work_id, id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                listFile.push(result);
                this.setState({
                    data: listFile
                })
                Notification("success");
            }
        }
            , (process) => {
                this.setState({
                    percentage: process
                });
            })
    }
    render() {
        const { memberInProject } = this.props;
        return (
            <Attachments
                isLoaded={this.state.isLoaded}
                progress={this.state.percentage}
                data={this.state.data}
                memberInProject={memberInProject}
                handleRemoveFile={this.handleRemoveFile.bind(this)}
                handleSelectFile={this.handleUploadFile.bind(this)}
            />
        )
    }
}

export default CustomAttachments;