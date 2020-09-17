import React from "react";
import { Link } from "react-router-dom";
import Notification from "../../components/Notification"
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import {
  Container,
  Button,
  Card, CardBody, CardHeader, CardTitle,
  Col, Row,
  Media
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey , faGlobeAmericas } from "@fortawesome/free-solid-svg-icons";
import {CustomImg, LoadingSprinner} from "../../components/CustomTag";
import "./Timeline.css"; 

const api = require("./api/api");
const utils = require("../../utils/utils");

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    const {dataInfoProject} = this.props;
    this.toggle = this.toggle.bind(this);
    this.state = {
      dataInfoProject: dataInfoProject,
      tooltipOpen: false
    }
  }
  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  render() {
    let project = this.state.dataInfoProject.map((data, index) => {
      let member = data.members;
      return(  
        <Card key={index}>
          <CardHeader>
            <CardTitle tag="h5" className="mb-0">
              Project Details 
            </CardTitle>
          </CardHeader>
          <CardBody className="text-center">
            <CustomImg
                key={utils.randomString()}
                src={data.logo_big_url}
                alt="avatar"
                className="rounded-circle img--user--square-7x"
            />
            <CardTitle tag="h5" className="m-1">
              {data.name}<FontAwesomeIcon icon={data.is_private === true ? faKey: faGlobeAmericas}  className="ml-1" />
            </CardTitle>
            <div className="text-muted mb-1"></div>
              {data.description}
          </CardBody>
          <hr className="my-0" />
          <CardBody>
            <CardTitle tag="h5">Team {"("+member.length+")"}</CardTitle>
            {member.map((img, index) => {    
              const linkUser = `/profile${ img.id === data.id_user ? '' : `?username=${img.username}`}`; 
              return (
                <React.Fragment key={index}>
                  <Link  to={linkUser} activeclassname="active">
                    <CustomImg
                        key={utils.randomString()}
                        src={img.photo}
                        alt="avatar"
                        className={
                          img.id === data.owner.id
                          ?
                          "rounded-circle mr-2 mt-2 rounded-circle border border-success img--user--square-2x"
                          :
                          "rounded-circle mr-2 mt-2 img--user--square-2x"
                        }
                        data-for='img'
                        data-tip={img.full_name}
                        title = {img.full_name}
                    />
                    <ReactTooltip id='img'></ReactTooltip>
                  </Link>
                  </React.Fragment>
                );
            })}      
          </CardBody>
          <hr className="my-0" />
          <CardBody>
            <CardTitle tag="h5">Description</CardTitle>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                Date created{" "}
                <Link to="/dashboard/default" className="Timeline___linkto">{moment(data.created_date).format('DD-MM-YYYY')}</Link>
              </li>
            </ul>
          </CardBody>
          <hr className="my-0" />
        </Card>
      );
    })
    return (
      <React.Fragment>
        {project}
      </React.Fragment>
    );
  }
}

class Activities extends React.Component {
    constructor(props) {
        super(props);
        const {dataTimeline} = this.props;
        this.state = {
            dataTimeline: dataTimeline,
            max : 10,
            page : 2,
            status_load: true
        }
        this.handerUpdate= this.handerUpdate.bind(this)
    }
    
