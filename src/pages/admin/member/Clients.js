import React from "react";
import {
	Card, CardBody, CardHeader, CardTitle,
	Table, Col, Row,
	Container,
	Button, CustomInput,
	ModalHeader, ModalFooter, Modal,
} from "reactstrap";
import "./Clients.css"
import { Trash2 } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ModalBody from "reactstrap/es/ModalBody";
import Notification from "../../../components/Notification";
import { CustomImg, LoadingSprinner } from "../../../components/CustomTag";
import { FormGroup, Input, Label } from "reactstrap";
const api = require("./api/clientsApi");
const ValidInput = require("../../../utils/ValidInput");
const utils = require("../../../utils/utils");

class RowMember extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: {
				drop: false,
				change: false
			}
		}
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.eventClickButtonSure = this.eventClickButtonSure.bind(this);
		this.eventClickButtonChange = this.eventClickButtonChange.bind(this);
	}
	handleShowModal(modal) {
		let state = Object.assign({}, this.state);
		state.showModal[modal] = true;
		this.setState(state)
	}
	handleCloseModal(modal) {
		let state = Object.assign({}, this.state);
		state.showModal[modal] = false;
		this.setState(state);
	}
	eventClickButtonSure() {
		this.props.handleDeleteMember(this.props.index);
		this.handleCloseModal('drop');
	}
	eventClickButtonChange() {
		this.props.handleSwitchIsAdminChange(this.props.index);
		this.handleCloseModal('change');
	}
	render() {
		return (
			<React.Fragment>
				<React.Fragment>
					{/* Modal delete member*/}
					<Modal isOpen={this.state.showModal.drop}>
						<ModalHeader>Delete Member</ModalHeader>
						<ModalBody>
							Are you sure to delete this member?
						</ModalBody>
						<ModalFooter>
							<Button color="secondary" onClick={this.handleCloseModal.bind(this, 'drop')}>
								Cancel
							</Button>
							<Button color="success" onClick={this.eventClickButtonSure.bind(this)}>
								Sure
							</Button>
						</ModalFooter>
					</Modal>
					{/* End modal here */}

					{/* Modal change admin*/}
					<Modal isOpen={this.state.showModal.change}>
						<ModalHeader>Change Admin</ModalHeader>
						<ModalBody>
							Are you sure to change admin for this member?
						</ModalBody>
						<ModalFooter>
							<Button color="secondary" onClick={this.handleCloseModal.bind(this, 'change')}>
								Cancel
							</Button>
							<Button color="success" onClick={this.eventClickButtonChange.bind(this)}>
								Change
							</Button>
						</ModalFooter>
					</Modal>
					{/* End modal here */}
				</React.Fragment>

				<React.Fragment>
					<tr>
						<td>{this.props.index}</td>
						<td>
							<CustomImg
								src={this.props.photo}
								width="32"
								height="32"
								className="rounded-circle my-n1"
								alt="Avatar"
							/>
							<a href={this.props.href} className="text-decoration-none"> {this.props.full_name} </a>
						</td>
						<td>{this.props.user_email}</td>
						<td>{this.props.phone_number}</td>
						<td>
							{
								this.props.is_admin && this.props.user !== utils.getUserId() ?
									<Input id="roleMember" type="select" disabled>
										<option>{this.props.role_name}</option>
									</Input>
									:
									<Input id="roleMember" type="select" style={{ cursor: 'pointer' }} onChange={(event) => this.props.handleEditRole(event, this.props.id)}>
										{
											this.props.role.map((role, index) => {
												let check;
												this.props.roleUser === role.id ? check = true : check = false
												return (
													<option selected={check} key={utils.randomString()} value={role.id}>{role.name}</option>
												)
											})
										}
									</Input>
							}
						</td>
						<td>
							<CustomInput
								type="switch"
								id={this.props.id}
								name="customSwitch{id}"
								checked={this.props.checked}
								style={{ cursor: 'pointer' }}
								onChange={!this.props.is_admin ? this.handleShowModal.bind(this, 'change') : null}
							/>
						</td>
						<td>
							{!this.props.is_admin ?
								<Trash2
									onClick={this.handleShowModal.bind(this, 'drop')}
									style={{ cursor: 'pointer' }}
								/>
								:
								<Trash2 color="gray" />
							}

						</td>
					</tr>
				</React.Fragment>
			</React.Fragment>
		)
	}
};

