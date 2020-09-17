import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import { Box } from "react-feather";
import { Badge } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faCircle, faTasks, faChartLine, faUsers, faFolder, faCog, faStar, faBook } from "@fortawesome/free-solid-svg-icons";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";

import routes from "../routes/index";
import { CustomImg } from "../components/CustomTag";

const utils = require("../utils/utils");

const SidebarItem = withRouter(
    ({ name, badgeColor, badgeText, icon: Icon, location, to }) => {
        const getSidebarItemClass = path => {
            return location.pathname === path ? "active" : "";
        };

        return (
            <li className={"sidebar-item " + getSidebarItemClass(to)}>
                <NavLink to={to} className="sidebar-link" activeClassName="active">
                    {Icon ? <FontAwesomeIcon icon={Icon} className="align-middle mr-3" size="lg" /> : null}
                    {name}
                    {badgeColor && badgeText ? (
                        <Badge color={badgeColor} size={18} className="sidebar-badge">
                            {badgeText}
                        </Badge>
                    ) : null}
                </NavLink>
            </li>
        );
    }
);

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    toggle = index => {
        this.setState(state => ({
            [index]: !state[index]
        }));
    };

    componentDidMount() {
        /* Open collapse element that matches current url */
        const pathName = this.props.location.pathname;

        routes.forEach((route, index) => {
            const isActive = pathName.indexOf(route.path) === 0;
            const isOpen = route.open;
            const isHome = route.containsHome && pathName === "/" ? true : false;

            this.setState(() => ({
                [index]: isActive || isOpen || isHome
            }));
        });

        const project = utils.getPermissionInProject();
        this.setState({ isAdmin: project.admin })
    }

    render() {
        const { sidebar, layout, user } = this.props;
        const userInfo = user.user;
        const name = userInfo.full_name;
        const avatar = userInfo.photo;


        if (name === undefined || avatar === undefined) {
            return (
                <div> </div>
            );
        } else
            return (
                <nav
                    className={
                        "sidebar" +
                        (!sidebar.isOpen ? " toggled" : "") +
                        (sidebar.isSticky ? " sidebar-sticky" : "")
                    }
                >
                    <div className="sidebar-content">
                        <PerfectScrollbar>
                            <a className="sidebar-brand" href="/">
                                <Box className="align-middle text-primary mr-2" size={24} />{" "}
                                <span className="align-middle" >Fwork</span>
                            </a>

                            <ul className="sidebar-nav">
                                <React.Fragment>
                                    <SidebarItem
                                        name="Epic"
                                        icon={faStar}
                                        to="/project/epic"
                                    />
                                    <SidebarItem
                                        name="Timeline"
                                        icon={faList}
                                        to="/project/timeline"
                                    />
                                    <SidebarItem
                                        name="Work"
                                        icon={faTasks}
                                        to="/project/work"
                                    />
                                    <SidebarItem
                                        name="Report"
                                        icon={faChartLine}
                                        to="/project/report"
                                    />
                                    <SidebarItem
                                        name="Wiki"
                                        icon={faWikipediaW}
                                        to="/project/wiki"
                                    />
                                    <SidebarItem
                                        name="Issue"
                                        icon={faBook}
                                        to="/project/issue"
                                    />
                                    <SidebarItem
                                        name="File"
                                        icon={faFolder}
                                        to="/project/storage"
                                    />
                                    <SidebarItem
                                        name="Members"
                                        icon={faUsers}
                                        to="/project/clients"
                                    />
                                    {this.state.isAdmin ?
                                        <SidebarItem
                                            name="Admin"
                                            icon={faCog}
                                            to="/project/admin"
                                        />
                                        : null
                                    }
                                </React.Fragment>
                            </ul>

                            {!layout.isBoxed && !sidebar.isSticky ? (
                                <div className="sidebar-bottom d-none d-lg-block">
                                    <div className="media">
                                        <CustomImg
                                            className="rounded-circle mr-3"
                                            src={avatar}
                                            alt="Avatar"
                                            width="40"
                                            height="40"
                                        />
                                        <div className="media-body">
                                            <h5 className="mb-1">{name.length < 20 ? name : name.substring(0, 20)}</h5>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faCircle}
                                                    className="text-success"
                                                />{" "}
                                                Online
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </PerfectScrollbar>
                    </div>
                </nav>
            );
    }
}

export default withRouter(
    connect(store => ({
        sidebar: store.sidebar,
        layout: store.layout,
        user: store.user,
        project: store.project
    }))(Sidebar)
);