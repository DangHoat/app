import React, { Component } from 'react';
import {
  TabContent, TabPane, Nav, NavItem, NavLink,
} from "reactstrap";
import classnames from 'classnames';
import "../Profile.css"
import Timeline from "./Timeline.js"
import Project from "./Project.js"
import Watched from "./Watched.js"
import Contact from "./Contact.js"

class ProfActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 10,
      page: 2,
      status_load: true,
      receiveTimeline: true,
      receiveProject: false,
      receiveWatched: false,
      receiveContact: false,

      activeTab: 'timeline',
    }
  }

  toggle(tab) {
    if(tab==='project'){
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
          receiveTimeline: false,
          receiveProject: true,
          receiveWatched: false,
          receiveContact: false,
        });
      }
    }
    else if(tab==='watched'){
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
          receiveTimeline: false,
          receiveProject: false,
          receiveWatched: true,
          receiveContact: false,
        });
      }
    }
    else if(tab==='contact'){
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
          receiveTimeline: false,
          receiveProject: false,
          receiveWatched: false,
          receiveContact: true,
        });
      }
    }
    else 
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
          receiveTimeline: true,
          receiveProject: false,
          receiveWatched: false,
          receiveContact: false,
        });
      }
  }


  render() {
    return (
      <div>
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'timeline' })}
              onClick={this.toggle.bind(this,'timeline')}
            >
              TimeLine
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'project' })}
              onClick={this.toggle.bind(this,'project')}
            >
              Project
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'watched' })}
              onClick={this.toggle.bind(this,'watched')}
            >
              Watched
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'contact' })}
              onClick={this.toggle.bind(this,'contact')}
            >
              Contact
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="timeline">
            {this.state.receiveTimeline && <Timeline id={this.props.id}/>}
          </TabPane>
          <TabPane tabId="project">
            {this.state.receiveProject && <Project id={this.props.id}/>}
          </TabPane>
          <TabPane tabId="watched">
            
            {this.state.receiveWatched && <Watched id={this.props.id}/>}
          </TabPane>
          <TabPane tabId="contact">
            
            {this.state.receiveContact && <Contact id={this.props.id}/>}
          </TabPane>
         
        </TabContent>
      </div>
    )
  }
}

export default ProfActivities;