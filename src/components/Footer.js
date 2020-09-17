import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => (
  <footer className="footer">
    <Container fluid>
      <Row className="text-muted">
        <Col xs="6" className="text-left">
          <ul className="list-inline">
            <li className="list-inline-item">
              <a className="text-muted" href="/term">
                Support
              </a>
            </li>
            <li className="list-inline-item">
              <a className="text-muted" href="/term">
                Help Center
              </a>
            </li>
            <li className="list-inline-item">
              <a className="text-muted" href="/term">
                Privacy
              </a>
            </li>
            <li className="list-inline-item">
              <a className="text-muted" href="/term">
                Terms of Service
              </a>
            </li>
          </ul>
        </Col>
        <Col xs="6" className="text-right">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} -{" "}
            <span href="/" className="text-muted">
              Fwork
            </span>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
