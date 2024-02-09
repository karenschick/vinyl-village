import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";
import { useProvideAuth } from "../../hooks/useAuth";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useProvideAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRequestData = {
      username: username,
      password: password,
    };

    try {
      const response = await auth.signin(
        userRequestData.username,
        userRequestData.password
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/feed");
      } else {
        toast.error("Could not sign in, please check credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occured during login");
    } finally {
      setUserName("");
      setPassword("");
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center">
        <ToastContainer />
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-2 mt-3">
            <Form.Control
              type="text"
              id="username"
              value={username}
              placeholder="username"
              onChange={(e) => setUserName(e.target.value)}
              aria-label="Username"
              autoComplete="username"
            />
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Control
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              autoComplete="off"
            />
          </Form.Group>
          
          <Row className="mb-2">
            <Col xs={12} className="text-center">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-center mt-3">
              <p>
                Don't have an account sign up <Link to="/signup">HERE</Link>
              </p>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
  }  

export default Login;
