// Import necessary modules and components from React, React Router, and React Bootstrap
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Figure,
} from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { setAuthToken } from "../../util/api";
import AvatarPicker from "../../components/AvatarPicker/AvatarPicker";
import { useProvideAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import capitalizeFirstLetter from "../../util/capitalizeFirstLetter";

// Define the initial state for the form
const initialState = {
  username: "",
  firstName: "",
  lastName: "",
  city: "",
  state: "",
  email: "",
  password: "",
  confirmPassword: "",
  isSubmitting: false,
  errorMessage: null,
};

// List of US state abbreviations for the dropdown selection
const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

// Main component for the registration page
const RegisterPage = () => {
  // State to manage form data and user input
  const [data, setData] = useState(initialState);
  const auth = useProvideAuth(); // Hook for authentication actions
  let navigate = useNavigate(); // Hook for navigation

  // State for selected profile image
  const [profileImageRegistration, setProfileImageRegistration] =
    useState("/albumorange.jpg");

  // Handle changes in form input fields
  const handleInputChange = (event) => {
    // Update the form state based on user input
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission for registration
  const handleSignup = async (event) => {
    const form = event.currentTarget;
    event.preventDefault(); // Prevent default form submission behavior
    event.stopPropagation(); // Stop event propagation

    // Check if the form is valid; show error message if not
    if (form.checkValidity() === false) {
      toast.error("Please fill out all fields");
      return;
    }

    // List of required fields for registration
    const requiredFields = [
      "username",
      "firstName",
      "lastName",
      "city",
      "state",
      "email",
      "password",
      "confirmPassword",
    ];

    // Check for any empty required fields
    const emptyFields = requiredFields.filter((field) => !data[field]);

    if (emptyFields.length > 0) {
      // If there are empty fields, generate a specific error message for each empty field
      emptyFields.forEach((field) => {
        toast.error(`Please fill out the ${field} field.`);
      });
      return;
    }

    // Update state to indicate form submission is in progress
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    try {
      // Attempt to register the user with the provided data
      const res = await auth.signup(
        data.username,
        data.email,
        data.password,
        data.confirmPassword,
        data.firstName,
        data.lastName,
        data.city,
        data.state,
        profileImageRegistration
      );

      // Reset state after successful registration
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: null,
      });

      setAuthToken(res.token); // Set the authentication token
      toast.success("You've successfully registered!"); // Show success message
      navigate("/"); // Redirect to the homepage
    } catch (error) {
      // Handle registration errors
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error ? error.message || error.statusText : null,
      });
      toast.error(`Please fill out ${data.errorMessage} field`); // Show error message
    }
  };

  // JSX for the registration form
  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <Container className="mb-5">
        <Row className="pt-5 justify-content-center">
          <Form style={{ width: "350px" }} onSubmit={handleSignup} noValidate>
            <Row className="text-center align-items-center">
              <Figure
                className=" bg-border-color overflow-hidden my-auto p-1"
                style={{
                  textDecoration: "none",
                }}
              >
                <Figure.Image
                  src={`${import.meta.env.BASE_URL}logo2.jpg`}
                  alt="Vinyl Village Logo"
                  className=""
                  style={{
                    borderRadius: "0%",
                    maxHeight: "100px",
                    width: "auto",
                    objectFit: "cover",
                  }}
                />
              </Figure>
              <h3 className="mb-5">Create a new account</h3>
            </Row>
            <h5>Profile Image</h5>
            <AvatarPicker
              setProfileImageRegistration={setProfileImageRegistration}
              profileImageRegistration={profileImageRegistration}
              isRegistration={true}
            />
            <Form.Group controlId="username-register">
              <h5>Username</h5>
              <InputGroup>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  value={data.username}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="firstName-register">
              <h5 className="mt-3">First Name</h5>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First Name"
                value={capitalizeFirstLetter(data.firstName)}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="lastName-register">
              <h5 className="mt-3">Last Name</h5>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={capitalizeFirstLetter(data.lastName)}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="city-register">
              <h5 className="mt-3">City</h5>
              <Form.Control
                type="text"
                name="city"
                placeholder="City"
                value={capitalizeFirstLetter(data.city)}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="state-register">
              <h5 className="mt-3">State</h5>
              <Form.Select
                name="state"
                value={data.state}
                onChange={handleInputChange}
              >
                <option value="">Select State</option>
                {usStates.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="email-register">
              <h5 className="mt-3">Email</h5>
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <h5 className="mt-3" htmlFor="Register">
                Password
              </h5>
              <Form.Control
                type="password"
                name="password"
                id="inputPasswordRegister"
                value={data.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Text id="passwordHelpBlock" muted>
              Must be 8-20 characters long.
            </Form.Text>
            <Form.Group>
              <h5 className="mt-3" htmlFor="Register">
                Confirm Password
              </h5>
              <Form.Control
                type="password"
                name="confirmPassword"
                id="confirmPasswordRegister"
                value={data.confirmPassword}
                onChange={handleInputChange}
              />
            </Form.Group>
            {data.errorMessage && (
              <span className="form-error text-warning">
                {data.errorMessage}
              </span>
            )}
            <Row className="mr-0 mt-3 text-center align-items-center">
              <Col>
                Already Registered?
                <Button
                  as="a"
                  variant="link"
                  style={{ color: "gray" }}
                  onClick={() => navigate("/")}
                >
                  Login
                </Button>
              </Col>
            </Row>
            <Row className="text-center align-items-center mt-3">
              <Col>
                <Button
                  variant="warning"
                  style={{ color: "white" }}
                  type="submit"
                  disabled={data.isSubmitting}
                >
                  {data.isSubmitting ? <LoadingSpinner /> : "Sign up"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
