import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHeart, faChartLine } from "@fortawesome/free-solid-svg-icons";
import './Discover.css';
import { Button } from "reactstrap";
import ItemMostDiscover from './ItemMostDiscover';
import { NavLink } from 'react-router-dom';
import Notification from "../../components/Notification";
import { LoadingSprinner } from '../../components/CustomTag';
import utils from "../../../src/utils/utils"

const api = require("./api/api");

class DiscoverViewMore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_value: "",
            most_value: this.props.getStateViewMore.most_value,
            most_value_filter: this.props.getStateViewMore.most_value_filter,
            data_most_activity: [],
            data_most_like: [],
            isActive: "",
            max_most_like: 10,
            max_most_acitive: 10,
            page_most_like: 1,
            page_most_activie: 1,
            status_load: true,
            isLoaderAPI_Activities: false,
            isLoaderAPI_Like: false,
            isSearch: false
        }

    }

    componentWillMount() {
        this.change_data_most(this.props.getStateViewMore.most_value, this.props.getStateViewMore.most_value_filter)
    }
    // componentWillReceiveProps() {
    //     api.getApiMostLike("", 1, this.props.getTextSearch, (err, result) => {
    //         if (err) {
    //             Notification("error", "Error", err);
    //         } else {
    //             this.setState({
    //                 data_most_like: result,
    //                 isLoaderAPI_Like: true,
    //             })
    //         }
    //     });
    // }

    show_ItemMostDiscover() {
        if (this.state.most_value === "Most liked") {
            if (this.state.isLoaderAPI_Like === true) {
                return this.state.data_most_like.slice(0, this.state.max_most_like).map((item, key) => {
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
                });
            }
            else return (<LoadingSprinner />)
        } else if (this.state.most_value === "Most active") {
            if (this.state.isLoaderAPI_Activities === true) {
                return this.state.data_most_activity.slice(0, this.state.max_most_acitive).map((item, key) => {
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
                });
            }
            else return (<LoadingSprinner />)
        }
    }

    ItemLoadMore() {
        if (this.state.most_value === "Most liked") {
            if (this.state.max_most_like < this.state.data_most_like.length) {
                return <Button block color="primary" className="load-more" onClick={() => this.setState({ max_most_like: this.state.max_most_like + 10 })}>Load More</Button>
            } else if (this.state.status_load === true && this.state.data_most_like.length > 10) {
                return <Button block color="primary" className="load-more" onClick={this.handleUpdate.bind(this)}>Load More</Button>
            } else return null;
        } else if (this.state.most_value === "Most active") {
            if (this.state.max_most_acitive < this.state.data_most_activity.length) {
                return <Button block color="primary" className="load-more" onClick={() => this.setState({ max_most_acitive: this.state.max_most_acitive + 10 })}>Load More</Button>
            } else if (this.state.status_load === true && this.state.data_most_activity.length > 10) {
                console.log("...")
                return <Button block color="primary" className="load-more" onClick={this.handleUpdate.bind(this)}>Load More</Button>
            } else return null;
        }
    }

    change_data_most(status_most, satatus_most_filter) {
        const that = this;
        if (status_most === "Most liked") {
            switch (satatus_most_filter) {
                case "Last week":
                    api.getApiMostLike("-total_fans_last_week", this.state.page_most_like, null, (err, result) => {
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
                    api.getApiMostLike("-total_fans_last_month", this.state.page_most_like, null, (err, result) => {
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
                    api.getApiMostLike("-total_fans_last_year", this.state.page_most_like, null, (err, result) => {
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
                    api.getApiMostLike("-total_fans", this.state.page_most_like, null, (err, result) => {
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
                    api.getApiMostLike("-total_fans_last_week", this.state.page_most_like, null, (err, result) => {
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
        } else if (status_most === "Most active") {
            const that = this;
            switch (satatus_most_filter) {
                case "Last week":
                    api.getApiMostActivity("-total_activity_last_week", this.state.page_most_activie, null, (err, result) => {
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
                    api.getApiMostActivity("-total_activity_last_month", this.state.page_most_activie, null, (err, result) => {
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
                    api.getApiMostActivity("-total_activity_last_year", this.state.page_most_activie, null, (err, result) => {
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
                    api.getApiMostActivity("-total_activity", this.state.page_most_activie, null, (err, result) => {
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
                    api.getApiMostActivity("-total_activity_last_week", this.state.page_most_activie, null, (err, result) => {
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

    }


    changeStateMostFilter(e) {
        var value = e.currentTarget.textContent;
        this.setState({
            most_value_filter: value,
            max_most_like: 10,
            max_most_acitive: 10,
            page_most_activie: 1,
            page_most_like: 1,
            isLoaderAPI_Activities: false,
            isLoaderAPI_Like: false
        });
        this.change_data_most(this.state.most_value, value)
    }

    changeStateMost(e) {
        var value = e.currentTarget.textContent;
        this.setState({
            most_value: value,
            most_value_filter: "Last week",
            max_most_acitive: 10,
            max_most_like: 10,
            page_most_activie: 1,
            page_most_like: 1,
            isLoaderAPI_Activities: true,
            isLoaderAPI_Like: true
        });
        this.change_data_most(value, "Last week")
    }

    handleUpdate() {
        const that = this;
        if (this.state.most_value === "Most liked") {
            this.setState({ page_most_like: this.state.page_most_like + 1 });
            api.getApiMostLike("-total_fans_last_week", this.state.page_most_like, null, (err, result) => {
                if (err) {
                    this.setState({ status_load: false });
                    Notification("error", "Error", err);
                } else {
                    this.setState({ status_load: true })
                    that.setState({ max_most_like: this.state.max_most_like + 10 })
                    let state = Object.assign({}, that.state);
                    for (let i = 0; i < result.length; i++) {
                        state.data_most_like.push(result[i])
                    }
                    that.setState(state);
                }
            });
        }
        else if (this.state.most_value === "Most active") {
            this.setState({ page_most_activie: this.state.page_most_activie + 1 });
            api.getApiMostActivity("-total_activity_last_week", this.state.page_most_activie, null, (err, result) => {
                if (err) {
                    this.setState({ status_load: false });
                    Notification("error", "Error", err);
                } else {
                    this.setState({ status_load: true })
                    that.setState({ max_most_acitive: this.state.max_most_acitive + 10 })
                    let state = Object.assign({}, that.state);
                    for (let i = 0; i < result.length; i++) {
                        state.data_most_activity.push(result[i])
                    }
                    that.setState(state);
                }
            });
        }
    }

    render() {
        console.log(this.props.getStateViewMore.most_value)
        return (
            <div className="container">
                <div className="discover-results-inner">
                    <tg-discover-search-list-header>
                        <div className="discover-results-header">
                            <div className="discover-results-header-inner align-items-center d-flex justify-content-between">
                                <div className="title d-flex flex-row text-size-3x text-uppercase">
                                    <FontAwesomeIcon icon={faSearch} />
                                    <h2>Search results</h2>
                                </div>
                                <div className="filter-discover-search">
                                    <NavLink onClick={this.changeStateMost.bind(this)} to="#" className={this.state.most_value === "Most liked" ? "active" : ""}>
                                        <FontAwesomeIcon icon={faHeart} />
                                        <span>Most liked</span>
                                    </NavLink>
                                    <NavLink onClick={this.changeStateMost.bind(this)} to="#" className={this.state.most_value === "Most active" ? "active" : ""}>
                                        <FontAwesomeIcon icon={faChartLine} />
                                        <span >Most active</span>
                                    </NavLink></div>
                            </div>

                            {!this.state.isSearch === true ?
                                <div className="discover-search-subfilter d-flex justify-content-between align-items-center">
                                    <a href="#" className="results">Clearfilters</a>
                                    <ul className="filter-list p-1 d-flex flex-row">
                                        <li><NavLink to="#" className={this.state.most_value_filter === "Last week" ? "active" : ""} onClick={this.changeStateMostFilter.bind(this)} >Last week</NavLink></li>
                                        <li><NavLink to="#" className={this.state.most_value_filter === "Last month" ? "active" : ""} onClick={this.changeStateMostFilter.bind(this)} >Last month</NavLink></li>
                                        <li><NavLink to="#" className={this.state.most_value_filter === "Last year" ? "active" : ""} onClick={this.changeStateMostFilter.bind(this)} >Last year</NavLink></li>
                                        <li><NavLink to="#" className={this.state.most_value_filter === "All time" ? "active" : ""} onClick={this.changeStateMostFilter.bind(this)} >All time</NavLink></li>
                                    </ul>
                                </div> : null}
                        </div>
                    </tg-discover-search-list-header>
                    {this.show_ItemMostDiscover()}
                    {this.ItemLoadMore()}
                </div>
            </div>
        );
    }
}

export default DiscoverViewMore;