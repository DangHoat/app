import React from "react";
import SearchBox from "../../components/SearchBox";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Row,
  UncontrolledDropdown,
  Table,
  ListGroup, ListGroupItem,
  UncontrolledButtonDropdown,
  CustomInput,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Form,
  FormGroup,
  Pagination
} from "reactstrap";
import { faUpload, faDownload, faSortAmountDownDown, faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import './StorageLayout.css'
import paginationFactory from "react-bootstrap-table2-paginator";
class FileSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navActive: "mine"
    }
    this.handleSelectNav.bind(this)
  }

  handleSelectNav(action) {
    this.setState({
      navActive: action
    })
  }

  render() {
    return (
      <React.Fragment>
      <Card>
        <ListGroup flush>
          <ListGroupItem tag="a" href="#" action className={this.state.navActive === "mine" ? "active" : "inactive"} onClick={() => { this.props.handleChange("Mine"); this.handleSelectNav('mine') }}>
            My documents
                </ListGroupItem>
          <ListGroupItem tag="a" href="#" action className={this.state.navActive === "their" ? "active" : "inactive"} onClick={() => { this.props.handleChange("Their"); this.handleSelectNav('their') }}>
            Shared documents
                </ListGroupItem>
        </ListGroup>
      </Card>
      </React.Fragment>
    )
  }
}
class FileMine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
   filter : "",
      data: [{
        type: "PDF",
        file: "Dữ liệu",
        project: "Xây dựng",
        date: "1/10/2017",
        description: "152kb",
        url: ''

      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Xây dựng",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Xây dựng",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Pha nha",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Xây dựng",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Dữ liệu",
        project: "Xây dựng",
        date: "3/10/2017",
        description: "155kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Pha nha",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Pha nha",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Pha nha",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Pha nha",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Pha nha",
        date: "3/10/2017",
        description: "15kb",
        url: ''
      }
    ],
      allchecked: false,
      max : 5,
      
    }
  }
  //All
  handleDownload() {
    var count = 0;
    for (var i = 0; i < this.state.data.length; i++)
      if (this.state.data[i].checked) {
        var url = ''
        this.state.data[i].file.toLowerCase();
        console.log(this.state.data[i].checked);
        window.open(url)
      }
  }
  handleSearch = event => {
    this.setState({ filter: event.target.value });
    console.log(this.state.filter);
  };
  render() {
    const { filter, data } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = data.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toLowerCase().includes(lowercasedFilter)
      );
    });
    return (
      <Card>
        <CardHeader>
      <CardTitle tag="h5" className="mb-0"> My documents
 <Col sm={5}  className="float-right" >  <Input  type="search" value={filter} placeholder="Search file.." onChange={this.handleSearch} /></Col>  
        </CardTitle> 
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr className="File-mine">
                <th className="File-mine_col-id" >ID</th>
                <th className="File-mine_col-type">Type</th>
                <th className="File-mine_col-file">File</th>
                <th className="File-mine_col-project">Project</th>
                <th className="File-mine_col-date">Date</th>
                <th className="File-mine_col-description">Description</th>
              </tr>
            </thead>
            <tbody>

            {
              filteredData.map((item, index) => {
                return (
                  <tr >
                    <td>{index + 1}</td>
                    <td>{item.type}</td>
                    <td id="item"><a href="#" download>{item.file}</a></td>
                    <td>{item.project}</td>
                    <td>{item.date}</td>
                    <td>{item.description}</td>
                  </tr>
                )
              })}
           
            </tbody>
          </Table>
      
        </CardBody>
      </Card>
    );
  }
}

