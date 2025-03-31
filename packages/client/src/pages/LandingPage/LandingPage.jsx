// Import required modules and components from React and external librariesimport React from "react";
import Login from "../../components/Login/Login"; // Login component for user authentication
import LandingCarousel from "../../components/LandingCarousel/LandingCarousel"; // Carousel component for landing page
//import "./LandingPage.scss";
import { Container, Row, Col } from "react-bootstrap";

// Main component for the Landing Page
const LandingPage = () => {
  return (
    <Container>
      <Row className="mb-3 mt-5 ">
        {/* Display the landing carousel component */}
        <LandingCarousel />
      </Row>
      <Row className="justify-content-center">
        <Col xs={3} className="d-flex justify-content-end">
          {" "}
          {/* Column for the logo */}
          <img
            src="/logo2.jpg" // Source of the logo image
            width="auto" // Automatically adjust width
            height="200" // Fixed height for the logo
            alt="Vinyl Village Logo" // Alt text for accessibility
          ></img>
        </Col>
        <Col xs={3}>
          {/* Render the login component */}
          <Login />
        </Col>
      </Row>
    </Container>
  );
};

// Export the LandingPage component for use in other parts of the application
export default LandingPage;
