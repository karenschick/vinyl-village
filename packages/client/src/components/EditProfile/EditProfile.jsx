// Import necessary modules from React and other libraries
import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useProvideAuth, useAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import capitalizeFirstLetter from "../../util/capitalizeFirstLetter";
import api from "../../util/api";

// Main component for editing a user's profile
const EditProfile = (props) => {
  // Using authentication-related hooks to get current user state and auth functions
  const { state } = useProvideAuth();
  const [user, setUser] = useState(); // Holds user data
  const [loading, setLoading] = useState(true); // Loading state while fetching data
  const [validated, setValidated] = useState(false); // Form validation state
  const [data, setData] = useState({
    // Holds form input values
    password: "",
    currentPassword: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    isSubmitting: false,
    errorMessage: null,
  });
  const [passwordChanged, setPasswordChanged] = useState(false); // Tracks if the password was changed
  const { updateUser } = useAuth(); // Function to update the user in context

  // useEffect hook to set form data once user data is available
  useEffect(() => {
    if (user) {
      setData((prevData) => ({
        ...prevData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: user.city,
        state: user.state,
      }));
    }
  }, [user]);

  // List of US states for dropdown selection in the form
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

  let navigate = useNavigate(); // Navigation hook to redirect user
  let params = useParams(); // Params hook to get URL parameters

  // Hook to ensure user is authenticated before showing the page
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // Fetch user data when the component mounts, based on the URL parameter 'uname'
  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        setUser(userResponse.data); // Set the user data
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        console.error(err.message); // Log errors
      }
    };
    isAuthenticated && getUser(); // Fetch user data only if authenticated
  }, [params.uname, isAuthenticated]);

  // Handle input change for all form fields and track password changes
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    // If the password fields are modified, set passwordChanged to true
    if (
      event.target.name === "currentPassword" ||
      event.target.name === "password" ||
      event.target.name === "confirmPassword"
    ) {
      setPasswordChanged(true);
    }
  };
  // Handle updating the password (called separately)
  const handleUpdatePassword = async (event) => {
    if (event) {
      event.preventDefault(); // Prevent form default submission
      event.stopPropagation(); // Stop event propagation
    }

    const form = document.getElementById("passwordForm"); // Get form element
    if (form && form.checkValidity() === false) {
      // Validate form
      setValidated(true);
      return;
    }
    setData({
      ...data,
      isSubmitting: true, // Indicate that the form is submitting
      errorMessage: null,
    });

    try {
      const {
        user: { uid, username },
      } = state;
      setValidated(false); // Reset validation state

      // API call to update the user's password
      api
        .put(`/users/${username}`, {
          currentPassword: data.currentPassword,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
        .then((response) => {
          setData({
            ...data,
            isSubmitting: false,
            password: "",
            currentPassword: "",
            confirmPassword: "",
          });

          setLoading(false); // Stop loading after success
          toast.success("Password updated successfully!"); // Show success message
        })
        .catch((error) => {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message, // Capture error message
          });
          toast.error("Failed to update password. Please try again."); // Show error message
        });

      setData({
        ...data,
        isSubmitting: false,
        password: "",
        currentPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
      });
    }
  };

  // Handle form submission for profile and password updates
  const handleSubmitAll = async () => {
    if (passwordChanged) {
      // Check if password was changed
      try {
        await handleUpdatePassword(); // Update password
        setPasswordChanged(false);
        toast.success("Profile updated successfully!"); // Show success message
      } catch (error) {
        toast.error("Failed to update profile. Please try again."); // Show error message
      }
    }

    try {
      await api.put(`/users/${params.uname}`, data); // Update user profile via API
      toast.success("Profile updated successfully!"); // Show success message
      updateUser({ ...state.user, ...data }); // Update the user context with new data
      console.log("User updated check(not auth log):", state.user);
    } catch (error) {
      console.error("Error updating profile:", error); // Log error
      //toast.error("Failed to update profile. Please try again.");
    }

    navigate(`/u/${user.username}`); // Redirect user after updating
  };

  // If user is not authenticated, show loading spinner
  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  // If data is still loading, show loading spinner
  if (loading) {
    return <LoadingSpinner full />;
  }

  // Render the profile edit form
  return (
    <>
      <Container fluid style={{ maxWidth: "500px" }}>
        <Container>
          <Card className="mt-3 p-3">
            <Form className="text-start">
              <Form.Group controlId="firstName" className="mt-1">
                <h5>First Name</h5>
                <Form.Control
                  type="text"
                  value={capitalizeFirstLetter(data.firstName)} // Capitalize first name
                  onChange={(e) =>
                    setData({
                      ...data,
                      firstName: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="lastName" className="mt-3">
                <h5>Last Name</h5>
                <Form.Control
                  type="text"
                  value={capitalizeFirstLetter(data.lastName)} // Capitalize last name
                  onChange={(e) =>
                    setData({ ...data, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="email" className="mt-3">
                <h5>Email</h5>
                <Form.Control
                  type="text"
                  value={data.email} // Display email field
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="city" className="mt-3">
                <h5>City</h5>
                <Form.Control
                  type="text"
                  value={capitalizeFirstLetter(data.city)} // Capitalize city name
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="state" className="mt-3">
                <h5>State</h5>
                <Form.Select
                  value={data.state} // Display state selection
                  onChange={(e) => setData({ ...data, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {usStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Card>
          <Card className="mt-3 p-3">
            <Form
              className="text-start mt-2"
              id="passwordForm"
              noValidate
              validated={validated}
              onSubmit={handleUpdatePassword} // Handle form submission for password update
            >
              <Form.Group>
                <h5 htmlFor="password">Current Password</h5>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  required
                  value={data.currentPassword} // Display current password field
                  onChange={handleInputChange} // Handle input change
                />
                <Form.Control.Feedback type="invalid">
                  Current Password is required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-2">
                <h5 htmlFor="password">New Password</h5>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  value={data.password} // Display new password fiel
                  onChange={handleInputChange} // Handle input change
                />
                <Form.Text id="passwordHelpBlock" muted>
                  Must be 8-20 characters long.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Confirm Password is required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-2">
                <h5 htmlFor="password">Confirm New Password</h5>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  required
                  value={data.confirmPassword} // Display confirm password field
                  onChange={handleInputChange} // Handle input change
                />
                <Form.Text id="passwordHelpBlock" muted></Form.Text>
                <Form.Control.Feedback type="invalid">
                  Confirm Password is required
                </Form.Control.Feedback>
              </Form.Group>

              {data.errorMessage && (
                <span className="form-error">{data.errorMessage}</span>
              )}
            </Form>
          </Card>
        </Container>
        <div className="text-center m-3">
          <Button
            variant="orange"
            style={{ border: "none", color: "white" }}
            onClick={handleSubmitAll}
          >
            Submit All
          </Button>
        </div>
      </Container>
    </>
  );
};

export default EditProfile;
