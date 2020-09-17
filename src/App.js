import React from "react";
import ReduxToastr from "react-redux-toastr";
import Routes from "./routes/Routes";
import { connect } from "react-redux";
import {
    Button,
    Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { meFromToken } from './redux/actions/userActions';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingMember: false,
        };
    }
    componentDidMount() {
        let session = sessionStorage.getItem("Session");
        if (!session || session === '') {
            this.setState({ isLoadingMember: true })
            return;
        }
        else {
            const { dispatch } = this.props;
            dispatch(meFromToken()).payload
                .then(result => {
                    const { dispatch } = this.props;
                    dispatch({ type: 'LOGIN_USER', user: result.data })
                    this.setState({ isLoadingMember: true })
                })
                .catch(error => {
                    sessionStorage.clear();
                    window.location.assign("/auth/sign-in");
                });
        }
    }
    render() {
        return (
            this.state.isLoadingMember === false ? null :
                <>
                    <Routes />
                    <ReduxToastr
                        timeOut={5000}
                        newestOnTop={true}
                        position="top-right"
                        transitionIn="fadeIn"
                        transitionOut="fadeOut"
                        progressBar
                        closeOnToastrClick
                    />
                </>
        );
    }
}

export default connect()(App);
