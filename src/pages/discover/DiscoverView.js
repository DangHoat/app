import React, { Component } from 'react';
import './Discover.css'
import ItemMostDiscover from './ItemMostDiscover';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Button
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faHeart } from "@fortawesome/free-solid-svg-icons";
import Notification from "../../components/Notification";
import { LoadingSprinner } from '../../components/CustomTag';
import utils from "../../../src/utils/utils"
const api = require("./api/api");

class MostActivityDiscover extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.change_data_most_activity = this.change_data_most_activity.bind(this);
        this.state = {
            actions: ["Last week", "Last month", "Last Years", "All time"],
            dropdownOpen: false,
            dropDownValue: "Last week",
            data_most_activity: [],
            isLoaderAPI_Activities: false
        };
    }

    componentWillMount() {
        api.getApiMostActivity("-total_activity_last_week", 1, null, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                this.setState({
                    data_most_activity: result,
                    isLoaderAPI_Activities: true
                })
            }
        });
    }

    getPage() {
        this.props.view_more_active(2, "Most active", this.state.dropDownValue)
    }

    change_data_most_activity(mode_select) {
        const that = this;
        switch (mode_select) {
            case "Last week":
                api.getApiMostActivity("-total_activity_last_week", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_activity: result,
                            isLoaderAPI_Activities: true
                        })
                    }
                });
                break;
            case "Last month":
                api.getApiMostActivity("-total_activity_last_month", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_activity: result,
                            isLoaderAPI_Activities: true
                        })
                    }
                });
                break;
            case "Last year":
                api.getApiMostActivity("-total_activity_last_year", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_activity: result,
                            isLoaderAPI_Activities: true
                        })
                    }
                });
                break;
            case "All time":
                api.getApiMostActivity("-total_activity", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_activity: result,
                            isLoaderAPI_Activities: true
                        })
                    }
                });
                break;

            default:
                api.getApiMostActivity("-total_activity_last_week", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_activity: result,
                            isLoaderAPI_Activities: true
                        })
                    }
                });
                break;
        }
    }

    show_ItemMostDiscover() {
        if (this.state.data_most_activity !== null) {
            return this.state.data_most_activity.map((item, key) => {
                if (key < 5) {
                    return (
                        <ItemMostDiscover
                            key={utils.randomString()}
                            image={item.logo_small_url}
                            name={item.name}
                            like={item.total_fans_last_week}
                            watch={item.total_watchers}
                            member={item.members.length}
                            description={item.description}
                        ></ItemMostDiscover>
                    )
                }
            });
        }
        else return console.log('khong co du lieu')
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    changeValue(e) {
        this.setState({
            dropDownValue: e.currentTarget.textContent,
            isLoaderAPI_Activities: false
        });
        this.change_data_most_activity(e.currentTarget.textContent);
    }

    render() {
        return (
            <div className="most-active">
                <div className="header-most-liked mb-4">
                    <h4 className="d-inline-block"><FontAwesomeIcon icon={faChartLine} />
                        <strong>MOST ACTIVE</strong> </h4>
                    <Dropdown className="d-inline-block float-right" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret >
                            {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.state.actions.map((e, key) => {
                                return <DropdownItem key={utils.randomString()} onClick={this.changeValue}>{e}</DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {!this.state.isLoaderAPI_Activities ? <LoadingSprinner /> : this.show_ItemMostDiscover()}
                <div className="viewmore-most-activity">
                    <Button className="viewmore-most-activity__link text-center"
                        onClick={this.getPage.bind(this)}
                    >View More</Button>
                </div>
            </div>

        );
    }
}
class MostLikeDiscover extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.change_data_most_like = this.change_data_most_like.bind(this);
        this.state = {
            actions: ["Last week", "Last month", "Last Years", "All time"],
            dropdownOpen: false,
            dropDownValue: "Last week",
            data_most_like: [],
            isLoaderAPI_Like: false
        };
    }

    componentWillMount() {
        api.getApiMostLike("-total_fans_last_week", 1, null, (err, result) => {
            if (err) {
                Notification("error", "Error", err);
            } else {
                this.setState({
                    data_most_like: result,
                    isLoaderAPI_Like: true
                })
            }
        });
    }

    getPage() {
        this.props.view_more_like(2, "Most liked", this.state.dropDownValue)
    }
    change_data_most_like(mode_select) {
        const that = this;
        switch (mode_select) {
            case "Last week":
                api.getApiMostLike("-total_fans_last_week", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_like: result,
                            isLoaderAPI_Like: true
                        })
                    }
                });
                break;
            case "Last month":
                api.getApiMostLike("-total_fans_last_month", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_like: result,
                            isLoaderAPI_Like: true
                        })
                    }
                });
                break;
            case "Last year":
                api.getApiMostLike("-total_fans_last_year", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_like: result,
                            isLoaderAPI_Like: true
                        })
                    }
                });
                break;
            case "All time":
                api.getApiMostLike("-total_fans", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_like: result,
                            isLoaderAPI_Like: true
                        })
                    }
                });
                break;
            default:
                api.getApiMostLike("-total_fans_last_week", 1, null, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err);
                    } else {
                        that.setState({
                            data_most_like: result,
                            isLoaderAPI_Like: true
                        })
                    }
                });
                break;
        }
    }


    show_ItemMostDiscover() {
        if (this.state.data_most_like !== null) {
            return this.state.data_most_like.map((item, key) => {
                if (key < 5) {
                    return (
                        <ItemMostDiscover
                            key={utils.randomString()}
                            image={item.logo_small_url}
                            name={item.name}
                            like={item.total_fans_last_week}
                            watch={item.total_watchers}
                            member={item.members.length}
                            description={item.description}
                        ></ItemMostDiscover>
                    )
                }
            });
        }
        else return console.log('khong co du lieu')
    }

    changeValue(e) {
        this.setState({
            dropDownValue: e.currentTarget.textContent,
            isLoaderAPI_Like: false
        });
        this.change_data_most_like(e.currentTarget.textContent);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return (
            <div className="most-liked">
                <div className="header-most-liked mb-4">
                    <h4 className="d-inline-block"><FontAwesomeIcon icon={faHeart} /><strong>
                        MOST LIKED</strong></h4>
                    <Dropdown className="d-inline-block float-right" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret >
                            {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.state.actions.map((e, key) => {
                                return <DropdownItem key={utils.randomString()} onClick={this.changeValue}>{e}</DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {!this.state.isLoaderAPI_Like ? <LoadingSprinner /> : this.show_ItemMostDiscover()}
                <div className="viewmore-most-liked">
                    <Button className="viewmore-most-activity__link text-center"
                        onClick={this.getPage.bind(this)}
                    >View More</Button>
                </div>
            </div>

        );
    }
}

class DiscoverView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            data_most_activity: [],
            data_most_like: []
        };
    }

    getDataSearch(value) {
        this.setState({
            search_value: value
        });
    }

    getPageMostLike(page, most_value, most_value_filter) {
        this.props.view_more_like(page, most_value, most_value_filter)
    }

    getPageMostAcitve(page, most_value, most_value_filter) {
        this.props.view_more_active(page, most_value, most_value_filter)
    }

    render() {
        return (
            < div className="container" >
                <div className="row">
                    <div className="col-6 width-full ">
                        <MostLikeDiscover view_more_like={this.getPageMostLike.bind(this)}></MostLikeDiscover>
                    </div>
                    <div className="col-6 width-full ">
                        <MostActivityDiscover view_more_active={this.getPageMostAcitve.bind(this)}></MostActivityDiscover>
                    </div>
                </div>
            </div >

        );
    }
}

export default DiscoverView;