    // ham load them du lieu tu API
    handerUpdate() {
      const that = this;
      this.setState({page :this.state.page + 1 });
      api.getActivities(this.state.page,(err, result)=>{
          if(err){
              this.setState({status_load: false})
          } else{
              this.setState({status_load: true})
              that.setState({max: this.state.max + 10});
              let state = Object.assign({}, that.state);
              for(let i=0;i<result.length; i++){
                state.dataTimeline.push(result[i])
              }
              that.setState(state);
          }
      })  
    }
    //xu li API
    renderDataEventType(data) {
        switch(data.event_type) {
          case 'userstories.userstory.create':
              return (
              <React.Fragment>
                  has created a new US {" "}
                  <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                  {"#"+data.data.userstory.ref+" "+data.data.userstory.subject }
                  </Link> 
                  {" "} in {" "}
                  <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                  {data.data.project.name}
                  </Link>   
              </React.Fragment> 
              );
          case 'userstories.userstory.change':
              return (
              <React.Fragment>
                  has updated the attribute {" "}
                  {data.data.values_diff.assigned_users ===  undefined ? null : 
                  <React.Fragment>
                      "Assigned users" of the US {" "}
                      <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                      {"#"+data.data.userstory.ref+" "+data.data.userstory.subject }
                      </Link>
                      {" "} to {data.data.values_diff.assigned_users[1]}
                  </React.Fragment> 
                  }
                  {data.data.values_diff.subject ===  undefined ? null : 
                  <React.Fragment>
                      "Subject" of the US {" "}
                      <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                      {"#"+data.data.userstory.ref+" "+data.data.userstory.subject }
                      </Link>
                      {" "} from {" "+ data.data.values_diff.subject[0]} to {data.data.values_diff.subject[1]}
                  </React.Fragment> 
                  }
                  {data.data.values_diff.status ===  undefined ? null : 
                  <React.Fragment>
                      "Status" of the US {" "}
                      <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                      {"#"+data.data.userstory.ref+" "+data.data.userstory.subject }
                      </Link>
                      {" "} from {" "+ data.data.values_diff.status[0]} to {data.data.values_diff.status[1]}
                  </React.Fragment> 
                  }
                  {data.data.values_diff.due_date ===  undefined ? null : 
                  <React.Fragment>
                      "Due date" of the US {" "}
                      <Link to={'#'} activeclassname="active" className="Timeline___linkto" >
                      {"#"+data.data.userstory.ref+" "+data.data.userstory.subject }
                      </Link>
                      {" "} from {" "+ data.data.values_diff.due_date[0]} to {data.data.values_diff.due_date[1]}
                  </React.Fragment> 
                  }
              </React.Fragment> 
              );
          case 'tasks.task.create':
              return (
              <React.Fragment>
                  has created a new task {" "}
                  <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                  {"#"+data.data.task.ref+" "+data.data.task.subject }
                  </Link> 
                  {" "} in {" "}
                  <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                  {data.data.project.name}
                  </Link>
                  {" "} which belongs to the US  {" "} 
                  <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                  {"#"+data.data.task.userstory.ref+" "+data.data.task.userstory.subject }
                  </Link> 
              </React.Fragment> 
              );
          case 'tasks.task.change':
              return (
              <React.Fragment>
                  has updated the attribute {" "}
                  {/* {data.data.values_diff.assigned_users ===  undefined ? null : ' "Assigned users" of the ' } */}
                  {data.data.values_diff.subject ===  undefined 
                  ? 
                  null 
                  : 
                  <React.Fragment>
                      "Subject" of the task {" "}
                      <Link to={'#'} activeclassname="active" className="Timeline___linkto">
                      {"#"+data.data.task.ref+" "+data.data.task.subject}
                      </Link>
                      {" "} from {" "+ data.data.values_diff.subject[0]} to {data.data.values_diff.subject[1]}
                  </React.Fragment> 
                  }
              </React.Fragment> 
              );
          case 'projects.membership.create':
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
          let actions = this.state.dataTimeline.slice(0,this.state.max).map((data, index) => {   
          const linkUser = `/profile${ data.data.user.id === utils.getUserId() ? '' : `?username=${data.data.user.username}`}`; 
          return (
            <div key={index}>
              <Media>
                <Link  to={linkUser} activeclassname="active">
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
                    <Link to={linkUser}  className="Timeline___linkto"><strong >{data.data.user.name}</strong></Link>
                    {" "}
                    {this.renderDataEventType(data)}
                    <br/>
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
                    {this.state.max < this.state.dataTimeline.length ? <Button block color="primary" className="load-more"  onClick={() => this.setState({max : this.state.max + 10})}>Load More</Button>
                    :
                    this.state.status_load === true && this.state.dataTimeline.length > 10
                    ?
                    <Button block color="primary" className="load-more"  onClick={() =>  this.handerUpdate()  }>Load More</Button>                   
                    :
                    null 
                    }
                </CardBody>
            </Card>
        );
    }
}

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderAPI_Activities: false,
            isLoaderAPI_InfoProject: false
        };
    }
    componentWillMount() {
        const that = this;
        api.getActivities(1,(err, result)=>{
          if(err){
            Notification("error", "Error", err);
          } else{
              that.setState({
                dataTimeline: result,
                isLoaderAPI_Activities: true
            });
          }
        })
        api.getInfoProject((err, result)=>{
            if(err){
              Notification("error", "Error", err);
            } else{
              that.setState({
                dataInfoProject: result,
                isLoaderAPI_InfoProject: true});
            }
        })    
    }
    render() {  
        return (
            <Container fluid className="p-0">
                <h1 className="h3 mb-3">Timeline</h1>
                <Row>
                    <Col md="8" xl="9">
                    {!this.state.isLoaderAPI_Activities ? <LoadingSprinner/> : <Activities dataTimeline={this.state.dataTimeline}/>}
                    </Col>
                    <Col md="4" xl="3">
                    {!this.state.isLoaderAPI_InfoProject ? <LoadingSprinner/> : <ProjectDetails dataInfoProject={this.state.dataInfoProject}/>}
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default Timeline;
