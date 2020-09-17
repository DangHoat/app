import React, { Component } from 'react';
import {
  Button, Card, CardBody, Media,
} from "reactstrap";
import Notification from "../../../components/Notification";
import "../Profile.css"
import LoadingSprinner from "../../../components/LoadingSprinner"
import {CustomImg} from "../../../components/CustomTag"
import {getUserId} from "../../../utils/utils"
import {isEmpty} from "../../../utils/ValidInput"
const api = require('../api/api')

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoad: 10,
            listContact: []
        }
    }
    loadMore(){
        this.setState({ maxLoad: this.state.maxLoad + 10 })
    }
    componentDidMount() {
        this.setState({loadApiGetContact: false});
        api.getContacts(this.props.id,(err,result) => {
            if (err) {
              Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
              this.setState({listContact: result, loadApiGetContact: true});
            }
        })
    }
    
    render() {
        return (
            <div>
            {!this.state.loadApiGetContact ? <LoadingSprinner/> :
            <Card>
                <CardBody className="tiles mb-4" aria-live="polite">
                {this.state.listContact.slice(0,this.state.maxLoad).map((data,index)=>(
                    <div key={index}>
                        <Media>
                            <Media left href={data.id !== getUserId() ? `?email=${data.email}` : window.location.pathname}>
                                <CustomImg
                                    src={data.photo}
                                    className="rounded-circle mr-2 img--user--square-3x"
                                    title={data.full_name}
                                    alt="Avatar"
                                />
                            </Media>
                            <Media body>
                                <Media>
                                    <strong className="pr-1">Name:</strong>
                                    <a className="text-primary" title={data.full_name} href={data.id !== getUserId() ? `?email=${data.email}` : window.location.pathname} >
                                        {data.full_name}
                                    </a>
                                </Media>
                                <strong>Email:</strong> {data.email}
                                {!isEmpty(data.phone_number) && <div><strong>Mobile:</strong> {data.phone_number}<br/></div>}
                                {!isEmpty(data.roles) && <div><strong>Roles:</strong> {data.roles.join(', ')}<br/></div>}
                            </Media>
                        </Media>
                        <hr/>
                    </div>
                ))}
                {this.state.maxLoad < this.state.listContact.length && <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>}
                </CardBody>
          </Card>}
          </div>
        );
    }
}
export default Contact;