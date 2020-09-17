import React, { Component } from 'react';
import Notification from "../../../components/Notification";
import LoadingSprinner from "../../../components/LoadingSprinner"
import { Button, Card, CardBody, CardHeader, CardTitle, Form, FormGroup, Label, Input, Modal, ModalBody, ModalFooter, FormFeedback, CustomInput, Col } from "reactstrap";
import { FileText, Phone, MessageSquare, User, Mail, Camera, MapPin, Users, Package } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { CustomImg } from "../../../components/CustomTag"
import { connect } from "react-redux";
import "../Profile.css"

const api = require('../api/api');
class ProfDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkMainAcc: window.location.search.substring(7, window.location.search.length),   //Exist icon to update info if profile page belong to user login
            tempAvt: null,          //show a temp avatar before update avatar
            isLoadedImg: true,      //wait api update avatar
            isLoadedInfo: true,     //wait api update info
            data: this.props.data,  //info user
            modal: false,
            submitted: false,       //check form is invalid
            checkChangePass: false, //if false, we don't call api change password

            //values to update
            //avatar
            fileUpdateAvt: null,
            //password
            new_pass: null,
            confirm_new_pass: null,
            //info
            changeFullname: this.props.data.full_name,
            changeGender: this.props.data.gender,
            changePhone_number: this.props.data.phone_number,
            changeAddress: this.props.data.address,
            changeBio: this.props.data.bio,
        }
        this.updateUser = this.updateUser.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleChangeAvatar = this.handleChangeAvatar.bind(this)
        this.handleChangeValue = this.handleChangeValue.bind(this)
    }

    updateUser(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const formPhoto = new FormData();
        formPhoto.append("avatar", this.state.fileUpdateAvt);
        let { changeFullname, changeBio, changeGender, changePhone_number, changeAddress, data, checkChangePass, new_pass, old_pass, confirm_new_pass } = this.state

        if (!changeFullname) return;
        if (checkChangePass) {
            if ((!/(?=^.{8,}$).*$/i.test(new_pass)) || (new_pass !== confirm_new_pass)) {
                return;
            }
        }
        if (changeFullname !== data.full_name || changeBio !== data.bio || changeGender !== data.gender || changePhone_number !== data.phone_number || changeAddress !== data.address) {
            api.updateUserInfo({ full_name: changeFullname, bio: changeBio, gender: changeGender, phone_number: changePhone_number, address: changeAddress }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
                }
                else {
                    this.setState(prevState => ({
                        data: {
                            ...prevState.data,
                            full_name: changeFullname,
                            gender: changeGender,
                            phone_number: changePhone_number,
                            address: changeAddress,
                            bio: changeBio
                        }
                    }))
                    var local = JSON.parse(localStorage.getItem('userInfo'))
                    localStorage.setItem('userInfo', JSON.stringify({
                        id: local.id,
                        token: local.token,
                        full_name: result.full_name,
                        photo: local.photo
                    }))
                    Notification('success', 'Update user info successfully', '')
                }
            })
        }
        if (checkChangePass) {
            api.changePassword({ current_password: old_pass, password: new_pass }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
                }
                else {
                    Notification('success', 'Change password successfully', '')
                }
            })
        }
        if (this.state.fileUpdateAvt !== null) {
            this.setState({ isLoadedImg: false });
            api.updateAvatar(formPhoto, (err, result) => {
                if (err) {
                    this.setState({ isLoadedImg: true });
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                }
                else {
                    const { dispatch } = this.props;
                    dispatch({ type: 'LOGIN_USER', user: result })
                    this.setState({ isLoadedImg: true, });
                    this.setState(prevState => ({
                        data: {
                            ...prevState.data,
                            photo: result.photo
                        }
                    }))
                    var local = JSON.parse(localStorage.getItem('userInfo'))
                    localStorage.setItem('userInfo', JSON.stringify({
                        id: local.id,
                        token: local.token,
                        full_name: local.full_name,
                        photo: result.photo
                    }))
                    Notification('success', 'Update avatar successfully', '')
                }
            })
        }
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
    }

    checkChangePass(event) {
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    handleChangeAvatar(event) {
        this.setState({
            fileUpdateAvt: event.target.files[0],
            tempAvt: URL.createObjectURL(event.target.files[0])
        })
    }

    handleChangeValue(event) {
        let value = event.target.value
        if (value === "") value = null
        this.setState({
            [event.target.name]: value
        });
    }

    toggle() {
        this.setState(prevState => ({
            changeFullname: this.state.data.full_name,
            changeGender: this.state.data.gender,
            changePhone_number: this.state.data.phone_number,
            changeAddress: this.state.data.address,
            changeBio: this.state.data.bio,
            modal: !prevState.modal,
            tempAvt: null,
            fileUpdateAvt: null,
            submitted: false,
            checkChangePass: false,
            new_pass: null,
            confirm_new_pass: null,
        }));
    }

    render() {
        const { submitted, new_pass, confirm_new_pass } = this.state;
        return (
            <Card>
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0 ">
                        Profile Details
                        {this.state.checkMainAcc == '' && <FontAwesomeIcon icon={faEdit} className="float-right Profile__pointer" onClick={this.toggle} />}
                    </CardTitle>
                </CardHeader>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <Form onSubmit={this.updateUser}>
                        <ModalBody>
                            <div className="Profile__containerImgUpdate">
                                <CustomImg
                                    src={this.state.tempAvt || this.state.data.photo}
                                    className="rounded-circle img-responsive mt-2 Profile__imgUpdate"
                                    width="128"
                                    height="128"
                                />
                                <Label className="Profile__iconUpdateAvt" for="updateAvt" >
                                    <Input type="file" id="updateAvt" hidden onChange={this.handleChangeAvatar} />
                                    <Camera size="50%" className="Profile__iconUpdateEffect" />
                                    <div className="Profile__iconUpdateEffect">Update</div>
                                </Label>
                            </div>

                            <FormGroup>
                                <Label className="text-primary">Fullname</Label><Label className="text-danger">*</Label>
                                <Input
                                    type="text"
                                    id="fullname"
                                    name="changeFullname"
                                    defaultValue={this.state.data.full_name}
                                    onChange={this.handleChangeValue}
                                    invalid={submitted && this.state.changeFullname === null ? true : false}
                                />
                                <FormFeedback invalid>Fullname is a required field!</FormFeedback>
                            </FormGroup>

                            <FormGroup>
                                <Label className="text-primary">Email</Label>
                                <Input
                                    type="text"
                                    id="email"
                                    name="changeEmail"
                                    defaultValue={this.state.data.email}
                                    disabled
                                />
                            </FormGroup>

                            <FormGroup row>
                                <Col sm="5">
                                    <FormGroup className="Profile__marginbottom">
                                        <Label className="text-primary">Mobile</Label>
                                        <Input
                                            type="text"
                                            id="phone_number"
                                            name="changePhone_number"
                                            defaultValue={this.state.data.phone_number}
                                            onChange={this.handleChangeValue}
                                            onKeyDown={(event) => {
                                                if (!["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Delete", "Backspace", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                                                    event.preventDefault()
                                                }
                                            }}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col sm="3">
                                    <FormGroup className="Profile__marginbottom">
                                        <Label className="text-primary">Gender</Label>
                                        <Input
                                            type="select"
                                            id="gender"
                                            name="changeGender"
                                            defaultValue={this.state.data.gender}
                                            onChange={this.handleChangeValue}>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>unknown</option>
                                        </Input>
                                    </FormGroup>
                                </Col>

                                <Col sm="4">
                                    <FormGroup className="Profile__paddingtop25rem Profile__marginbottom">
                                        <Label>
                                            <CustomInput
                                                type="checkbox"
                                                name="checkChangePass"
                                                id="checkChangePass"
                                                onChange={this.checkChangePass.bind(this)}
                                            />
                                        </Label>
                                        Change Password
                                    </FormGroup>
                                </Col>
                            </FormGroup>

                            {this.state.checkChangePass && <div>
                                <FormGroup>
                                    <Label className="text-primary">Old Password</Label>
                                    <Input
                                        type="password"
                                        name="old_pass"
                                        onChange={this.handleChangeValue}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label className="text-primary">New Password</Label>
                                    <Input
                                        type="password"
                                        name="new_pass"
                                        onChange={this.handleChangeValue}
                                        invalid={submitted && (!/(?=^.{8,}$).*$/i.test(new_pass)) ? true : false}
                                    />
                                    <FormFeedback invalid> Your new password must contain at least 8 or more characters</FormFeedback>
                                </FormGroup>

                                <FormGroup>
                                    <Label className="text-primary">Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        name="confirm_new_pass"
                                        onChange={this.handleChangeValue}
                                        invalid={submitted && new_pass !== confirm_new_pass ? true : false}
                                    />
                                    <FormFeedback invalid>Confirm password incorrect. Please retype the password</FormFeedback>
                                </FormGroup></div>}

                            <FormGroup>
                                <Label className="text-primary">Address</Label>
                                <Input
                                    type="text"
                                    id="address"
                                    name="changeAddress"
                                    defaultValue={this.state.data.address}
                                    onChange={this.handleChangeValue}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label className="text-primary">Bio</Label>
                                <Input
                                    type="text"
                                    id="bio"
                                    name="changeBio"
                                    defaultValue={this.state.data.bio}
                                    onChange={this.handleChangeValue}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" className="ml-2" color="secondary" onClick={this.toggle}>Cancel</Button>
                            <Button type="submit" className="mr-2" color="success" >Save</Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                <CardBody className='text-center'>
                    {!this.state.isLoadedImg ? <LoadingSprinner /> :
                        <CustomImg
                            src={this.state.data.photo}
                            className="rounded-circle img-responsive mb-2"
                            width="128"
                            height="128"
                        />}
                    <CardTitle className="text-center">
                        <strong><div>{this.state.data.full_name}</div></strong>
                    </CardTitle>
                </CardBody>

                <hr />

                <CardBody>
                    <CardTitle tag="h5">About</CardTitle>
                    <ul className="list-unstyled mb-0">
                        <div>
                            <li className="mb-1">
                                <Mail width={14} height={14} className="mr-1" /> Email: {this.state.data.email !== null ? this.state.data.email : <i className="Profile__font-size-078rem">Updating</i>}
                            </li>
                        </div>

                        <div>
                            <li className="mb-1">
                                <User width={14} height={14} className="mr-1" /> Gender: {this.state.data.gender !== null ? this.state.data.gender : <i className="Profile__font-size-078rem">Updating</i>}
                            </li>
                        </div>

                        <div>
                            <li className="mb-1">
                                <Phone width={14} height={14} className="mr-1" /> Mobile: {this.state.data.phone_number !== null ? this.state.data.phone_number : <i className="Profile__font-size-078rem">Updating</i>}
                            </li>
                        </div>

                        <div>
                            <li className="mb-1">
                                <MapPin width={14} height={14} className="mr-1" /> Address: {this.state.data.address !== null ? this.state.data.address : <i className="Profile__font-size-078rem">Updating</i>}
                            </li>
                        </div>

                        <div>
                            <li className="mb-1">
                                <Package width={14} height={14} className="mr-1" /> Projects: {this.state.data.total_projects}
                            </li>
                        </div>

                        {/* <div>
                            <li className="mb-1">
                                <FileText width={14} height={14} className="mr-1" /> Works: {this.state.data.total_closed_works}
                            </li>
                        </div> */}

                        <div>
                            <li className="mb-1">
                                <Users width={14} height={14} className="mr-1" /> Colleagues: {this.state.data.total_contacts}
                            </li>
                        </div>
                    </ul>
                    <hr /><MessageSquare width={14} height={14} className="mr-1" /> Introduce:{this.state.data.bio}
                </CardBody>
            </Card>
        );
    }
}

export default connect()(ProfDetails);