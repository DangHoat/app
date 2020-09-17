import React, { Component } from 'react';
import {
  Button, Card, CardBody, Media,
} from "reactstrap";
import Notification from "../../../components/Notification";
import "../Profile.css"
import LoadingSprinner from "../../../components/LoadingSprinner"
import {CustomImg} from "../../../components/CustomTag"
import { Link} from "react-feather"
import moment from 'moment'
import {getUserId} from "../../../utils/utils"
import {isEmpty} from "../../../utils/ValidInput"
const api = require('../api/api')
const apiProject = require('../../project/api/api')

class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state={
            data: [],
            maxLoad: 10,
            // page: 2,
            wikiChangeID: null,
        }
        this.convertDate = this.convertDate.bind(this)
    }
    loadMore(){
        this.setState({ maxLoad: this.state.maxLoad + 10 })
    }
    componentDidMount() {
        this.setState({loadApiGetTimeline: false});
        api.getTimeline(this.props.id/*, 1*/, (err, result) => {
            if (err) {
              Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
              this.setState({ data: result, loadApiGetTimeline: true/*, newPageLength: result.length */})
            }
        })
    }
    wikiChangeMore(id) {
        this.setState({
            wikiChangeID: id
        });
    }
    wikiChangeLess() {
        this.setState({
            wikiChangeID: null
        });
    }
    handleSelectProject(id,type,idCustom){
      apiProject.getInfoProject(id, (err, result)=>{
          if(err){
              Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
          } else {
              localStorage.setItem('project', JSON.stringify(result));
              if(type === 'timeline') window.location.replace("/project/timeline")
              else if(type === 'work') window.location.replace("/project/work")
              else if(type === 'task') window.location.replace("/project/work/task?id="+idCustom)
              else if(type === 'wiki') window.location.replace("/project/wiki")
              else if(type === 'issue') window.location.replace("/project/issue")
              else if(type === 'epic') window.location.replace("/project/epic")
              else if(type === 'members') window.location.replace("/project/clients")
          }
      });
    }
    convertDate(date){
      let convertdate= new Date(date)
      let date_year = convertdate.getFullYear();
      let date_month = convertdate.getMonth()+1;
      let date_date = convertdate.getDate();
      if (date_month < 10) date_month = '0' + date_month;
      if (date_date < 10) date_date = '0' + date_date;
      let data = date_date + '-' + date_month + '-' + date_year;
      console.log(data)
      return data;
    }
    // updateTimeLine() {
    //     this.setState({ page: this.state.page + 1 });
    //     api.getTimeline(this.props.id, this.state.page, (err, result) => {
    //       if (err) {
    //         Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
    //       } else {
    //         this.setState({
    //           maxLoad: this.state.maxLoad + 10
    //         })
    //         let tempdata = this.state.data
    //         for (let i = 0; i < result.length; i++) {
    //           tempdata.push(result[i]);
    //         }
    //         this.setState({
    //           data:tempdata,
    //           newPageLength: result.length
    //         });
    //       }
    //     })
    //   }
    
    render() {
        return (
            <div>
            {!this.state.loadApiGetTimeline ? <LoadingSprinner /> :
            <Card>
              <CardBody className="tiles mb-4" aria-live="polite">
                {this.state.data==='No Content' ? this.state.data : this.state.data.slice(0, this.state.maxLoad).map((data, index) => {
                  //name of user created event
                  const profileUser = <strong><a title={data.data.user.full_name} href={data.data.user.id!==getUserId() ? `?email=${data.data.user.email}` : window.location.pathname}>{data.data.user.full_name}</a></strong>
                  //title of time occur event
                  let convertdate= new Date(data.created_date)
                  let date_year = convertdate.getFullYear();
                  let date_month = convertdate.getMonth()+1;
                  let date_date = convertdate.getDate();
                  if (date_month < 10) date_month = '0' + date_month;
                  if (date_date < 10) date_date = '0' + date_date;
                  let created_date = `${convertdate.toLocaleTimeString().substr(0,5)} ${date_date}/${date_month}/${date_year}`;

                  return (
                  <div key={index}>
                    <Media>
                      {/* avatar */}
                      <Media left href={data.data.user.id !== getUserId() ? `?email=${data.data.user.email}` : window.location.pathname}>
                        <CustomImg
                          src={data.data.user.photo}
                          className="rounded-circle mr-2 img--user--square-3x"
                          title={data.data.user.full_name}
                          alt="Avatar"
                        />
                      </Media>
                      {/* body */}
                      <Media body>
                        {/* content */}
                        <div className="float-left Profile__width_88">
                          <Media>
                            {data.type === "users.user.create" ? 
                            <div >{profileUser} has joined Fwork</div>
                            : data.type === "projects.create" ?
                            <div >{profileUser} created the project <a href='#' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'timeline',null)}>{data.data.project.subject}</a></div>
                            : data.type === "projects.change" ?
                            <div >{profileUser} updated something in the project <a href='#' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'timeline',null)}>{data.data.project.subject}</a></div>
                            : data.type === "projects.delete" ?
                            <div >{profileUser} deleted the project {data.data.project.subject}</div>
                            : data.type === "memberships.create" ?
                            <div >{profileUser} has added a new member to <a href='#' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'timeline',null)}>{data.data.project.subject}</a> project</div>
                            
                            : data.type === "userstories.userstory.create" ?
                            <div >{profileUser} has created a new US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong> in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/timeline`}>{data.data.project.name}</a></strong></div>
                            
                            //
                            : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.new.length>0 ?
                            <div >{profileUser} has uploaded a new attachment in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong></div>
                            : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.status) ?
                            <div >{profileUser} has updated the attribute "Status" of the US <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong> to {data.data.values_diff.status[1]}</div>
                            : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.subject) ?
                            <div >{profileUser} has updated the attribute "Subject" of the US <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong> to {data.data.values_diff.subject[1]}</div>
                            : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.description_diff) ?
                            <div >{profileUser} has updated the attribute "Description" of the US <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong></div>
                            : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.due_date) ?
                            <div >{profileUser} has updated the attribute "Due date" of the US <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong> to {data.data.values_diff.due_date[1] === null ? `not set` : data.data.values_diff.due_date[1]}</div>
                            : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.assigned_users) ?
                            <div >{profileUser} has updated the attribute "Assigned users" of the US <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong> to {data.data.values_diff.assigned_users[1]}</div>
                            : data.type === "userstories.userstory.change" ?
                            <div >{profileUser} has updated something in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/us/${data.data.userstory.ref}`}>#{data.data.userstory.ref} {data.data.userstory.subject}</a></strong></div>
                            : data.type === "userstories.userstory.delete" ?
                            <div >{profileUser} has deleted the US <strong>#{data.data.userstory.ref} {data.data.userstory.subject}</strong></div>

                            : data.type === "issues.issue.create" ?
                            <div >{profileUser} has created a new issue <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/issue/${data.data.issue.ref}`}>#{data.data.issue.ref} {data.data.issue.subject}</a></strong> in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/timeline`}>{data.data.project.name}</a></strong></div>
                            
                            //
                            : data.type === "issues.issue.change" && !isEmpty(data.data.values_diff.subject) ?
                            <div >{profileUser} has updated the attribute "Subject" of the issue <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/issue/${data.data.issue.ref}`}>#{data.data.issue.ref} {data.data.issue.subject}</a></strong> to {data.data.values_diff.subject[1]}</div>
                            : data.type === "issues.issue.change" && !isEmpty(data.data.values_diff.description_diff) ?
                            <div >{profileUser} has updated the attribute "Description" of the issue <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/issue/${data.data.issue.ref}`}>#{data.data.issue.ref} {data.data.issue.subject}</a></strong></div>
                            : data.type === "issues.issue.change" && !isEmpty(data.data.values_diff.due_date) ?
                            <div >{profileUser} has updated the attribute "Due date" of the issue <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/issue/${data.data.issue.ref}`}>#{data.data.issue.ref} {data.data.issue.subject}</a></strong> to {data.data.values_diff.due_date[1] === null ? `not set` : data.data.values_diff.due_date[1]}</div>
                            : data.type === "issues.issue.change" && !isEmpty(data.data.values_diff.assigned_to) ?
                            <div >{profileUser} has updated the attribute "Assigned to" of the issue <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/issue/${data.data.issue.ref}`}>#{data.data.issue.ref} {data.data.issue.subject}</a></strong> to {data.data.values_diff.assigned_to[1]}</div>
                            : data.type === "issues.issue.change" ?
                            <div >{profileUser} has updated something of the issue <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/issue/${data.data.issue.ref}`}>#{data.data.issue.ref} {data.data.issue.subject}</a></strong> in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/timeline`}>{data.data.project.name}</a></strong></div>

                            : data.type === "issues.issue.delete" ?
                            <div >{profileUser} has deleted the issue <strong>#{data.data.issue.ref} {data.data.issue.subject}</strong> in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/timeline`}>{data.data.project.name}</a></strong></div>
                            : data.type === "tasks.task.create" ?
                            <div >{profileUser} has created a new task <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}-${data.data.task.userstory.ref}/task/${data.data.task.ref}`}>#{data.data.task.ref} {data.data.task.subject}</a></strong> in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/timeline`}>{data.data.project.name}</a></strong> which belongs to the US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.task.userstory.ref}`}>#{data.data.task.userstory.ref} {data.data.task.userstory.subject}</a></strong></div>

                            //
                            : data.type === "tasks.task.change" && !isEmpty(data.data.values_diff.subject)?
                            <div >{profileUser} has updated the attribute "Subject" of the task <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}-${data.data.task.userstory.ref}/task/${data.data.task.ref}`}>#{data.data.task.ref} {data.data.task.subject}</a></strong> which belongs to the US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.task.userstory.ref}`}>#{data.data.task.userstory.ref} {data.data.task.userstory.subject}</a></strong> to {data.data.values_diff.subject[1]}</div>
                            : data.type === "tasks.task.change" && !isEmpty(data.data.values_diff.description_diff)?
                            <div >{profileUser} has updated the attribute "Description" of the task <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}-${data.data.task.userstory.ref}/task/${data.data.task.ref}`}>#{data.data.task.ref} {data.data.task.subject}</a></strong> which belongs to the US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.task.userstory.ref}`}>#{data.data.task.userstory.ref} {data.data.task.userstory.subject}</a></strong></div>
                            : data.type === "tasks.task.change" && !isEmpty(data.data.values_diff.due_date)?
                            <div >{profileUser} has updated the attribute "Due date" of the task <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}-${data.data.task.userstory.ref}/task/${data.data.task.ref}`}>#{data.data.task.ref} {data.data.task.subject}</a></strong> which belongs to the US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.task.userstory.ref}`}>#{data.data.task.userstory.ref} {data.data.task.userstory.subject}</a></strong> to {data.data.values_diff.due_date[1] == null ? `not set` : data.data.values_diff.due_date[1]}</div>
                            : data.type === "tasks.task.change" && !isEmpty(data.data.values_diff.assigned_to)?
                            <div >{profileUser} has updated the attribute "Assigned to" of the task <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}-${data.data.task.userstory.ref}/task/${data.data.task.ref}`}>#{data.data.task.ref} {data.data.task.subject}</a></strong> which belongs to the US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.task.userstory.ref}`}>#{data.data.task.userstory.ref} {data.data.task.userstory.subject}</a></strong> to {data.data.values_diff.assigned_to[1]}</div>
                            : data.type === "tasks.task.change" ?
                            <div >{profileUser} has updated something of the task <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}-${data.data.task.userstory.ref}/task/${data.data.task.ref}`}>#{data.data.task.ref} {data.data.task.subject}</a></strong> which belongs to the US <strong><a href={`${window.location.origin}/project/${data.data.user.username}-${data.data.project.name}/us/${data.data.task.userstory.ref}`}>#{data.data.task.userstory.ref} {data.data.task.userstory.subject}</a></strong></div>

                            : data.type === "wiki.wikipage.create" ?
                            <div >{profileUser} has created a new wiki <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/wiki/${data.data.wikipage.slug}`}>{data.data.wikipage.slug}</a></strong></div>

                            : (data.type === "wiki.wikipage.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.new.length>0) ?
                            <div >{profileUser} has uploaded a new attachment in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/wiki/${data.data.wikipage.slug}`}>{data.data.wikipage.slug}</a></strong></div>
                            : (data.type === "wiki.wikipage.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.changed.length>0) ?
                            <div >{profileUser} has updated a attachment in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/wiki/${data.data.wikipage.slug}`}>{data.data.wikipage.slug}</a></strong></div>
                            : (data.type === "wiki.wikipage.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.deleted.length>0) ?
                            <div >{profileUser} has deleted a attachment in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/wiki/${data.data.wikipage.slug}`}>{data.data.wikipage.slug}</a></strong></div>
                            : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.content_diff)) ?
                            <div >{profileUser} has changed description of <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/wiki/${data.data.wikipage.slug}`}>{data.data.wikipage.slug}</a></strong></div>

                            : data.type === "wiki.wikipage.delete" ?
                            <div >{profileUser} has deleted the wiki <strong>{data.data.wikipage.slug}</strong></div>

                            : data.type === "epics.epic.create" ?
                            <div >{profileUser} has created a new epic <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/epic/${data.data.epic.ref}`}>#{data.data.epic.ref} {data.data.epic.subject}</a></strong> in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/timeline`}>{data.data.project.name}</a></strong></div>

                            : (data.type === "epics.epic.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.new.length>0) ?
                            <div >{profileUser} has uploaded a new attachment in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/epic/${data.data.epic.ref}`}>#{data.data.epic.ref} {data.data.epic.subject}</a></strong></div>
                            : (data.type === "epics.epic.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.changed.length>0) ?
                            <div >{profileUser} has updated a attachment in <strong><a href={`${window.location.origin}/project/${data.data.project.slug}/epic/${data.data.epic.ref}`}>#{data.data.epic.ref} {data.data.epic.subject}</a></strong></div>
                            : (data.type === "epics.epic.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.deleted.length>0) ?
                            <div >{profileUser} has deleted a attachment in<strong><a href={`${window.location.origin}/project/${data.data.project.slug}/epic/${data.data.epic.ref}`}>#{data.data.epic.ref} {data.data.epic.subject}</a></strong></div>

                            : data.type === "epics.epic.delete" ?
                            <div >{profileUser} has deleted the epic <strong>#{data.data.epic.ref} {data.data.epic.subject}</strong></div>
                            : null
                            }
                          </Media>
                        </div>
                        {/* time */}
                        <div className="float-right" title={created_date}>
                          {moment(new Date(data.created_date)).fromNow()}
                        </div>
                      </Media>
                    </Media>
                    <div className="Profile__marginleft_58px_toRem">
                    { data.type === "projects.create" ?
                      <div><blockquote className="Profile__activity-comment-quote">{data.data.project.description}</blockquote></div>
                      : data.type === "projects.membership.create" ?
                      <div>
                        <blockquote className="Profile__activity-comment-quote">
                          <div className="float-left">
                            <Media left href={data.data.user.id!==getUserId() ? `?email=${data.data.user.email}` : window.location.pathname}>
                            <CustomImg
                              src={data.data.user.photo}
                              className="rounded-circle mr-2 img--user--square-3x"
                              title={`@${data.data.user.username}`}
                              alt="Avatar"
                            />
                            </Media>
                          </div>
                          <Media heading>
                            <a title={data.data.user.name} href={data.data.user.id!==getUserId() ? `?email=${data.data.user.email}` : window.location.pathname}>{data.data.user.name}</a>
                          </Media>
                          <Media>{data.data.role.name}</Media>
                        </blockquote>
                      </div>
                      : data.type === "userstories.userstory.change" && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.new.length>0 ?
                          data.data.values_diff.attachments.new.map((attachNew,index)=>(
                            <div key={index}><blockquote className="Profile__activity-comment-quote">{attachNew.thumb_url!==null ? <a title={`See ${attachNew.filename}`} target="_blank" href={attachNew.url}><CustomImg src={attachNew.thumb_url}/></a> : <div><div>{attachNew.description}</div><a title={`Click to download ${attachNew.filename}`} target="_blank" href={attachNew.url}><Link size="2%"/>{` ${attachNew.filename}`}</a></div>}</blockquote></div>
                          ))
                      : data.type === "issues.issue.change" ?
                      null
                      : data.type === "tasks.task.change" ?
                      null
                      : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.new.length>0) ?
                          data.data.values_diff.attachments.new.map((attachNew,index)=>(
                            <div key={index}><blockquote className="Profile__activity-comment-quote">{attachNew.thumb_url!==null ? <a title={`See ${attachNew.filename}`} target="_blank" href={attachNew.url}><CustomImg src={attachNew.thumb_url}/></a> : <div><div>{attachNew.description}</div><a title={`Click to download ${attachNew.filename}`} target="_blank" href={attachNew.url}><Link size="2%"/>{` ${attachNew.filename}`}</a></div>}</blockquote></div>
                          ))
                      : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.changed.length>0) ?
                      <div><blockquote className="Profile__activity-comment-quote">{data.data.values_diff.attachments.changed[0].thumb_url!==null ? <a title={`See ${data.data.values_diff.attachments.changed[0].filename}`} target="_blank" href={data.data.values_diff.attachments.changed[0].url}><CustomImg src={data.data.values_diff.attachments.changed[0].thumb_url}/></a> : <div><div><del style={{background: '#ffe6e6'}}>{data.data.values_diff.attachments.changed[0].changes.description[0]}</del><ins style={{background: '#e6ffe6'}}>{data.data.values_diff.attachments.changed[0].changes.description[1]}</ins></div><a title={`Click to download ${data.data.values_diff.attachments.changed[0].filename}`} target="_blank" href={data.data.values_diff.attachments.changed[0].url}><Link size="2%"/>{` ${data.data.values_diff.attachments.changed[0].filename}`}</a></div>}</blockquote></div>
                      : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.deleted.length>0) ?
                      <div><blockquote className="Profile__activity-comment-quote"><del style={{background: '#ffe6e6'}}><Link size="2%"/>{data.data.values_diff.attachments.deleted[0].filename}</del></blockquote></div>
                      : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.content_diff) && data.data.values_diff.content_diff[1].length>500 && this.state.wikiChangeID !== data.id) ?
                      <div><blockquote className="Profile__activity-comment-quote"><p dangerouslySetInnerHTML={{ __html: data.data.values_diff.content_diff[1].slice(0,500) }} /><div onClick={this.wikiChangeMore.bind(this,data.id)} className="TextColor">See more</div></blockquote></div>
                      : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.content_diff) && data.data.values_diff.content_diff[1].length>500 && this.state.wikiChangeID === data.id) ?
                      <div><blockquote className="Profile__activity-comment-quote"><p dangerouslySetInnerHTML={{ __html: data.data.values_diff.content_diff }} /><div onClick={this.wikiChangeLess.bind(this)} className="TextColor">Hide less</div></blockquote></div>
                      : (data.type === "wiki.wikipage.change" && !isEmpty(data.data.values_diff.content_diff)) ?
                      <div><blockquote className="Profile__activity-comment-quote"><p dangerouslySetInnerHTML={{ __html: data.data.values_diff.content_diff[1] }} /></blockquote></div>



                      : (data.type === "epics.epic.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.new.length>0) ?
                          data.data.values_diff.attachments.new.map((attachNew,index)=>(
                            <div key={index}><blockquote className="Profile__activity-comment-quote">{attachNew.thumb_url!==null ? <a title={`See ${attachNew.filename}`} target="_blank" href={attachNew.url}><CustomImg src={attachNew.thumb_url}/></a> : <div><div>{attachNew.description}</div><a title={`Click to download ${attachNew.filename}`} target="_blank" href={attachNew.url}><Link size="2%"/>{` ${attachNew.filename}`}</a></div>}</blockquote></div>
                          ))
                      : (data.type === "epics.epic.change"  && !isEmpty(data.data.values_diff.attachments) && data.data.values_diff.attachments.deleted.length>0) ?
                      <div><blockquote className="Profile__activity-comment-quote"><del style={{background: '#ffe6e6'}}><Link size="2%"/>{data.data.values_diff.attachments.deleted[0].filename}</del></blockquote></div>

                      : null
                    }</div>
                    <hr />
                  </div>
                )}
                )}
                {/* {this.state.maxLoad < this.state.data.length ? <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>
                  : this.state.newPageLength === 30 ?
                    <Button block color="primary" className="load-more" onClick={this.updateTimeLine.bind(this)}>Load More</Button>
                  :
                  null
                } */}
                {this.state.maxLoad < this.state.data.length && <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>}
              </CardBody>
            </Card>}
            </div>
        );
    }
}
export default Timeline;