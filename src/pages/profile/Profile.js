import React from "react";
import Notification from "../../components/Notification";
import {
  Col, Container, Row,
} from "reactstrap";
import LoadingSprinner from "../../components/LoadingSprinner"
import ProfDetails from "./profile-details/ProfDetails.js"
import ProfActivities from "./profile-activities/ProfActivities.js"
import {isEmpty} from "../../utils/ValidInput"
import Page404 from "../auth/Page404"
const api = require('./api/api');

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkMainAcc: window.location.search.substring(7, window.location.search.length),
      loadApiGetUser: false,
      notFound : false,
    }

  }

  componentDidMount() {
    api.getUserInfo(this.state.checkMainAcc, (err, result) => {
      if (err) {
        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
      }
      else {
        if(isEmpty(result)) this.setState({notFound : true, loadApiGetUser : true})
        this.setState(
          {
            data: result,
            loadApiGetUser: true,
        });
      }
    });
  }

  render() {
    const url = window.location.search
    if (url.substring(7, url.length) !== this.state.checkMainAcc) window.location.reload();
    return (
      <React.Fragment>
        {((url.substring(0,7) !== "?email=" && url !== "") || url ==="?email=" || this.state.notFound)  ? <Page404/> :
          <React.Fragment>
          { (!this.state.loadApiGetUser) ? <LoadingSprinner/> : 
            <Container fluid className="p-0">
              <React.Fragment>
                <h1 className="h3 mb-3">Profile</h1>
                <Row>
                  <Col md="4" xl="3">
                    <ProfDetails data={this.state.data}/>
                  </Col>
                  <Col md="8" xl="9">
                    <ProfActivities id={this.state.data.id} />
                  </Col>
                </Row>
              </React.Fragment>
            </Container>}
          </React.Fragment> }
      </React.Fragment>
    )
  }
}

export default Profile