class Clients extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: {
				add: false,
				drop: false,
				change: false
			},
			isLoaded: {
				getIdRole: false,
				getListMemberships: false,
				getMemberSuggestions: false
			},
			role: [],
			listMemberships: [],
			memberSuggestions: [],
			find: {
				search: [],
				chars: null
			},
			fieldSearch:"full_name",
			listuserOrigin: [],
            
		};
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.eventSearchNewMember = this.eventSearchNewMember.bind(this);
		this.handleSearchNewMember = this.handleSearchNewMember.bind(this);
		this.handleCreateMember = this.handleCreateMember.bind(this);
		this.handleSwitchIsAdminChange = this.handleSwitchIsAdminChange.bind(this);
		this.handleDeleteMember = this.handleDeleteMember.bind(this);
		this.handleEditRole = this.handleEditRole.bind(this);
		this.eventClickAvatarSugges = this.eventClickAvatarSugges.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getSelectSearch = this.getSelectSearch.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	handleChange(event) {
		this.setState({ roleNewMember: event.target.value });
	}

	handleShowModal(modal) {
		let state = Object.assign({}, this.state);
		state.showModal[modal] = true;
		this.setState(state)
	}
	handleCloseModal(modal) {
		let state = Object.assign({}, this.state);
		state.showModal[modal] = false;
		this.setState(state);
	}
	eventSearchNewMember(event) {
		let keyWord = event.target.value;
		this.setState({
			[event.target.name]: event.target.value
		})
		this.handleSearchNewMember(keyWord.toLowerCase());
	}
	handleSearchNewMember(informationSearch) {
		let state = Object.assign({}, this.state);
		// xóa dl những người được hiển thị cũ đi để sau khi map push vào sẽ là dl mới không bị trùng với người cũ đã có
		state.find.search = [];
		state.memberSuggestions.map((memberSuggestion) => {
			// so sánh username tất cả các thành viên trong project nếu có kí tự trùng thì thêm vào state
			if ((memberSuggestion.full_name.toLowerCase()).indexOf(informationSearch) !== -1 || (memberSuggestion.email.toLowerCase()).indexOf(informationSearch) !== -1) {
				state.find.search.push(memberSuggestion);
			}
		})
		this.setState(state);
	}

	handleSearch(event){
		var value = event.target.value
		var name = this.state.fieldSearch
		let listuserTemp = []
		if (value.length > 0) {
			this.state.listuserOrigin.map((item) => {
				if ((name === 'full_name' ? item.full_name : name === 'user_email' ? item.user_email : item.role_name ).toLowerCase().indexOf(value.toLowerCase()) !== -1) {
					listuserTemp.push(item)
				}
			})
			this.setState({
				listMemberships: listuserTemp
			});
		}
		else
			this.setState({
				listMemberships: this.state.listuserOrigin
			})
	}

	handleCreateMember() {
		let dataSent = {
			"role": this.state.roleNewMember,
			"username": this.state.inputSearchAllMember
		}
		api.createMember(dataSent, (err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				let state = Object.assign({}, this.state);
				state.listMemberships.push(result);
				this.setState(state);
				this.handleCloseModal('add');
			}
		})
	}

	handleDeleteMember(index) {
		let state = this.state;
		api.deleteMembership(state.listMemberships[index - 1].id, (err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				try {
					state.listMemberships.splice(index - 1, 1);
				} catch (error) {
					Notification("warning", "Could not find the username to delete")
				}
				this.setState(state);
			}
		})
		this.handleCloseModal('drop');
	}

	handleSwitchIsAdminChange(index) {
		let state = Object.assign({}, this.state);
		let dataSent = {
			"value": !state.listMemberships[index - 1].is_admin,
			"idMemberChange": state.listMemberships[index - 1].id
		}
		api.editIsAdmin(dataSent, (err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				state.listMemberships[index - 1].is_admin = dataSent.value;
				this.setState(state);
			}
		})
		this.setState({
			listMemberships: state.listMemberships
		});
		this.handleCloseModal('change');
	}
	handleEditRole(event, idMember) {
		let dataSent = {
			"idMemberChange": idMember,
			"value": event.target.value
		}
		api.editRoleMember(dataSent, (err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				let state = Object.assign({}, this.state);
				state.listMemberships.forEach((element, key) => {
					if (element.id === idMember) {
						state.listMemberships[key].role = dataSent.value;
						this.setState(state);
					}
				});
				Notification("success");
			}
		})
	}
	eventClickAvatarSugges(username) {
		document.getElementById("inputSearchAllMember").value = username;
		this.setState({ inputSearchAllMember: username });
	}

	getSelectSearch(event){
		this.setState({
			fieldSearch:event.target.value
		});
	}
	componentDidMount() {
		let state = Object.assign({}, this.state);
		api.getListMemberships((err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				state.listMemberships = result;
				state.listuserOrigin=result;
				state.isLoaded.getListMemberships = true;
				this.setState(state);
			}
		})
		api.getIdRole((err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				result.map(({ id, subject }) => {
					let element = {
						id: id,
						name: subject
					};
					state.role.push(element);
				});
				state.roleNewMember = state.role[0].id;
				state.dropDownValue = state.role[0].name;
				state.isLoaded.getIdRole = true;
				this.setState(state);
			}
		})
		api.getMemberSuggestions((err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message)
			} else {
				state.memberSuggestions = result;
				state.isLoaded.getMemberSuggestions = true;
				this.setState(state);
			}
		})
	}

	render() {
		return (
			(!this.state.isLoaded.getIdRole || !this.state.isLoaded.getListMemberships || !this.state.isLoaded.getMemberSuggestions) ? (<LoadingSprinner />) :
				<Container fluid className="p-0">
					<Row>
						<Col xl="12">
							<React.Fragment>
								{/* Modal add member*/}
								<Modal isOpen={this.state.showModal.add}>
									<ModalHeader>Add Member</ModalHeader>
									<ModalBody>
										<FormGroup id="form-create-member">
											<Row>
												<Col md="2" className="mr-0">
													<Label className="align-middle">Email</Label>
												</Col>
												<Col md="10" className="ml-0">
													<Input type="text" name="inputSearchAllMember" id="inputSearchAllMember" placeholder="Filter user or email to invite" onKeyUp={this.eventSearchNewMember.bind(this)} />
												</Col>
											</Row>
											<Row className="mt-1">
												<Col md="2" className="mr-0">
													<Label className="align-middle">Role</Label>
												</Col>
												<Col md="10" className="ml-0">
													<Input id="roleNewMember" type="select" value={this.state.roleNewMember} onChange={this.handleChange} style={{ cursor: 'pointer' }}>
														{
															this.state.isLoaded.getIdRole === true ?
																this.state.role.map((role, index) => {
																	return (
																		<option key={utils.randomString()} value={role.id}>{role.name}</option>
																	)
																}) : null
														}
													</Input>
												</Col>
											</Row>
											<Row className="mt-3 Clients__suggestion">
												{
													this.state.find.search.map((search) => {
														return (
															<Col style={{ cursor: 'pointer' }} md="6" className="pt-2 align-middle Clients__suggestion--member border-top border-left">
																<Row className="mb-2" key={utils.randomString()} onClick={this.eventClickAvatarSugges.bind(this, search.email)}>
																	<Col md="4">
																		<CustomImg
																			src={search.photo}
																			width="32"
																			height="32"
																			className="rounded-circle"
																			alt="Avatar"
																		/>
																	</Col>
																	<Col md="8">
																		<div>{search.full_name}</div>
																	</Col>
																</Row>
															</Col>
														)
													})
												}
											</Row>
										</FormGroup>
									</ModalBody>
									<ModalFooter>
										<Button color="secondary" onClick={this.handleCloseModal.bind(this, 'add')}>
											Cancel
								</Button>
										<Button color="success" onClick={this.handleCreateMember.bind(this)}>
											Add
								</Button>
									</ModalFooter>
								</Modal>

								{/* Modal delete member*/}
								<Modal isOpen={this.state.showModal.drop}>
									<ModalHeader>Delete Member</ModalHeader>
									<ModalBody>
										Are you sure to delete this member?
							</ModalBody>
									<ModalFooter>
										<Button color="secondary" onClick={this.handleCloseModal.bind(this, 'drop')}>
											Cancel
								</Button>
										<Button color="success" onClick={this.handleDeleteMember.bind(this)}>
											Sure
								</Button>
									</ModalFooter>
								</Modal>
								{/* End modal here */}

								{/* Modal change admin*/}
								<Modal isOpen={this.state.showModal.change}>
									<ModalHeader>Change Admin</ModalHeader>
									<ModalBody>
										Are you sure to change admin for this member?
								</ModalBody>
									<ModalFooter>
										<Button color="secondary" onClick={this.handleCloseModal.bind(this, 'change')}>
											Cancel
								</Button>
										<Button color="success" onClick={this.handleSwitchIsAdminChange.bind(this)}>
											Change
								</Button>
									</ModalFooter>
								</Modal>
								{/* End modal here */}

								<Card>
									<CardHeader>
										<Row>
											<Col xl="3">
												<CardTitle tag="h5" className="mb-0">
													Member information
												</CardTitle>
											</Col>
											<Col xl="6" className="input-group">
												<Col xl="9" className="p-0">
													<Input className="rounded-0" type="search" id="inputSearchMemberproject" placeholder="Search from member infomation" onKeyUp={this.handleSearch.bind(this)} />
												</Col>
												<Col xl="3"  className="p-0">
													<Input className="rounded-0" type="select" onChange={(event) => this.getSelectSearch(event)}>
														<option value="full_name">Name</option>
														<option value="user_email">Email</option>
														<option value="role_name">Role</option>
													</Input>
												</Col>	
											</Col>
											<Col xl="3">
												<Button className="float-right" onClick={this.handleShowModal.bind(this, 'add')}><FontAwesomeIcon icon={faPlus} /> New member</Button>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<Table className="mb-0">
											<thead>
												<tr>
													<th>ID</th>
													<th>Member</th>
													<th>Email</th>
													<th>Phone</th>
													<th>Role</th>
													<th>Is admin</th>
													<th>Delete</th>
												</tr>
											</thead>
											<tbody>
												{
													this.state.listMemberships.map(({ photo, full_name, user_email, phone_number, id, is_admin, user, role, role_name }, index) => {
														return (
															<RowMember
																key={utils.randomString()}
																photo={photo}
																full_name={full_name}
																user_email={user_email}
																phone_number={phone_number}
																id={id}
																checked={is_admin ? true : is_admin}
																role={this.state.role}
																role_name={role_name}
																roleUser={role}
																user={user}
																is_admin={is_admin}
																href={user === utils.getUserId() ? "/profile" : "/profile?email=" + user_email}
																index={index + 1}
																handleDeleteMember={this.handleDeleteMember}
																handleSwitchIsAdminChange={this.handleSwitchIsAdminChange}
																handleEditRole={this.handleEditRole}
															/>
														);
													})
												}
											</tbody>
										</Table>
									</CardBody>
								</Card>
							</React.Fragment>
						</Col>
					</Row>
				</Container>
		)
	}
}

export default Clients;