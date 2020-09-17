 
import React from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Col,
    Container,
    Row,
    TabContent,
    TabPane
} from "reactstrap";
import "./Pricing.css";

const data = [
    {
        "package": "Public",
        "intro": "For individuals or teams just getting started with project management.",
        "cost": "0",
        "des": "Manage tasks and personal:",
        "button": "Try for free",
        "feature": ["Private project: 1", "Add user : 3", "Task", "List view", "Board view", "Calendar view", "Assignees and due dates", "Collaborate with up to 15 teammates", "Integrate with your favorite apps"],
        "refer": "Learn more"
    },
    {
        "package": "Premium User",
        "intro": "For teams that need to create project plans with confidence.",
        "cost": "19",
        "des": "Track team projects with features and resources like:",
        "button": "Try for free!",
        "feature": ["Private project: 10", "Add user: 10", "Timeline", "Advanced Search & reporting", "Custom fields", "Custom Templates", "Workflow Rules - Coming Soon!", "Task dependencies", "Milestones", "Admin Console", "Private teams & projects", "Premium content in the Asana Academy", "Customer success onboarding and training"],
        "refer": "Learn more about Premium User",
    },
    {
        "package": "Company User",
        "intro": "For teams that need to create project plans with confidence.",
        "cost": "39",
        "des": "Everything in Company, plus:",
        "button": "Try for free",
        "feature": ["Private project: unlimited", "Add user: unlimited", "Portfolios", "Workload - New!", "Advanced Workflow Rules - Coming Soon!", "Forms", "Proofing", "Lock custom fields", "Adobe Creative Cloud Integration", "More Advanced Integrations"],
        "refer": "Learn more about Company User ",
    }
]

const cardTitle = [
    {
        "question": "Do I need a credit card to sign up?",
        "answer": "Etiam rhoncus. Maecenas tempus, tellus eget condimentum  rhoncus, sem quam semper libero, sit amet adipiscing sem  neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem."
    },
    {
        "question": "Do you offer a free trial?",
        "answer": "Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem."
    },
    {
        "question": "What if I decide to cancel my plan?",
        "answer": "Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem."
    },
    {
        "question": "Can I cancel at anytime?",
        "answer": " Etiam rhoncus. Maecenas tempus, tellus eget condimentum  rhoncus, sem quam semper libero, sit amet adipiscing sem  neque sed ipsum. Nam quam nunc, blandit vel, luctus  pulvinar, hendrerit id, lorem."
    }
]


