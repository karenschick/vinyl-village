import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button, Figure, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useAuth";
//import "./Header.scss";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../util/api";

export default function Header() {
  const [loading, setLoading] = useState(true);
  let params = useParams();
  const {
    state: { user },
    signout,
  } = useProvideAuth();

  const { state, updateUser } = useProvideAuth();
  if (!user) {
    return null;
  }

  const {
    state: { isAuthenticated },
  } = useRequireAuth();
  const linkStyle = { color: "white" };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        updateUser(userResponse.data);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };

    // Only fetch user data if isAuthenticated is true and it's not already loading
    if (isAuthenticated && loading) {
      getUser();
    }
  }, [params.uname, isAuthenticated, loading, updateUser]);

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
          {user && (
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
                Home
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
                <Figure
                  className="bg-border-color overflow-hidden my-auto p-1"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Figure.Image
                    src={state.user.profile_image}
                    className="w-100 h-100"
                    style={{
                      borderRadius: "0%",
                      maxHeight: "60px",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
                <span className="ml-1" style={{ textDecoration: "none" }}>
                  Profile
                </span>
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
