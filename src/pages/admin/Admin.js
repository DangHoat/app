import React from "react";
import Client from "./member/Clients"
import General from "./general/General"
import Permission from "./permission/Permission"
import {
    Card,
    CardHeader,
    CardTitle,
    Col,
    Container,
    ListGroup,
    ListGroupItem,
    Row,
} from "reactstrap";


class Navigation extends React.Component{
    // eslint-disable-next-line no-useless-constructor
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Card>
                <CardHeader>
                    <CardTitle tag="h5" className="mb-0">
                        Settings
                    </CardTitle>
                </CardHeader>
                <ListGroup flush>
                    <ListGroupItem tag="a" href="#" action className={this.props.navActive==="general" ? "active" : "inactive"} onClick={()=>this.props.handleSelectNav('general')}>
                        General
                    </ListGroupItem>
                    <ListGroupItem tag="a" href="#" action className={this.props.navActive==="member" ? "active" : "inactive"} onClick={()=>this.props.handleSelectNav('member')}>
                        Member
                    </ListGroupItem>
                    <ListGroupItem tag="a" href="#" action className={this.props.navActive==="permission" ? "active" : "inactive"} onClick={()=>this.props.handleSelectNav('permission')}>
                        Permission
                    </ListGroupItem>
                </ListGroup>
            </Card>
        )
    }
};



class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            navActive: "general",
        };
        this.handleSelectNav = this.handleSelectNav.bind(this)
    }

    handleSelectNav(action){
        this.setState({
            navActive: action
        })
    }
    render(){
        return(
            <Container fluid className="p-0">
                <h1 className="h3 mb-3">Admin</h1>
                <Row>
                    <Col md="4" xl="2">
                        <Navigation
                            navActive={this.state.navActive}
                            handleSelectNav={this.handleSelectNav}
                        />
                    </Col>
                    <Col md="8" xl="10">
                        {
                            this.state.navActive === "general"
                                ? <General handleLoading={this.props.handleLoading}/>
                                : this.state.navActive === "member"
                                ? <Client handleLoading={this.props.handleLoading}/>
                                : <Permission handleLoading={this.props.handleLoading}/>

                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Admin;
