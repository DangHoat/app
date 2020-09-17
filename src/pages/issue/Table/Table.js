import React, { Component } from 'react'
import FilterIssue from "./FilterIssue"
import ListIssue from "./ListIssue"
import{
    Col,Row,
    Container
} from "reactstrap";
import { LoadingSprinner } from '../../../components/CustomTag';
const API = require("../api/api")
const ValidInput = require("../../../utils/ValidInput")
export default class Table extends Component {
    constructor(props){
        super(props);
        this.state=({
            Data:[],
            type:[],
            priority:[],
            severity:[],
            status:[],
            subject:"",
            assignTo:[],
            idDetail : "",
            Detail : "",
            total : 0,
            map : new Map(),
            loading : true
        })
    }

    componentWillMount() {
        this.GetPageData();
    }

    

    GetPageData(){
        API.getIssue((err,result)=>{
            if(err){
                // Notification("error", "Error", err);
                console.table(err)
            }else{
                let map =  new Map();
                result.map((value,key)=>{
                    map.set(key,value.id)
                })
                
                this.setState({
                    Data:result,
                    loading : false,    
                    map : map
                });
            }
        })
    }
    GetPreNext(number){

    }
    Options(type,priority,severity,status,assignTo,subject){
        this.setState({
            type : type,
            priority : priority,
            severity : severity,
            subject : subject,
            status : status,
            assignTo : assignTo,
        });
    }
    check(key,value){
        if(this.checkEmptyObj(value))
        {
            return true
        }
        for(let a in value){
            if(value[a]==key){
                return true;
            }
        }
        return false;
    }
    checkEmptyObj(value){
        for(let a in value){
            if(ValidInput.isEmpty(value[a])){
                return false;
            }
        }
        return true;
    }

    FilterSubject(data,subject){
        let temp =[]
        if(ValidInput.isEmpty(subject)) return data;
        else{
            data.map(value=>{
                if(value.subject.indexOf(subject)!= -1){
                    temp.push(value)
                }
            })
        }
        return temp
    }
    FilterList(){
        let DataIssue;
        if(!this.checkEmptyObj(this.state.type) || !this.checkEmptyObj(this.state.priority) || !this.checkEmptyObj(this.state.severity) || !this.checkEmptyObj(this.state.status)){
            let temp=[];
            this.state.Data.map((value,key)=>{
                if(this.check(value.type,this.state.type) && this.check(value.severity,this.state.severity) && this.check(value.priority,this.state.priority)&& this.check(value.status,this.state.status)){
                    temp.push(value)
                } 
                });
                DataIssue  =  this.FilterSubject(temp,this.state.subject) 
                }else{
                    DataIssue  =  this.FilterSubject(this.state.Data,this.state.subject) 
            }
        if(this.state.assignTo.length>=1){
                const map = new Map();
                let temp = []
                this.state.assignTo.map((value,key)=>{
                   map.set(value,key)
                })
                DataIssue.map((value,key)=>{
                    if(!map.has(value.full_name_display)){
                        temp.push(value)
                    }
                })
                DataIssue = temp;
            }
        return DataIssue;
    }
    render() {
        let DataIssue = this.FilterList()
        return (
            <div>
                {
                    this.state.loading?
                    <LoadingSprinner/>
                    :
                <Row>
                    <Col md="3" xl="3"> 
                        <FilterIssue 
                            Options={this.Options.bind(this)} 
                            memberProject ={this.props.memberProject} /> 
                    </Col>
                    <Col md="8" xl="9"> 
                        <ListIssue  
                            Data = {DataIssue}  
                            reLoad = {this.GetPageData.bind(this)} 
                            // GetDetail = {this.GetDetail.bind(this)}
                            memberProject ={this.props.memberProject}
                            /> 
                    </Col>
                </Row>
                } 
            </div>
        )
    }
}
