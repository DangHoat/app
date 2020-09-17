import React from "react";
import {
    Card,CardBody,
    Button,
    Input,
    Form, FormFeedback,
    Alert
} from "reactstrap";
import {NavLink} from "react-router-dom";
const api = require("./api/api");

class CreateNewPassWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirm_password: '',            
            submitted: false,
            loading: false, 
            error: '',
            success : ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        const request = window.location.search
            .slice(1)
            .split('&')
            .map(p => p.split('='))
            .reduce((obj, [key, value]) => ({...obj, [key]: value}), {});
        
        event.preventDefault();
        this.setState({ submitted: true });
        const { password, confirm_password } = this.state;
        
        if (!(password && confirm_password &&  password===confirm_password && !this.validatePassword(password))) {
            return;
        }
        this.setState({ loading: true });
        setTimeout(() => {
            api.createNewPass(password, request, (err, result) =>{
                if(err){
                    this.setState({ error : err.data === undefined ? err : err.data._error_message, loading: false })
                }
                else {
                    this.setState({ success : "Your password has been change successfully" , loading: false });
                }
            })
        }, 500);
    }
    validatePassword(value) {
        let error;
        if (/(?=^.{8,}$).*$/i.test(value)) {
            error = false;
        } else{
            error = true;
        }
        return error;
    }
    render() {
        const { password, confirm_password, submitted, loading, error, success } = this.state;
        return (
            <React.Fragment>
                {success &&
                    <Alert color="primary" className="p-2"> {success}</Alert>
                }
                {error &&
                    <Alert className="p-2" color="danger" isOpen={success ? false: true}>{error}</Alert>
                }
                <Card className="bg-white p-3">
                    <CardBody>
                        <h2 className="text-center bg-success p-2 rounded">Create a new password on Fwork</h2>
                        <div className="pt-4"></div>
                        <Form onSubmit={this.handleSubmit}>
                            <Input 
                                bsSize="lg"
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                placeholder="New password (8-30 charaters)"
                                invalid={submitted && this.validatePassword(this.state.password)}
                            />
                            { !password &&
                                <FormFeedback invalid>
                                    Password is a required field!
                                </FormFeedback>
                            }
                            { password && (!/(?=^.{8,}$).*$/i.test(password)) &&                     
                                <FormFeedback invalid>
                                    Your password must contain at least 8 or more characters
                                </FormFeedback> 
                            } 
                            <div className="pt-4">
                            <Input 
                                bsSize="lg"
                                type="password"
                                name="confirm_password"
                                value={this.state.confirm_password}
                                onChange={this.handleChange}
                                placeholder="Retype password"
                                invalid={submitted && password !== confirm_password ? true : false}
                            />
                            <FormFeedback invalid>
                                Confirm password incorrect. Please retype the password
                            </FormFeedback>
                            </div>
                            <div className="text-center pt-4">
                                {success ?
                                    <div className="text-center">
                                        <NavLink to="/auth/sign-in">
                                            <Button color="primary" size="lg">Back to Sign In</Button>
                                        </NavLink>        
                                    </div>
                                    :
                                    <Button text="dark" color="success" size="lg">Create new password</Button>
                                }                             
                            </div>
                        </Form>                        
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default CreateNewPassWord;
