import React from "react";
import { Link, NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import avata from "../../assets/img/logo/login.png";
import utils from "../../utils/utils";
import "./SignIn.css";
import {
    Button,
    Card, CardBody,
    Form, FormGroup, FormFeedback,
    Input,
    Alert,
    Container,
} from "reactstrap";
const api = require("./api/api");
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            submitted: false,
            loading: false,
            error: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { email, password } = this.state;

        // stop here if form is invalid
        if (!(email && password)) {
            return;
        }

        this.setState({ loading: true });
        setTimeout(() => {
            api.login(email, password, (err, result) => {
                if (err) {
                    this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false })
                } else {
                    if (result.id !== undefined) {
                        const { dispatch } = this.props;
                        dispatch({ type: 'LOGIN_USER', user: result })
                        sessionStorage.setItem('Session', utils.randomString())
                        window.location.replace("/");
                    }

                }
            })
        }, 500);
    }

    render() {
        const { email, password, submitted, loading, error } = this.state;
        const { t } = this.props;
        return (
            <React.Fragment >
                <Container className="width-percent-80 SignIn-card">
                    {error &&
                        <Alert color="danger" className="p-2 SignIn-alert" >{error}</Alert>
                    }
                    <Container className="px-0">
                        <Card className="SignIn-form">
                            <CardBody className="px-0 pt-0 pb-0">
                                <div className={window.innerWidth >= 415 && window.innerWidth <= 1920 ? "mx-4 mt-5" : "m-2"}>
                                    <div className="text-center">
                                        <CustomImg
                                            key={utils.randomString()}
                                            src={avata}
                                            className="img--user--square-6x mb-2"
                                        />
                                    </div>
                                    <h1 className={window.innerWidth >= 415 && window.innerWidth <= 1920 ? "text-center SignIn-text font-weight-bold SignIn-font-size__text pb-3" : "SignIn-text font-weight-bold text-center"}>FWORK</h1>
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup className={window.innerWidth >= 415 && window.innerWidth <= 1920 ? "pb-3" : ""}>
                                            <Input
                                                bsSize="mb-3"
                                                type="email"
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                placeholder={t('PLACEHOLDER_EMAIL')}
                                                invalid={submitted && !email ? true : false}
                                            />
                                            <FormFeedback invalid>
                                                Email is a required field!
                                            </FormFeedback>
                                        </FormGroup>
                                        <FormGroup className={window.innerWidth >= 415 && window.innerWidth <= 1920 ? "pb-3" : ""}>
                                            <Input
                                                bsSize="mb-3"
                                                type="password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                                placeholder={t('PLACEHOLDER_PASSWORD')}
                                                invalid={submitted && !password ? true : false}
                                            />
                                            <FormFeedback invalid>
                                                Passwords is a required field!
                                            </FormFeedback>
                                            <small className={window.innerWidth >= 415 && window.innerWidth <= 1920 ? "py-3" : ""}>
                                                <Link to="/auth/reset-password">{t('FORGOT_PASSWORD')}?</Link>
                                            </small>
                                        </FormGroup>
                                        <div className="text-center mt-3">
                                            {loading === false ?
                                                <Button
                                                    color="primary"
                                                    font-weight="200"
                                                    size="mb-3"
                                                    className="btn btn-block text-capitalize"
                                                >
                                                    {t('BUTTON_SIGNIN')}
                                                </Button>
                                                :
                                                <LoadingSprinner />
                                            }
                                        </div>
                                    </Form>
                                    <div className={window.innerWidth >= 411 && window.innerWidth <= 414 ? "text-center mt-3" : window.innerWidth >= 415 && window.innerWidth <= 1920 ? "text-center mt-2 pt-3" : "text-center mt-2"}>
                                        <NavLink to="/auth/sign-up">{t('HAVE_NOT_ACCOUNT')}</NavLink>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Container>
                </Container>
            </React.Fragment>

        );
    }
}


export default withRouter(
    connect()(withTranslation()(SignIn))
);
