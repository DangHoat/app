import React from "react";
import {
    Nav,
    Row, Col,
    Input,
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from "reactstrap";
import {NavLink} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { CustomImg } from "../../components/CustomTag"
import './Discover.css'
import utils from "../../../src/utils/utils";
import Notification from "../../components/Notification";

const api = require("./api/api");
const ValidInput = require("../../utils/ValidInput");

class ItemMostDiscover extends React.Component {
    constructor(props) {
        super(props);
        const {id, name, is_private, logo} = this.props;
        this.state = {
            data: {
                id: id,
                name: name,
                is_private: is_private,
                logo: logo,
            }
        }
    }
    
    handleSelectProject(){
        api.getInfoProject(this.state.data.id, (err, result)=>{
            console.log(this.state.data.id);
            
            if(err){
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                localStorage.setItem('project', JSON.stringify(result));
                window.location.replace("/project/work");
            }
        });
    } 

    render() {
        return (
            <div className="border-bottom d-flex p-2">
                <NavLink to="#" onClick={this.handleSelectProject.bind(this)}>
                    <CustomImg src={this.props.image} className="img--user--square-3x" />
                </NavLink> 
                <div className="discover__project-content pl-3">
                    <div className="d-flex align-content-center justify-content-between">
                        <NavLink to="#" onClick={this.handleSelectProject.bind(this)}>
                            <h5 className="d-inline-block">{this.props.name}</h5>
                        </NavLink>
                        <div>
                            <span><FontAwesomeIcon icon={faUser} /><span>{this.props.member}</span></span>
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </div>
        );
    }
}

class Discover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keyWord : null,
            actions: ["Last week", "Last month", "Last Years", "All time"],
            dropdownOpen: false,
            dropDownValue: "Last week",
        }
        this.count = 0;
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    
    handleSearch(event){
        this.changeSearchChars(event.target.value);
    }

    changeSearchChars(chars){
        let state = Object.assign({}, this.state);
        state.keyWord = chars.toLowerCase();
        this.setState(state);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    componentDidMount(){
        const that = this;
        api.getInfoProjectAll((err, result)=>{       
        if(err){
            Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
        } else {
            that.setState({data: result ,isLoaderAPI: true});
            }
        })
    }

    render() {
        const publicProject = this.state.data.filter(project => !project.is_private)
        const count = publicProject.length
        return (
            <div style={{overflow: "auto", maxHeight: "100vh"}}>
                <Nav className="discover__background">
                    <div className="ml-auto d-flex">
                        <NavLink to="/auth/sign-in" className="px-4 py-2 font-size-2x text-white text-decoration-none discover__link">Login</NavLink>
                        <NavLink to="/auth/sign-up" className="px-4 py-2 font-size-2x text-white text-decoration-none discover__link">Sign up</NavLink>
                    </div>
                </Nav>
                <div className="discover-header full-width">
                    <div className="jumbotron">
                        <h1 className="text-center">DISCOVER PROJECTS</h1>
                        <p className="text-center">{count} public projects to discover</p>
                        <Col>
                            <Input className="main-search mx-auto width-percent-30" id="inputSearch" placeholder="Search Project" onKeyUp={this.handleSearch.bind(this)}/>
                        </Col>
                    </div>
                </div>
                <Row>
                    <Col xl="6">
                        <h3 className="pl-5">
                            <FontAwesomeIcon icon={faChartLine}/><strong className="pl-2">PROJECTS MOST ACTIVE</strong>
                        </h3>
                    </Col>
                    <Col xl="6">
                        <Dropdown className="d-inline-block float-right pr-5" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret className="discover__background border-info">
                                {this.state.dropDownValue}
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.actions.map((select, key) => {
                                    return <DropdownItem key={utils.randomString()} onClick={this.changeValue}>{select}</DropdownItem>
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
                
                {this.state.data !==null ?
                    this.state.data.map((data, key) => {
                        if( ValidInput.isEmpty(this.state.keyWord) && !data.is_private){
                            return(
                                <ItemMostDiscover
                                    key={utils.randomString()}
                                    id={data.id}
                                    image={data.logo}
                                    name={data.name}
                                    member={data.members.length}
                                    description={data.description}
                                />
                            )
                        }
                        else{
                            if(data.name.toLowerCase().indexOf(this.state.keyWord) !== -1){
                                return(
                                    <ItemMostDiscover
                                        key={utils.randomString()}
                                        id={data.id}
                                        image={data.logo}
                                        name={data.name}
                                        member={data.members.length}
                                        description={data.description}
                                    />
                                ) 
                            }
                        }
                    })
                    :
                    null
                }
            </div>
        );
    }
}

export default Discover;