class FileTheir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter : "",
      data: [{
        type: "PDF",
        file: "Dữ liệu",
        project: "Logng",
        date: "1/10/2017",
        uploader: "Phan Văn Hiện",
        description: "152kb",
        url: ''
      },
      {
        type: "Word",
        file: "Giấy tờ",
        project: "Xây dựng",
        date: "3/10/2017",
        uploader: "Tô Anh Tuấn",
        description: "15kb",
        url: ''
      }],
      allchecked: false
    }
  }
  toggleall() {
    if (this.state.allchecked == true) {
      this.setState({ allchecked: false })
      for (var i = 0; i < this.state.data.length; i++) {
        this.state.data[i].checked = false;
      }
    }
    if (this.state.allchecked == false) {
      this.setState({ allchecked: true })
      for (var i = 0; i < this.state.data.length; i++) {
        this.state.data[i].checked = true;
      }
    }
  }
  toggle(index) {

    let state = Object.assign({}, this.state)
    state.data[index].checked = !state.data[index].checked
    this.setState(state)
    console.log(this.state.data[index].checked)
  }
  handleDownload() {
    var count = 0;
    for (var i = 0; i < this.state.data.length; i++)
      if (this.state.data[i].checked) {
        var url = ''
        this.state.data[i].file.toLowerCase();
        console.log(this.state.data[i].checked);
        window.open(url)
      }
  }
  handleSearch = event => {
    this.setState({ filter: event.target.value });
    console.log(this.state.filter);
  };
  render() {
    const { filter, data } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = data.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toLowerCase().includes(lowercasedFilter)
      );
    });
    return (
      <Card>
      <CardHeader>
      <CardTitle tag="h5" className="mb-0"> Shared documents
      <Col sm={5}  className="float-right" >  <Input  type="search" value={filter} placeholder="Search file.." onChange={this.handleSearch} /></Col>  
             </CardTitle> 
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr className="File-their">
                <th className="File-their_col-id">ID</th>
                <th className="File-their_col-type">Type</th>
                <th className="File-their_col-file">File</th>
                <th className="File-their_col-project">Project</th>
                <th className="File-their_col-date">Date</th>
                <th className="File-their_col-uploader">Uploader</th>
                <th className="File-their_col-description">Description</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.type}</td>
                      <td><a href="#" download>{item.file}</a></td>
                      <td>{item.project}</td>
                      <td>{item.date}</td>
                      <td>{item.uploader}</td>
                      <td>{item.description}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}
class FileUpload extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Card>
        <CardHeader><h2 style={{ textAlign: "center" }}><FontAwesomeIcon icon={faUpload} /> Upload a file</h2></CardHeader>
        <CardBody>
          <Form >
            <Row className="justify-content-center mt-3 mb-2" >
              <Col md="10">
                <FormGroup>
                  <Label for="inputFilename">File name</Label>
                  <Input type="text" id="inputFilename" placeholder="File name" />
                  <br />
                  <Input type="file" name="file" />
                  <br />
                  <Label for="inputDescription">Description</Label>
                  <Input
                    type="textarea"
                    id="inputDescription"
                    placeholder=""
                  />
                  <Label for="inputProject">Project</Label>
                  <CustomInput type="select" id="inputProject">
                    <option value="">Select...</option>
                    <option>Xay Dung</option>
                    <option>Nha cua</option>
                    <option>Dat dai</option>
                  </CustomInput>
                </FormGroup>
                <Button href="#" color="primary">
                  Upload
               </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    )
  }
}
class Storage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRenderTheir: false,
      isRenderMine: true,
      isRenderUpload: false
    }
    this.handleChange = this.handleChange.bind(this); 
  }

  handleChange(options) {
    if (options === "Mine") {
      this.setState({
        isRenderTheir: false,
        isRenderUpload: false,
        isRenderMine: true
      })
    }
    if (options === "Their") {
      this.setState({
        isRenderUpload: false,
        isRenderMine: false,
        isRenderTheir: true
      })
    } 
  }
  render() {
    return (
      <Container fluid className="p-0">
        <h2 className="h3 mb-3">Document management</h2>
        <Row>
          <Col md="3" xl="3">
            <FileSideBar handleChange={this.handleChange} />
          </Col>
          <Col md="3" xl="9">
            {
              this.state.isRenderMine ? <FileMine /> : <FileTheir />

            }
          </Col>
        </Row>
      </Container>
    )
  }
}
export default Storage;
