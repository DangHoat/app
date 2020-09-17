import React from "react";
import { Link } from "react-router-dom";
import moment from 'moment'
import {
    Button,
    Container,
    Media,
    Form,
    Input
} from "reactstrap";
import { CustomImg, LoadingSprinner } from "./CustomTag";
//img 
const utils = require("../utils/utils");

class ContentComment extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {
            ButtonColor: "primary",
        }
    };

    handleSubmit(e) {
        e.preventDefault();
        let temp = Object.assign({});
        temp["comment"] = this.cmt.value;
        temp["version"] = 1;
        e.target.reset();
        this.props.handleSubmit(temp)
    }
    scrollToBottom() {
        var objDiv = document.getElementById("message");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    //Render noi dung
    render() {
        const height_comment = window.screen.height * 0.3;
        let actions = this.props.dataComment.map((data, index) => {
            const linkUser = `/profile${data.user.pk === utils.getUserId() ? '' : `?username=${data.user.username}`}`;
            return (
                <div key={index}>
                    <Media>
                        {/* img */}
                        <Link to={linkUser} activeclassname="active" className="pt-2 ">
                            <CustomImg
                                key={utils.randomString()}
                                src={data.user.photo}
                                alt="avatar"
                                className="rounded-circle img--user--square-2x mr-2"
                            />
                        </Link>
                        {/* content */}
                        <Media body className="p-1">
                            <React.Fragment>
                                <Link to={linkUser} activeclassname="active" className="Comment___linkto">
                                    <strong>{data.user.name}</strong>
                                </Link>
                                {' '}
                                <span>{moment(data.created_at).format("DD MMM YYYY hh:mm")}</span>
                            </React.Fragment>
                            <br />
                            {data.comment}
                        </Media>
                    </Media>
                    <hr />
                </div>
            );
        })

        return (
            <React.Fragment>
                <div className="overflow-y-20x scrollbar-style-1 scrollbar-width-1x" style={{ maxHeights: height_comment, minHeight: 10 }} id="message" onLoad={this.scrollToBottom}>
                    {actions}
                </div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Input type="textarea" placeholder="Your comment in here...." innerRef={(e) => this.cmt = e} />
                    <Button block color="primary" className=" mt-3">Comment</Button>
                </Form>
            </React.Fragment>
        );
    }
}

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderApi: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataComment !== undefined) {
            this.setState({
                dataComment: nextProps.dataComment,
                isLoaderApi: nextProps.isLoaderApi
            });
        }
    }

    handleSubmit(data_comment) {
        this.props.handleSubmit(data_comment);
    }
    render() {
        return (
            <Container fluid className="p-0">
                {!this.state.isLoaderApi ? <LoadingSprinner /> :
                    <ContentComment
                        handleSubmit={this.handleSubmit.bind(this)}
                        dataComment={this.state.dataComment}
                    />
                }
            </Container>
        );
    }
}

export default Comment;
