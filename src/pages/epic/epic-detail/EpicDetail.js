class WorkDetail extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
            
    //     }
    // }

    componentWillMount() {
        
    }

    // handleUpdateData(data) {
    //     this.setState({data: data})
    // }

    render() {
        memberInProject = utils.getMemberInProject();
        return (
            // <Container fluid className="WorkDetail">
            //     <Row>
            //         <Col xl={8}>
            //             <CardLeft handleLoading={this.props.handleLoading} data={this.state.data}
            //                       handleUpdateData={this.handleUpdateData.bind(this)}/>
            //         </Col>
            //         <Col xl={4}>
            //             <CardRight handleLoading={this.props.handleLoading} data={this.state.data}
            //                        handleUpdateData={this.handleUpdateData.bind(this)}/>
            //         </Col>
            //     </Row>
            // </Container>
        )
    }
}

export default WorkDetail;