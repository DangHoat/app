import React, { Component } from 'react';
import { PlusCircle } from 'react-feather'
import './Wiki.css'
import Dragula from 'react-dragula';
import { LoadingSprinner } from '../../components/CustomTag'
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Card, CardHeader, CardTitle,
    ListGroup, ListGroupItem,
    Button,
    InputGroup, Input,
    Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
const utils = require("../../utils/utils")

class ListWiki extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            addwiki: true,
            newWiki: null,
            modal: false,
            id: null,
            nameWiki: null,
            item: null
        })
        this.toggle = this.toggle.bind(this);
        this.dragulaDecorator = this.dragulaDecorator.bind(this);
        this.addwiki = this.addwiki.bind(this);
        this.addwikinew = this.addwikinew.bind(this);
        this.getWiki = this.getWiki.bind(this);
        this.isChange = this.isChange.bind(this);
        this.DeleteWiki = this.DeleteWiki.bind(this);

    }
    toggle(id, name, item) {
        this.setState(prevState => ({
            id: id,
            modal: !prevState.modal,
            nameWiki: name,
            item: item
        }));
    }
    dragulaDecorator(componentBackingInstance) {
        if (componentBackingInstance) {
            let options = {};
            Dragula([componentBackingInstance], options);
        }
    };
    addwiki() {
        this.setState({
            addwiki: !this.state.addwiki
        })
    }
    addwikinew = (event) => {

        if (event.keyCode === 13) {
            this.props.CreateWiki(this.state.newWiki);
            this.setState({
                addwiki: !this.state.addwiki
            })
        }
        if (event.keyCode === 27) {
            this.setState({
                addwiki: !this.state.addwiki
            })
        }

    }
    getWiki(id) {
        this.props.getWiki(id);
        this.setState({
            id: id
        })
    }
    isChange = (event) => {
        console.log(event)
        this.setState({
            newWiki: event.target.value
        })

    }
    DeleteWiki() {
        this.props.DeleteWiki(this.state.id, this.state.item);
        this.setState({
            modal: !this.state.modal
        });
    }
    render() {
        return (
            <Card>
                <CardHeader className="colorheader">
                    <CardTitle tag="h5" className="mb-0">
                        BOOKMARKS
                    </CardTitle>
                </CardHeader>
                {this.props.isLoad ? <LoadingSprinner /> : <ListGroup flush>
                    <div ref={this.dragulaDecorator}>
                        {this.props.listWiki.map((val, key) => {
                            if (val.id === this.state.id) {
                                var active = "listwikiactive";
                            }
                            else if (val.id === this.props.firstWiki.id && this.state.id === null) {
                                 active = "listwikiactive"
                            }
                            else {
                                 active = "listwiki"
                            }
                            var title = val.subject.length > 20 ? val.title.slice(0, 20) + "..." : val.subject
                            return (
                                <div key={utils.randomString(20)}>
                                    <ListGroupItem key={key} onClick={this.getWiki.bind(this, val.id)} action className={active} >
                                        {title}
                                        <div className="card-actions float-right">
                                            <FontAwesomeIcon onClick={this.toggle.bind(this, val.id, val.title, val)} style={{ cursor: 'pointer' }} icon={faTrash} />
                                        </div>
                                    </ListGroupItem>
                                </div>
                            );

                        })}</div>

                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Confirm</ModalHeader>
                        <ModalBody>
                            Bạn có chắc muốn xóa {this.state.nameWiki} ?
                                 </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.toggle}>Cancel</Button>
                            <Button color="success" onClick={this.DeleteWiki}>OK</Button>
                        </ModalFooter>
                    </Modal>
                    <ListGroupItem className="listwiki" >
                        {this.state.addwiki &&
                            <center className="mr-1">
                                <div onClick={this.addwiki}>
                                    <PlusCircle />
                                </div></center>}
                        {!this.state.addwiki &&
                            <InputGroup>
                                <Input onKeyUp={(event) => { this.addwikinew(event) }} onChange={(event) => { this.isChange(event) }} placeholder="Name new Wiki" />
                            </InputGroup>}
                    </ListGroupItem>
                </ListGroup>}
            </Card>
        );
    }
}
export default ListWiki;