class Pricing extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: "monthly"

        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {

        return (

            <Container fluid className="p-0">
                <h1 className="h3 mb-3">Plans & Pricing</h1>
                {/*<div className="duration-demo .el">*/}
                {/*</div>*/}
                <Row >
                    <Col md="10" className="mx-auto">
                        <h1 className="text-center">We have a plan for everyone</h1>
                        <h4 className="m-0 !important lead text-center mb-4">
                            Whether you're a business or an individual, 14-day trial no credit
                            card required!
                        </h4>
                    
                        <Row className="justify-content-center mt-3 mb-5 !important">
                            <Col xs="auto">
                                <ButtonGroup>
                                    <Button
                                        color="primary"
                                        outline
                                        onClick={() => {
                                            this.toggle("monthly");
                                        }}
                                        className={
                                            this.state.activeTab === "monthly" ? "active" : ""
                                        }
                                    >
                                        Monthly billing
                                    </Button>
                                    <Button
                                        color="primary"
                                        outline
                                        onClick={() => {
                                            this.toggle("annual");
                                        }}
                                        className={
                                            this.state.activeTab === "annual" ? "active" : ""
                                        }
                                    >
                                        Annual billing
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                       
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="monthly">
                                <Row >
                                    {
                                        data.map((value, key) => {
                                            return (
                                                value.package === "Premium User" ?

                                                    <Col class="col-md-4 pr-2">
                                                        <Card className="pricing-card text-center h-100 border-left-0 border-right-0 !important pricing-table__tab-content__tab-pane__col__card-background-color">
                                                            <CardBody className="d-flex flex-column font-weight-bolder pb-0 pricing-table__tab-content__tab-pane__row__col__card__card-body">
                                                                <div className="mb-2">
                                                                    <div className="font-weight-bolder !important pricing-font">{value.package}</div>
                                                                    <h5 className="pricing-table__tab-content__tab-pane__row__col__card__card-body-intro">{value.intro}</h5>
                                                                </div>
                                                                <h2 className="display-4 pb-4 pricing-table__tab-content__tab-pane__row__col__card__car-body-cost ">${parseInt(value.cost)}</h2>
                                                                <h4 className="text-left font-weight-bold pricing-table__tab-content__tab-pane__row__col__card__car-body-des" >{value.des}</h4>
                                                                <ul className="list-unstyled text-left mt-2 !important">
                                                                    {
                                                                        value.feature.map((value) => {
                                                                            return (
                                                                                <li className="mt-3 !important">
                                                                                    <div className="float-left pr-lg-2 pricing-table__tab-content__tab-pane__row__cad__car-body__li__span">&#10003;</div>
                                                                                    <div><h4 className="mt-3 !important pricing-table__tab-content__tab-pane__card__font-family">{value}</h4></div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                                <div className="mt-auto">
                                                                    <Button className="pricing-btn_block" href="#">
                                                                        {value.button}
                                                                    </Button>
                                                                </div>
                                                                <hr/>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>

                                                    :
                                                    <Col class="col-md-4 pr-2">
                                                        <Card className="pricing-card text-center h-100  border-left-0 border-right-0 !important pricing-table__tab-content__tab-pane__col__card-background-color" >
                                                            <CardBody className="d-flex flex-column font-weight-bolder pb-0 pricing-table__tab-content__tab-pane__row__col__card__card-body">
                                                                <div className="mb-2">
                                                                    <h3 className="text-align-center font-weight-bolder !important pricing-font">{value.package}</h3>
                                                                    <h5 className="pricing-table__tab-content__tab-pane__row__col__card__card-body-intro">{value.intro}</h5>

                                                                </div>
                                                                <h2 className="display-4 pb-4 pricing-table__tab-content__tab-pane__row__col__card__car-body-cost ">${value.cost}</h2>
                                                                <h4 className="text-left font-weight-bold pricing-table__tab-content__tab-pane__row__col__card__car-body-des" >{value.des}</h4>
                                                                <ul className="list-unstyled text-left mt-2 !important">
                                                                    {
                                                                        value.feature.map((value) => {
                                                                            return (
                                                                                <li className="mt-3 !important">
                                                                                    <div className="float-left pr-lg-2 pricing-table__tab-content__tab-pane__row__cad__car-body__li__span">&#10003;</div>
                                                                                    <h4 className="pricing-table__tab-content__tab-pane__card__font-family">{value}</h4>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                                <a className="mt-auto">
                                                                    <Button  className="pricing-btn_block">
                                                                        {value.button}
                                                                    </Button>
                                                                </a>
                                                                <hr/>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="annual">
                                <Row>
                                    {
                                        data.map((value, key) => {
                                            return (
                                                value.package === "Premium User" ?

                                                    <Col className="col-md-4 pr-2">
                                                        <Card className=" pricing-card text-center h-100 border-left-0 border-right-0 !important pricing-table__tab-content__tab-pane__col__card-background-color">
                                                            <CardBody className="d-flex flex-column font-weight-bolder pb-0 pricing-table__tab-content__tab-pane__row__col__card__card-body">
                                                                <div className="mb-2">
                                                                    <h3 className=" font-weight-bolder !important pricing-font">{value.package}</h3>
                                                                    <h5 className="pricing-table__tab-content__tab-pane__row__col__card__card-body-intro">{value.intro}</h5>
                                                                </div>
                                                                <h2 className="display-4 pb-4 pricing-table__tab-content__tab-pane__row__col__card__car-body-cost">${parseInt(value.cost)*11}</h2>
                                                                <h4 className="text-left font-weight-bold pricing-table__tab-content__tab-pane__row__col__card__car-body-des" >{value.des}</h4>
                                                                <ul className=" list-unstyled text-left mt-2 !important">
                                                                    {
                                                                        value.feature.map((value) => {
                                                                            return (
                                                                                <li className="mt-3 !important">
                                                                                    <div className="float-left pr-lg-2 pricing-table__tab-content__tab-pane__row__cad__car-body__li__span">&#10003;</div>
                                                                                    <h4 className="pricing-table__tab-content__tab-pane__card__font-family">{value}</h4>
                                                                                </li>

                                                                            )
                                                                        })
                                                                    }
                                                                </ul>


                                                                <div className="mt-auto">
                                                                    <Button className="pricing-btn_block" href="#">
                                                                        {value.button}
                                                                    </Button>
                                                                </div>
                                                                <hr/>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>

                                                    :
                                                    <Col class="col-md-4 pr-2">
                                                        <Card className=" pricing-card text-center h-100  border-left-0 border-right-0 !important pricing-table__tab-content__tab-pane__col__card-background-color" >
                                                            <CardBody className="d-flex flex-column font-weight-bolder pb-0 pricing-table__tab-content__tab-pane__row__col__card__card-body">
                                                                <div className="mb-4">
                                                                    <h3 className="font-weight-bolder !important pricing-font">{value.package}</h3>
                                                                    <h5 className="pricing-table__tab-content__tab-pane__row__col__card__card-body-intro">{value.intro}</h5>

                                                                </div>
                                                                <h2 className="display-4 pb-4 pricing-table__tab-content__tab-pane__row__col__card__car-body-cost">${parseInt(value.cost)*11}</h2>
                                                                <h4 className="text-left font-weight-bold pricing-table__tab-content__tab-pane__row__col__card__car-body-des" >{value.des}</h4>
                                                                <ul className="list-unstyled text-left mt-2 !important">
                                                                    {
                                                                        value.feature.map((value) => {
                                                                            return (
                                                                                <li className="mt-3 !important">
                                                                                    <div className="float-left pr-lg-2 pricing-table__tab-content__tab-pane__row__cad__car-body__li__span">&#10003;</div>
                                                                                    <h4 className="pricing-table__tab-content__tab-pane__card__font-family">{value}</h4>
                                                                                </li>

                                                                            )
                                                                        })
                                                                    }
                                                                </ul>


                                                                <div className="mt-auto">
                                                                    <Button  className="pricing-btn_block">
                                                                        {value.button}
                                                                    </Button>
                                                                </div>
                                                                <hr/>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                            )
                                        })
                                    }

                                </Row>
                            </TabPane>
                        </TabContent>
                        <div className="pricing-tab"><hr/></div>
                        <div className="text-center my-4">
                            <h1 className="text-center">Frequently asked questions</h1>
                        </div>
                        <Row>
                            {
                                cardTitle.map((value, key) => {
                                    return(
                                        <Col sm="6" md="5" className="mx-auto">
                                            <Card className="pricing-card pricing-question-background-color">
                                                <CardBody>
                                                    <div className=" m-b-5 font-weight-bolder h4 ">{value.question}</div>
                                                    <div className="m-0 font-weight-lighter h5 ">{value.answer}</div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Pricing;

