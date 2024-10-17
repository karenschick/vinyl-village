import React from "react";
import Login from "../../components/Login/Login";
import LandingCarousel from "../../components/LandingCarousel/LandingCarousel";
import "./LandingPage.scss";
import { Container, Row, Col } from "react-bootstrap";

const LandingPage = () => {
  return (
    <Container>
      <Row className="mb-3 mt-5 ">
        <LandingCarousel />
      </Row>
      <Row className="justify-content-center">
        <Col xs={3} className="d-flex justify-content-end">
          <img
            src="/logo2.jpg"
            width="auto"
            height="200"
            alt="Vinyl Village Logo"
          ></img>
        </Col>
        <Col xs={3}>
          <Login />
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
