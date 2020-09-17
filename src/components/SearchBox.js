import React from "react";
import {Input} from "reactstrap";
const randomString = require("../utils/utils").randomString;

class SearchBox extends React.Component{
    // eslint-disable-next-line no-useless-constructor
    constructor(props){
        super(props);
        this.state = {
            id: randomString(20)
        }
    }

    handleGetData(event){
        if(this.props.mode==="key_enter"){
            if(event.keyCode===13){
                this.props.handleGetData(document.getElementById(this.state.id).value);
            }
        }
        else{
            this.props.handleGetData(document.getElementById(this.state.id).value);
        }
    }

   render(){
        const {placeHolder} = this.props;
        return(
            <div>
                <Input
                    type="search"
                    id={this.state.id}
                    placeholder={placeHolder===undefined ? 'Search' : placeHolder}
                    onKeyUp={this.handleGetData.bind(this)}
                />
            </div>
        );
    }
};

export default SearchBox;