import React from "react";
import {NavLink} from "react-router-dom";
import "./Term.css";
import data from "./TermContent.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import logo from "../../assets/img/logo/logo.png";
import {Col} from "reactstrap";
import Wrapper from "../../components/Wrapper";
import Main from "../../components/Main";
import { CustomImg } from "../../components/CustomTag";

const utils = require("../../utils/utils")

class SidebarItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <li className="sidebar-item position-relative d-inline-block">
                <div className="text-white modal-body rounded" onClick={this.dropdownSubitem}>
                    <NavLink to={this.props.to} className="sidebar-link p-1" activeClassName="active bg-black" onClick={this.props.toggle.bind(this, "isOpenTaskbar")}>
                        {this.props.icon ? <FontAwesomeIcon icon={this.props.icon} className="align-middle mr-3" size="lg"/> : null}
                        {this.props.name}                      
                    </NavLink>
                </div>
            </li>
        );
    }
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <nav
                className={
                    "Term__sidebar d-lg-none bg-dark" +
                    (this.props.isOpenTaskbar ? " Term__sidebar-toggled" : "") 
                }
            >
                <div className="sidebar-content">
                    <a className="sidebar-brand" href="/">
                        <CustomImg src={logo} alt="avatar" className="width-percent-70"/>
                    </a>

                    <ul className="sidebar-nav">
                        <React.Fragment>
                            {
                                data.map((value, key) => {
                                    return (
                                        <SidebarItem
                                            key={utils.randomString()}
                                            name={value.name}
                                            icon={value.icon}
                                            to={value.to}
                                            sub={value.sub}
                                            toggle={this.props.toggle}
                                        />
                                    )
                                })
                            }
                        </React.Fragment>
                    </ul>
                </div>
            </nav>
        );
    }
}

class TermContent extends React.Component {
    handleHover(position) {
        this.props.handleHover(position)
    }

    render() {
        return (
            <div onMouseOver= {this.handleHover.bind(this, this.props.title)}>
                <h2 id={this.props.id} className="text-muted pt-5 m-0 text-left">{this.props.title}</h2><br />
                <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
            </div>
        );
    }
}

class TermMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        return(
            <li className="font-size-1x p-0 mr-5 mb-2 list-unstyled">
                <NavLink className="d-inline-block" to={this.props.to}>{this.props.name}</NavLink>
            </li>
        )
    }
    
}

class Term extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          isHover: data[2].sub[0].title,
          isOpenTaskbar: true
        }
        this.toggle = this.toggle.bind(this)
    }

    handleHover(position) {
        this.setState({isHover: position})
    }

    handleRevertStatusTaskbar() {
        this.setState({isOpenTaskbar: !this.state.isOpenTaskbar})
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleHoverTitle(value){
        this.setState({isHover:value.title})
    }

    render() {
        return (
            <React.Fragment>
                <Wrapper>
                    {
                        window.innerWidth <= 769
                            ?
                            <Sidebar
                                isOpenTaskbar={this.state.isOpenTaskbar}
                                toggle={this.toggle}
                            />
                            : null
                    }
                    <Main>
                        <div className="row w-100 ml-0 mr-0 border-bottom position-fixed p-2 p-lg-0 Term__title Term__body">
                            <Col xl="12" className="p-0">
                                <span className="sidebar-toggle d-flex mr-2" onClick={this.handleRevertStatusTaskbar.bind(this)}>
                                    <i className="hamburger d-lg-none align-self-center"/>
                                </span>
                                <h3 className={"text-center m-0 p-2 p-lg-0 " + (this.state.isOpenTaskbar === false ? "Term__title-h3" : {})}>Bảo mật và điều khoản</h3>
                            </Col>
                            <Col xl="3">
                            </Col>
                            <Col xl="8" className="Term__menu m-0 pt-3 d-none d-lg-flex">
                                {
                                    data.map((value,key) => {
                                        return(
                                            <TermMenu 
                                                key={utils.randomString()}
                                                to={value.to}
                                                name={value.name}
                                            />
                                        )
                                    })
                                }
                            </Col>
                            <Col xl="1">
                            </Col>
                        </div>                        

                        <div className="row w-100 ml-0 mr-0 Term__body">
                            <Col xl="1">
                            </Col>
                            <Col xl="11" className="p-0">
                                <div className="Term__content d-flex p-0">
                                    <Col xl="3" className="p-0 w-auto">                                        
                                        <div className="Term__content__sidebar Term__overflow position-fixed width-percent-20 border-right overflow-auto d-none d-lg-block">
                                            <ul className="p-0 font-size-1x">
                                                <li className="d-block pt-3">
                                                    <ul className="m-0 p-0">
                                                        {
                                                            data[2].sub.map((value, key) => {
                                                                return(
                                                                    <li className="pt-3 pr-3">
                                                                        <a className={"text-decoration-none" + 
                                                                            (this.state.isHover === value.title ? " text-info" : {} )}
                                                                            href={"#"+value.id} onClick={this.handleHoverTitle.bind(this, value)}>{value.title}
                                                                        </a>                                               
                                                                    </li>
                                                                )
                                                                
                                                            })
                                                        }
                                                    </ul>
                                                </li>
                                                <li className="border-top pt-3">
                                                    <NavLink to="#">Cập nhật</NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col xl="9">
                                        <div className="Term__content__details pr-3 text-color-black Term__overflow position-fixed overflow-auto">
                                            <div>
                                                <h1 id="f-welcome" className="text-muted d-inline-block font-size-1x my-3 text-uppercase">{data[2].update[0].name_update}</h1>
                                                <p dangerouslySetInnerHTML={{__html: data[2].update[0].content_update}}></p>
                                            </div>

                                            <div>
                                                <h2 className="text-muted m-0 pt-4 text-left" id="f-welcome">{data[2].welcome[0].name_welcome}</h2><br/>
                                                <p dangerouslySetInnerHTML={{__html: data[2].welcome[0].content_welcome}}></p>
                                            </div>
                                            <div>

                                            </div>
                                            {
                                                data[2].sub.map((value,key)=>{
                                                    return (
                                                        <TermContent
                                                            key={utils.randomString()}
                                                            id={value.id}
                                                            title={value.title}
                                                            content={value.content}
                                                            handleHover={this.handleHover.bind(this)}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    </Col>

                                </div>
                            </Col>
                        </div>
                    </Main>
                </Wrapper>

            </React.Fragment>
        )
    }
}

export default Term;