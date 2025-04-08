// Import React and useState for managing component state.
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap"; // - Bootstrap components (Form, Button, Container, Row, Col) for layout and form styling.
import { useNavigate, Link } from "react-router-dom"; // - useNavigate and Link from react-router-dom for navigation and linking to other pages.
import { toast } from "react-toastify"; // - toast from react-toastify for displaying notification messages.
import "react-toastify/dist/ReactToastify.css";
import { useProvideAuth } from "../../hooks/useAuth"; // - useProvideAuth is a custom hook that provides authentication functionality.import React, { useState } from "react";
import "../../custom.scss";

// Define the Login functional component.
const Login = () => {
  // Define state variables to hold the username and password inputs.
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // useNavigate hook allows redirecting the user after successful login.
  const navigate = useNavigate();

  // useProvideAuth hook is used to get access to authentication functions (like signin).
  const auth = useProvideAuth();

  // handleSubmit is an async function that handles form submission when the user tries to sign in.
  const handleSubmit = async (e) => {
    // Prevent the form from performing the default submit action (page reload).
    e.preventDefault();

    // Create an object to hold the entered username and password.
    const userRequestData = {
      username: username,
      password: password,
    };

    try {
      // Attempt to sign in the user by calling auth.signin with the entered username and password.
      const response = await auth.signin(
        userRequestData.username,
        userRequestData.password
      );

      // If the response status is 200 or 201 (success), navigate the user to the feed page.
      if (response.status === 200 || response.status === 201) {
        navigate("/feed");
      } else {
        // Otherwise, display an error notification to inform the user of invalid credentials.
        toast.error("Could not sign in, please check credentials");
      }
    } catch (error) {
      // Log any errors that occur during the login process and display a generic error notification.
      console.error("Error during login:", error);
      toast.error("An error occured during login");
    } finally {
      // Reset the username and password fields after the attempt.
      setUserName("");
      setPassword("");
    }
  };

  // JSX to render the login form using Bootstrap components.
  return (
    <>
      <Container className="d-flex justify-content-center align-items-center">
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-2 mt-">
            <Form.Control
              type="text"
              id="username"
              value={username}
              placeholder="username"
              onChange={(e) => setUserName(e.target.value)} // Update state on input change
              aria-label="Username"
              autoComplete="username" // Auto-complete enabled for username field
            />
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Control
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
              aria-label="Password"
              autoComplete="off" // Auto-complete disabled for password field
            />
          </Form.Group>

          <Row className="mb-2">
            <Col xs={12} className="text-center">
              <Button variant="warning" style={{ color: "white" }} type="submit">
                Sign In
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center ">
            <Col xs={8} className="text-center mt-1">
              <p>
                Don't have an account? sign up{" "}
                <Link to="/signup" style={{ color: "black" }}>
                  HERE
                </Link>
              </p>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

// Export the Login component for use in other parts of the application.
export default Login;
