import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Figure, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useAuth";

// Main functional component for rendering the header
export default function Header() {
  const { state: authState, signout } = useProvideAuth(); // Destructure auth state and signout function from useProvideAuth hook
  const [loading, setLoading] = useState(true); // State to track loading status, default to true
  const { user } = authState; // Destructure user from authState

  useEffect(() => {
    if (user) {
      setLoading(false); // Set loading to false once the user is available
    }
  }, [user]); // Run effect when user state changes

  if (!user) {
    return null; // If no user is logged in, return null to render nothing
  }

  return (
    <Navbar
      className="flex-column"
      expand="lg"
      bg="dark"
      style={{ minHeight: "100px" }}
    >
      <Container>
        <Navbar.Brand
          className=""
          as={Link}
          to="/"
          style={{ textDecoration: "none" }}
        >
          <img
            //src="/logo2.jpg"
            src={`${import.meta.env.BASE_URL}vinyl-village/logo2.jpg`}
            width="150"
            height="auto"
            className="d-inline-block align-top"
            alt="Vinyl Village Logo"
          ></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!loading && user && (
            <Nav className="d-flex align-items-center justify-content-around w-100 ">
              <Nav.Item
                as={Link}
                to={`/feed`}
                className="d-flex align-items-center"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {" "}
                <Figure
                  className="bg-border-color overflow-hidden my-auto p-1"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Figure.Image
                    //src="/home.png"
                    src={`${import.meta.env.BASE_URL}vinyl-village/home.png`}
                    alt="Home Icon"
                    className="w-100 h-100"
                    style={{
                      borderRadius: "0%",
                      maxHeight: "60px",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
              </Nav.Item>
              <Nav.Item
                as={Link}
                to={`/u/${user.username}`}
                className="d-flex align-items-center"
                style={{
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {" "}
                <Figure
                  className="bg-border-color overflow-hidden my-auto p-1"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Figure.Image
                    //src="/profile2.png"
                    src={`${import.meta.env.BASE_URL}vinyl-village/profile2.png`}
                    alt={`Profile Image of ${user.username}`}
                    className="w-100 h-100"
                    style={{
                      borderRadius: "0%",
                      maxHeight: "60px",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
                <span
                  className="ml-1"
                  style={{ textDecoration: "none" }}
                ></span>
              </Nav.Item>
              <Nav.Item
                as={Button}
                variant="outline-dark"
                onClick={() => signout()}
                style={{
                  border: "none",
                  marginRight: "",
                  color: "orange",
                }}
              >
                Sign Out
              </Nav.Item>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
