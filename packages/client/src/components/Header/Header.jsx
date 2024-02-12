import React from "react";
import { Navbar, Nav, Button, Figure, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useAuth";

export default function Header() {
  const {
    state: { user },
    signout,
  } = useProvideAuth();

  if (!user) {
    return null;
  }

  const linkStyle = { color: "white" }; 

  return (
    <Navbar
      expand="lg"
      bg="info"
      style={{ minHeight: "100px" }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ marginLeft: "50px", textDecoration:"none" }}>
          Landing (put logo here)
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user && (
            <Nav className="d-flex align-items-center justify-content-end w-100">
              <Nav.Item
                as={Link}
                to={`/feed`}
                className="d-flex align-items-center"
                style={{ color: "white", marginRight: "50px", textDecoration:"none" }}
              >
                Feed
              </Nav.Item>
              <Nav.Item
                as={Link}
                to={`/u/${user.username}`}
                className="d-flex align-items-center"
                style={linkStyle}
              >
                <Figure
                  className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                  style={{
                    marginRight: "50px",
                  }}
                >
                  <Figure.Image
                    src={user.profile_image}
                    className="w-100 h-100"
                    style={{
                      borderRadius: "0%",
                      maxHeight: "50px",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
              </Nav.Item>
              <Nav.Item
                as={Button}
                variant="outline-info"
                onClick={() => signout()}
                style={{
                  border: "none",
                  marginRight: "50px",
                  color: "white",
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
