import React from "react";

import{
    
    Container
} from "reactstrap";
import './style.css'
import Table from "./Table/Table"
import Detail from "./Detail/Detail"
import {connect} from "react-redux"
const API = require('./api/api')
const ValidInput = require('../../utils/ValidInput');



class Issue extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            memberProject : []
        })
    }
    componentWillMount() {
        API.getMemberProject((err,result)=>{
            if(err){

            }else{
                this.setState({
                    memberProject : result.data.members
                });
            }
        })
    }
    render(){
    const idDetail = window.location.search
        .slice(1)
        .split('&')
        .map(p => p.split('='))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;
    // alert(id)
        return(
            <React.Fragment>
                <Container fluid className="p-0">
                    { ValidInput.isEmpty(idDetail)
                    ?
                    <Table memberProject ={this.state.memberProject}/>
                        :
                    <Detail idDetail = {idDetail} memberProject ={this.state.memberProject}/>
                    }
                </Container>
            </React.Fragment>  
        )
    }
}

export default connect(store => ({
    app: store.app,
    user: store.user,
    store : store
}))(Issue);