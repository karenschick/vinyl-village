// Import React library and Bootstrap Carousel component for use in the LandingCarousel component.
// Import custom styles for the carousel from the LandingCarousel.scss file.
import React from "react";
import { Carousel } from "react-bootstrap";
//import "./LandingCarousel.scss";

// Define the LandingCarousel component, which displays a Bootstrap carousel with three slides.
// The carousel features different images and captions, and adjusts the alignment of the captions
// based on the screen size. It uses window.innerWidth to determine if the screen is small (less than 768px).
function LandingCarousel() {
  const isSmallScreen = window.innerWidth < 768;

  return (
    // Carousel component with fade transition between slides
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src={`${import.meta.env.BASE_URL}vinyl-village/album12.jpg`}
          alt="First slide"
        />
        <Carousel.Caption
          style={{
            color: "black",
            textAlign: isSmallScreen ? "center" : "left",
            padding: "0",
            marginLeft: isSmallScreen ? "0" : "-100px",
            marginBottom: isSmallScreen ? "20px" : "0px",
          }}
        >
          <h1>Need an Album?</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src={`${import.meta.env.BASE_URL}vinyl-village/album11.jpg`}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1>Share an Album</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src={`${import.meta.env.BASE_URL}vinyl-village/album9.jpg`}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1>Chat with Music Lovers</h1>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

// Export the LandingCarousel component for use in other parts of the application.
export default LandingCarousel;
