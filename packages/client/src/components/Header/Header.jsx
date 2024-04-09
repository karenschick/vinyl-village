import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Figure, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useAuth";
import { useApiFetch } from "../../util/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import api from "../../util/api";

export default function Header() {
  const { state: authState, updateUser, signout } = useProvideAuth();
  const [loading, setLoading] = useState(true);
  const { user } = authState;

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const linkStyle = { color: "white" };

  if (!user) {
    return null;
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
            src="/logo2.jpg"
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
                    src="/home.png"
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
                    src="/profile2.png"
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
