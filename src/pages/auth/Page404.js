import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import './Page404.css';
import avata from "../../assets/img/logo/page404.png";
class Page404 extends React.Component {
  render() {
    return (
      <div className="text-center">
          <img
            src={avata}
            alt="May tinh 404"
            className="img-fluid page404-img"
          />
        <h1 className="page404-h1">4<span className="!important page404-0">0</span>4 Page Not Found</h1>
        <p className="page404-p">
        The page you were looking for doesn't exist.
        </p>
        <Link to="/dashboard">
          <Button color="primary" className="page404-button px-3">
            Return to website
          </Button>
        </Link>
      </div>
    );
  }
}

export default Page404;
