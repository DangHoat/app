import React from "react";
import { connect } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import { Link } from "react-router-dom";
import $ from "jquery";

import {
    Row, Col,
    Collapse,
    Navbar, Nav,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ListGroup, ListGroupItem,
    UncontrolledTooltip,
} from "reactstrap";

import { Bell, Home, PieChart, Settings, User, Layout, Globe } from "react-feather";
import { CustomImg } from "../components/CustomTag";

import usFlag from "../assets/img/flags/us.png";
import vnFlag from "../assets/img/flags/vn.png";

import empty_avatar from "../assets/img/avatars/empty_avatar.png";
import "./Navbar.css"

const ValidInput = require("../utils/ValidInput");

const event = ["event_type_0", "event_type_1", "event_type_2", "event_type_3", "event_type_4", "event_type_5", "event_type_6", "event_type_7", "event_type_8", "event_type_9", "event_type_10"]

class NavbarDropdown extends React.Component {

    render() {
        const { children, count, showBadge, header, icon } = this.props;
        return (
            <UncontrolledDropdown nav inNavbar className="mr-2">
                <DropdownToggle nav className="nav-icon dropdown-toggle">
                    <div className="position-relative">
                        <Link to="#" >
                            <Bell id="navbar-notificatipn" className="align-middle" />
                        </Link>
                        <UncontrolledTooltip placement="bottom" target="navbar-notificatipn">
                            Notifications
                        </UncontrolledTooltip>
                        {showBadge ? <span className="indicator">{count}</span> : null}
                    </div>
                </DropdownToggle>
                <DropdownMenu right className="dropdown-menu-lg py-0">
                    <div className="dropdown-menu-header position-relative">
                        {count} {header}
                    </div>
                    <ListGroup>{children}</ListGroup>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

class NavbarDropdownItem extends React.Component {
    render() {
        const { photo, user, event_type, subject, project, time, spacing } = this.props;
        return (
            <ListGroupItem>
                <Row noGutters className="align-items-center">
                    <Col xs={2}>
                        <CustomImg
                            src={photo}
                            alt="avatar"
                            className="rounded-circle"
                        />
                    </Col>
                    <Col xs={10} className={spacing ? "pl-2" : null}>
                        <div className="font-weight-bold font-size-1x">{project}</div>
                        <span className="font-weight-bold">{user}</span>&nbsp;
                        <span className="font-italic">{event_type}</span>&nbsp;
                        <span className="font-weight-bold text-success">#{subject}</span>
                        <div className="text-muted font-size-1x">{time.split("T")[0]}</div>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }
}

class NavbarComponent extends React.Component {
    changeLanguage(lang) {
        this.setState({
            lang: lang
        });
        let flag = lang === 'en' ? usFlag : vnFlag;
        $("#language_selected").attr("src", flag)
    }

    replacePage(page) {
        const { history } = this.props;
        history.push(page);
    }

    hanleLogout() {
        sessionStorage.clear();
    }

    render() {
        const { dispatch, user } = this.props;
        const userInfo = user.user;
        const avatar = userInfo.photo;
        const name = userInfo.full_name;
        return (
            <Navbar color="white" light expand>
                {
                    !this.props.isSidebar ? null :
                        <span className="sidebar-toggle d-flex mr-2" onClick={() => { dispatch(toggleSidebar()); }}>
                            <i className="hamburger align-self-center" />
                        </span>
                }

                <Collapse navbar>
                    <Nav className="ml-auto" navbar>

                        <UncontrolledDropdown nav inNavbar className="mr-2">
                            <DropdownToggle nav>
                                <Link to="/dashboard" >
                                    <Home id="navbar-dashboard" size={18} />
                                </Link>
                                <UncontrolledTooltip placement="bottom" target="navbar-dashboard">
                                    Dashboard
                                </UncontrolledTooltip>
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar className="mr-2">
                            <DropdownToggle nav>
                                <Link to="/project" >
                                    <Layout id="navbar-project" size={18} className="text-mute" />
                                </Link>
                                <UncontrolledTooltip placement="bottom" target="navbar-project">
                                    Projects
                                </UncontrolledTooltip>
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <NavbarDropdown
                            header="New Notifications"
                            count={this.props.notification.length}
                        >
                            {
                                this.props.notification.map(({ event_type, data, created }, key) => {
                                    return (
                                        <NavbarDropdownItem
                                            key={key}
                                            event_type={event[event_type]}
                                            user={data.user.name}
                                            photo={data.user.photo}
                                            subject={data.obj === undefined ? null : data.obj.subject} // Mot so notification khong co subject
                                            project={data.project.name}
                                            time={created}
                                        />
                                    );
                                })}
                        </NavbarDropdown>

                        <UncontrolledDropdown nav inNavbar className="mr-2">
                            <DropdownToggle nav caret className="nav-flag">
                                <CustomImg src={usFlag} alt="English" id="language_selected" />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={this.changeLanguage.bind(this, 'en')}>
                                    <CustomImg
                                        src={usFlag}
                                        alt="English"
                                        width="20"
                                        className="align-middle mr-1"
                                    />
                                    <span className="align-middle">English</span>
                                </DropdownItem>
                                <DropdownItem onClick={this.changeLanguage.bind(this, 'vn')}>
                                    <CustomImg
                                        src={vnFlag}
                                        alt="Vietnam"
                                        width="20"
                                        className="align-middle mr-1"
                                    />
                                    <span className="align-middle">Vietnam</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar>
                            <span className="d-inline-block d-sm-none">
                                <DropdownToggle nav caret>
                                    <Settings size={18} className="align-middle" />
                                </DropdownToggle>
                            </span>
                            <span className="d-none d-sm-inline-block">
                                <DropdownToggle nav caret>
                                    <CustomImg
                                        src={avatar !== null ? avatar : empty_avatar}
                                        className="avatar img-fluid rounded-circle mr-1"
                                        alt="Avatar"
                                    />
                                    <span className="text-dark">{name}</span>
                                </DropdownToggle>
                            </span>
                            <DropdownMenu right>
                                <Link to="/profile" className="text-dark">
                                    <DropdownItem>
                                        <User size={18} className="align-middle mr-2" />
                                        Profile
                                    </DropdownItem>
                                </Link>
                                <Link to="">
                                    <DropdownItem>
                                        <PieChart size={18} className="align-middle mr-2" />
                                        Analytics
                                    </DropdownItem>
                                </Link>
                                <DropdownItem divider />
                                <Link to="" >
                                    <DropdownItem>Settings & Privacy</DropdownItem>
                                </Link>
                                <Link to="">
                                    <DropdownItem>Help</DropdownItem>
                                </Link>
                                <Link to="/auth/sign-in" className="text-dark">
                                    <DropdownItem onClick={this.hanleLogout.bind(this)}>Sign out</DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default connect(store => ({
    app: store.app,
    user: store.user,
}))(NavbarComponent);
