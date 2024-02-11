import React from "react";
import { Carousel } from "react-bootstrap";
import "./LandingCarousel.scss";

function LandingCarousel() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="/album12.jpg"
          alt="First slide"
        />
        <Carousel.Caption style={{color: "black", textAlign: "left", padding: "0", marginLeft: "-100px" }} >
          <h1>Need an Album?</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="/album11.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1>Share an Album</h1>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="/album9.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1>Chat with Music Lovers</h1>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default LandingCarousel;
