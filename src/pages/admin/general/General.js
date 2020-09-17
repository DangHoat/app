import React from "react";
import {
    Badge, 
    Button, 
    Card, CardBody, CardHeader, CardTitle, 
    Col, Row,  
    FormGroup, 
    Input, 
    Label, 
    Modal, ModalHeader, ModalBody, ModalFooter,
    Alert
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobeAmericas, faKey, faTags} from "@fortawesome/free-solid-svg-icons";
import "./General.css";
import Notification from "../../../components/Notification";
import { CustomImg } from "../../../components/CustomTag";
import { Camera } from "react-feather";

const api = require("./api/generalApi");
const utils = require("../../../utils/utils");

class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: {
				drop: false
			},
            file: null,
            data: [],
            isLoaded: false,
            modal: false,
            id_project: null,
            password: null,
            changeName: null,
            changeDescription: null,
            changeIsPrivate: null,
            logo: null,
            changeLogo: null,
            tempLogo: null,
            error: '',
            form: [],
        };
        this.handleChange = this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.handleSaveChange = this.handleSaveChange.bind(this)
        this.handleChangeType = this.handleChangeType.bind(this)
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event){
        let name = event.target.name
        let value = event.target.value
        this.setState({
            [name]: value,
            form: [...this.state.form,event.target.name]
        });
        
    }

    handleChangeType(type){
        this.setState({
            changeIsPrivate: type === "private",
            form: [...this.state.form,type]
        });
    }

    handleAddTag(event){
        if (event.key === "Enter") {
            let tag = document.getElementById("inputTags").value;
            if (utils.ValidInput.isEmpty(tag)) {
                Notification("warning", "Empty value", "Tag is empty value")
            } else {
                if(tag!==""){
                    let data = Object.assign({}, this.state.data);
                    data.tags.push(tag);
                    this.setState({data: data});
                    api.addTag(data, (err, result) => {
                        if(err){
                            Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                        } else {
                            this.setState({data: result});
                        }
                    })
                }
            }
        }
    }

    handleRemoveTag(index){
        let data = Object.assign({}, this.state.data);
        data.tags.splice(index, 1);
        this.setState({data: data})
        api.removeTag(data, (err, result) => {
            if(err){
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                this.setState({data: result});
            }
        })
    }

    handleImageChange(event) {
        this.setState({
            changeLogo: event.target.files[0],
            tempLogo: URL.createObjectURL(event.target.files[0])
        })   
    } 

    handleSaveChange(){
        this.props.handleLoading(true);
        let infoProject = {}
        this.state.form.map((value, key) => {
            switch (value) {
                case "changeDescription":
                    infoProject.description = this.state.changeDescription
                    break
                case "changeName":
                    infoProject.name = this.state.changeName
                    break
                case "public":
                    infoProject.is_private = false
                    break
                case "private":
                        infoProject.is_private = true
                        break
                default:
                    break;
            }
        })
        api.modifyProject(this.state.id_project, infoProject, (err, result)=>{
            if(err){
                this.props.handleLoading(false)
                this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false })
            } else {
                this.setState({form: []})
                this.props.handleLoading(false);
            }
            
        })
        const formLogo = new FormData();
        formLogo.append("logo", this.state.changeLogo);
        if (this.state.changeLogo !== null){
            api.changePhoto(formLogo, (err, result) => {
                if (err) {
                    this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false })
                }
                else{
                    this.setState({logo: result.logo});
                    sessionStorage.setItem('project', JSON.stringify(result));
                }
            })
        }
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
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
    
    handleKeyPress(e) { 
        if (e.target.value !== '') {
            if (e.key === 'Enter') {
                this.handleDelProject();  
            }
        }
    };

    handleDelProject(){
        const {id_project, password} = this.state
            api.deleteProject(id_project,password, (err,result)=>{ 
            if(err){
                this.setState({ error : err.data === undefined ? err : err.data._error_message, loading: false })
            } else {
                this.handleCloseModal('drop');
                sessionStorage.removeItem('project')
                window.location.replace('/project')
            }
        }) 
    }

    componentDidMount() {
        const that = this;
        api.getInfoProject((err, result)=>{
            if(err){
                Notification("error", "Project info", "Error when loading project information!!!")
            } else {
                const { id, name, description, is_private, logo } = result;
                that.setState({
                    data: result, 
                    isLoaded: true, 
                    id_project: id, 
                    changeName: name, 
                    changeDescription: description, 
                    changeIsPrivate: is_private, 
                    logo: logo,
                })
            }
        })
    }

    render() {
        const { error } = this.state;
        return (
            !this.state.isLoaded ? null :
            <Card className="admin__general__card">
                {error &&
                    <Alert color="danger" className="p-2">{error}</Alert>
                }
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0" >
                        Project detail
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="8">
                            <FormGroup>
                                <Label for="inputProjectName">Project name</Label>
                                <Input
                                    type="text"
                                    name="changeName"
                                    placeholder="Project name"
                                    autoComplete="off"
                                    defaultValue={this.state.data.name}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input
                                    type="textarea"
                                    rows="2"
                                    name="changeDescription"
                                    placeholder="Something about project"
                                    autoComplete="off"
                                    defaultValue={this.state.data.description}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="inputTags">
                                    <FontAwesomeIcon icon={faTags} size="xs"/>
                                    {
                                        this.state.data.tags.map((tag, index) => {
                                            return (
                                                <Badge
                                                    key={index}
                                                    className="badge-pill ml-1 mr-1 " color="info">
                                                    <label className="mb-0">{tag}</label>
                                                    &nbsp;
                                                    <label className="mb-0 cursor-pointer" id={index} onClick={()=>this.handleRemoveTag(index)}>X</label>
                                                </Badge>
                                            )
                                        })
                                    }
                                </Label>
                                <Input
                                    type="text"
                                    id="inputTags"
                                    placeholder="Enter tag"
                                    autoComplete="off"
                                    onKeyPress={this.handleAddTag}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Row className="mt-4">
                                    <Col className="col-6">
                                        <Button
                                            type="button"
                                            id="inputPublic"
                                            onClick={this.handleChangeType.bind(this,'public')}
                                            color="primary"
                                            outline
                                            active={!this.state.changeIsPrivate}
                                        >
                                            <FontAwesomeIcon icon={faGlobeAmericas}/> Public
                                        </Button>
                                    </Col>
                                    <Col className="col-6">
                                        <Button
                                            type="button"
                                            id="inputPrivate"
                                            onClick={this.handleChangeType.bind(this,'private')}
                                            color="warning"
                                            outline
                                            active={this.state.changeIsPrivate}
                                        >
                                            <FontAwesomeIcon icon={faKey}/> Private
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-5">
                            <div className="admin__general__containerImgUpdate">
                                <CustomImg
                                    alt="Avatar project"
                                    src={this.state.tempLogo || this.state.logo}
                                    className="rounded-circle img-responsive mt-2 admin__imgUpdate"
                                    width="128"
                                    height="128"
                                />
                                <Label className="admin__general__iconUpdateAvt" for="logoChange" >
                                    <Input type="file" id="logoChange" hidden onChange={this.handleImageChange}/>
                                    <Camera size="50%" className="admin__general__iconUpdateEffect"/>
                                    <div className="admin__general__iconUpdateEffect">Update</div>
                                </Label>
                            </div>
                            <div className="text-center pt-3">
                                <small>
                                    For best results, use an image at least 128px by 128px in .jpg format
                                </small>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="8">
                            <Button type="button" color="primary" onClick={this.handleSaveChange.bind(this)}>Save changes</Button>
                        </Col>
                        <Col md="4">
                            <Button type="button" color="danger" onClick={this.handleShowModal.bind(this, 'drop')}>Delete project</Button>
                            <Modal isOpen={this.state.showModal.drop}>
                                {error &&
                                    <Alert  color="danger"  className="p-2" >Wrong password</Alert>
                                }
                                <ModalHeader>Confirm</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label>Please enter your password to delete project</Label>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="nope"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            onKeyPress={this.handleKeyPress.bind(this)}
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.handleCloseModal.bind(this, 'drop')}>Cancel</Button>
                                    <Button color="success" onClick={this.handleDelProject.bind(this)}>OK</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

// export default connect()(General);
export default General;