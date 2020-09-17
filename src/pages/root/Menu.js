import React from 'react';
import './root.css';
import {
  
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Navbar,
  NavbarBrand,
  Button, Input
} from 'reactstrap';
import Select from 'react-select';
import { PlusCircle } from "react-feather";
import listuser from './ListUser.json';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      valueAddAdmin: [],
      optionListUser: [],

      multiple: false,
    };
    this.isChange = this.isChange.bind(this)
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
    this.setState({
      optionListUser: listuser.map((val,key)=>{return ({label: val.username, value: val.username})})
    });
  }
  isChange = (event) => {
    let valueaddAdmin=[]
    event.map((e)=>valueaddAdmin.push(e.value))
    this.setState({
      valueAddAdmin: valueaddAdmin
    })
  }
  getValueAddAdmin = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
    alert(`Nguyễn Quốc Uy vừa thêm ${this.state.valueAddAdmin} làm admin`)

  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand><Button onClick={() => { this.props.isOpenAdmin() }} color="secondary">Admin</Button></NavbarBrand>
          <NavbarBrand ><Button onClick={() => { this.props.isOpenUser() }} className="buttontop" color="secondary">User</Button></NavbarBrand>
          <Button onClick={() => { this.toggle() }} className="positionPlus" ><PlusCircle /></Button>
          <Modal
            isOpen={this.state.isOpen}
            toggle={() => this.toggle()}
            centered>
            <ModalHeader toggle={() => this.toggle()}>
              Add Admin
            </ModalHeader>
            <ModalBody>
              <div className="m-sm-4">
                <Form>
                  <Select options={this.state.optionListUser} isMulti onChange={(event) => { this.isChange(event) }}/>
                </Form>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => this.toggle()}>
                Close
                  </Button>{" "}
              <Button
                color="info"
                onClick={() => this.getValueAddAdmin()}
              >
                Save changes
                  </Button>
            </ModalFooter>
          </Modal>
        </Navbar>
      </div>
    );
  }
}
