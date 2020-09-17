import React from "react";
import {
	Card, CardBody, CardHeader, CardTitle,
	Col, Row,
	Container,
	Table,
	ListGroup, ListGroupItem,
	Input
} from "reactstrap";
import Notification from "../../components/Notification";
import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
const api = require("./api/api");
const ValidInput = require("../../utils/ValidInput");
const utils = require("../../utils/utils");

class RowMember extends React.Component {
	constructor(props) {
		super(props);
		const data = this.props;
		this.state = {
			data: data
		}
	}

	render() {
		const { infomember, index } = this.state.data
		return (
			<tr key={infomember.id}>
				<td scope="row">
					{index + 1}
				</td>
				<td>
					<CustomImg
						src={infomember.photo}
						className="img--user--square-3x mr-1"
						alt="Avatar"
					/>
					<a href='#' className="text-decoration-none text-reset"> {infomember.full_name} </a>
				</td>
				<td>{infomember.role_name}</td>
				<td>{infomember.user_email}</td>
				<td>{infomember.gender}</td>
				<td>{infomember.address}</td>
				<td>{infomember.phone_number}</td>
			</tr>
		)
	}
}

class Clients extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: {
				role: false,
				listMemberships: false
			},
			role: {
				id: [],
				name: []
			},
			listMemberships: [],
			find: {
				role_name: "all",
				keyWord: null
			}
		};
		this.changeOptionDisplay = this.changeOptionDisplay.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	changeOptionDisplay(setOptionTo) {
		let state = Object.assign({}, this.state);
		state.find.role_name = setOptionTo;
		this.setState(state);
	}
	handleSearch(event) {
		let state = Object.assign({}, this.state);
		state.find.keyWord = event.target.value;
		this.setState(state);
	}

	componentDidMount() {
		let state = Object.assign({}, this.state);
		//state.listMemberships = utils.getMemberInProject();
		if (ValidInput.isEmpty(state.listMemberships)) {
			api.listMemberships((err, result) => {
				if (err) {
					Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
				} else {
					state.listMemberships = result;
					state.isLoaded.listMemberships = true;
					this.setState(state);
				}
			})
		} else {
			state.isLoaded.listMemberships = true;
			this.setState(state);
		}
		api.getIdRole((err, result) => {
			if (err) {
				Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
			} else {
				result.map((result) => {
					state.role.id.push(result.id);
					state.role.name.push(result.subject);
				});
				state.isLoaded.role = true;
				this.setState(state);
			}
		})
	}

	render() {
		return (
			(!this.state.isLoaded.role || !this.state.isLoaded.listMemberships) ? <LoadingSprinner /> :
				<React.Fragment>
					<Container fluid className="p-0">
						<h1 className="h3 mb-3">Project member management page</h1>
						<Row>
							<Col xl="3">
								<Card>
									<CardHeader>
										<CardTitle tag="h5" className="mb-0">
											Team
								</CardTitle>
									</CardHeader>
									<ListGroup flush>
										<ListGroupItem tag="a" href="#" action className={this.state.find.role_name === "all" ? "active" : "inactive"} onClick={this.changeOptionDisplay.bind(this, "all")}>
											All
								</ListGroupItem>
										{
											this.state.role.id.map((idRole, index) => {
												return (
													<ListGroupItem tag="a" href="#" key={utils.randomString()} action className={this.state.find.role_name === idRole ? "active" : "inactive"} onClick={this.changeOptionDisplay.bind(this, idRole)}>
														{this.state.role.name[index]}
													</ListGroupItem>
												)
											})
										}
									</ListGroup>
								</Card>
							</Col>
							<Col xl="9">
								<Card>
									<CardHeader>
										<CardTitle tag="h5" className="mb-0">
											<Row className="d-flex justify-content-between">
												<Col xl="6">
													Member information
											</Col>
												<Col xl="3">
													<Input type="search" id="inputSearch" placeholder="Search from member infomation" onKeyUp={this.handleSearch.bind(this)} />
												</Col>
											</Row>
										</CardTitle>
									</CardHeader>

									<CardBody>
										<Table className="mb-0">
											<thead>
												<tr>
													<th>Stt</th>
													<th>Name</th>
													<th>Role name</th>
													<th>Email</th>
													<th>Gender</th>
													<th>Address</th>
													<th>Phone</th>
												</tr>
											</thead>
											<tbody>
												{
													this.state.listMemberships.map((infoMember, index) => {
														let keyWord = ValidInput.isEmpty(this.state.find.keyWord) ? this.state.find.keyWord : this.state.find.keyWord.toLowerCase();
														let team = this.state.find.role_name;
														if (ValidInput.isEmpty(infoMember.full_name)) {
															Notification("warning", "Data field has errors", "Please go to admin page check infomation all member. This member will hide");
														} else {
															if (team !== "all") {
																if (infoMember.role === team) {
																	if (ValidInput.isEmpty(keyWord)) {
																		return (
																			<RowMember infomember={infoMember}
																				role={this.state.role}
																				key={utils.randomString()}
																				index={index}
																			/>
																		);
																	}
																	else {
																		if (((infoMember.full_name.toLowerCase()).indexOf(keyWord) !== -1)) {
																			return (
																				<RowMember infomember={infoMember}
																					role={this.state.role}
																					key={utils.randomString()}
																					index={index}
																				/>
																			);
																		}
																	}
																}
															}
															else {
																if (ValidInput.isEmpty(keyWord)) {
																	return (
																		<RowMember infomember={infoMember}
																			role={this.state.role}
																			key={utils.randomString()}
																			index={index}
																		/>
																	);
																}
																else {
																	if (((infoMember.full_name.toLowerCase()).indexOf(keyWord) !== -1)) {
																		return (
																			<RowMember infomember={infoMember}
																				role={this.state.role}
																				key={utils.randomString()}
																				index={index}
																			/>
																		);
																	}
																}
															}
														}
													})
												}
											</tbody>
										</Table>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</Container>
				</React.Fragment>
		)
	}
}

export default Clients;