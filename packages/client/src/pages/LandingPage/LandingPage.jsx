import React from "react";
import Login from "../../components/Login/Login";
import LandingCarousel from "../../components/LandingCarousel/LandingCarousel";
import "./LandingPage.scss";
import { Container } from "react-bootstrap";

const LandingPage = () => {
  return (
    <Container className="full-width-container">
      <div className="mb-3 mt-5">
        <LandingCarousel />
      </div>
      {/* <h1>Need an album? Share an album. Chat with other music lovers</h1> */}
      <Login />
    </Container>
  );
};

export default LandingPage;
