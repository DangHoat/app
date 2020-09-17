import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser, faEye } from "@fortawesome/free-solid-svg-icons";
import { CustomImg } from "../../components/CustomTag"

class ItemMostDiscover extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="item d-flex p-2 ">
                <a href="/" className="item__icon">
                    <CustomImg src={this.props.image} style={{ background: 'rgb(152, 224, 168)' }} />
                </a>
                <div className="item__content">
                    <div className="item__content__data d-flex align-content-center justify-content-between">
                        <h5 className="d-inline-block"><a href="#">{this.props.name}</a></h5>
                        <div className="statistics">
                            <span className="statistics_data"><FontAwesomeIcon icon={faHeart} /><span>{this.props.like}</span></span>
                            <span className="statistics_data"><FontAwesomeIcon icon={faEye} /><span>{this.props.watch}</span></span>
                            <span className="statistics_data"><FontAwesomeIcon icon={faUser} /><span>{this.props.member}</span></span>
                        </div>
                    </div>
                    <p>{this.props.description}</p>
                </div>
            </div>

        );
    }
}

export default ItemMostDiscover;