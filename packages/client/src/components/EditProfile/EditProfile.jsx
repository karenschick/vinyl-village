import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Figure,
  Modal,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useApiFetch } from "../../util/api";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import AddAlbums from "../AddAlbums/AddAlbums";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../util/api";
import { toast } from "react-toastify";

const EditProfile = (props) => {
  const { state } = useProvideAuth();
  const { error, isLoading, response } = useApiFetch("/albums");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    password: "",
    currentPassword: "",
    confirmPassword: "",
    // email: "",
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    isSubmitting: false,
    errorMessage: null,
  });
  const [profileImage, setProfileImage] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [albumChanged, setAlbumChanged] = useState(false);
  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const addAlbumSubmitRef = useRef(null);
  

  useEffect(() => {
    if (user) {
      setData(prevData => ({
        ...prevData,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        state: user.state,
      }));
    }
  }, [user]);

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  let navigate = useNavigate();
  let params = useParams();

  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  const toggleModal = () => setShowModal(!showModal);

  const handleAddAlbum = (newAlbum) => {
    setDisplayedAlbums([...displayedAlbums, newAlbum]);
    setAlbumChanged(true);
  };

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        setUser(userResponse.data);
        setProfileImage(userResponse.data.profile_image);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };
    isAuthenticated && getUser();
  }, [params.uname, isAuthenticated]);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    if (
      event.target.name === "currentPassword" ||
      event.target.name === "password" ||
      event.target.name === "confirmPassword"
    ) {
      setPasswordChanged(true);
    }
  };

  const handleUpdatePassword = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const form = document.getElementById("passwordForm"); // Add an ID to your form
    if (form && form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    try {
      const {
        user: { uid, username },
      } = state;
      console.log(data.password, uid, username);
      setValidated(false);

      // write code to call edit user endpoint 'users/:id'
      api
        .put(`/users/${username}`, {
          currentPassword: data.currentPassword,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
        .then((response) => {
          console.log("password correct", response.data);
          setData({
            ...data,
            isSubmitting: false,
            password: "",
            currentPassword: "",
            confirmPassword: "",
          });
          toast.success(
            `Without pain, without sacrifice, we would have nothing.`
          );
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message,
          });
          toast.error("We strayed from the formula, and we paid the price.");
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

  const updateAvatar = async () => {
    try {
      const response = await api.put(`/users/${params.uname}/avatar`, {
        profile_image: profileImage,
      });
      console.log("Avatar Updated", response.data);
      toast.success(`Successfully updated the Avatar`);
    } catch (error) {
      console.log("Error with Avatar upload", error);
      toast.error(`Error updating avatar: ${error.message}`);
    }
  };

  const handleSubmitAll = async () => {
    if (passwordChanged) {
      try {
        await handleUpdatePassword();
        setPasswordChanged(false);
      } catch (error) {
        // Handle password update error
      }
    }

    if (avatarChanged) {
      try {
        await updateAvatar();
        setAvatarChanged(false);
      } catch (error) {
        // Handle avatar update error
      }
    }

    try {
      await api.put(`/users/${params.uname}`, data);
      toast.success("Profile updated successfully");
      // If username is part of userDetails and it's changed, handle it appropriately
    } catch (error) {
      toast.error("Failed to update profile");
    }

    navigate(`/u/${user.username}`); // Ensure user.username is updated if username changes
  };

  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }
  return (
    <>
      <Container fluid className="p-3" style={{ maxWidth: "500px" }}>
        <Button
          variant="outline-info"
          onClick={() => {
            navigate(`/u/${user.username}`);
          }}
          style={{ border: "none", color: "black" }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>

        <Container animation="false">
          <Card
            bg="header"
            className="text-center justify-content-center align-items-center mt-3"
          >
            <Card.Body>
              <Row>
                <Col xs="auto">
                  <Figure
                    className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                    style={{ height: "100px", width: "100px" }}
                  >
                    <Figure.Image
                      src={user.profile_image}
                      style={{
                        borderRadius: "50%",
                        height: "100%",
                        width: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </Figure>
                </Col>
                <Col xs="auto">
                  <div>{capitalizeFirstLetter(state.user?.username)}</div>
                  <Card.Text className="mb-3">{user.email}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mt-3 p-3">
            <Form>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={data.firstName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      firstName: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {/* Repeat for lastName and city */}
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={data.lastName}
                  onChange={(e) =>
                    setData({ ...data, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={data.city}
                  onChange={(e) =>
                    setData({ ...data, city: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Select
                  value={data.state}
                  onChange={(e) =>
                    setData({ ...data, state: e.target.value })
                  }
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
              id="passwordForm"
              noValidate
              validated={validated}
              onSubmit={handleUpdatePassword}
            >
              <Form.Group>
                <Form.Label htmlFor="password">Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  required
                  value={data.currentPassword}
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Current Password is required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label htmlFor="password">New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  value={data.password}
                  onChange={handleInputChange}
                />
                <Form.Text id="passwordHelpBlock" muted>
                  Must be 8-20 characters long.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Confirm Password is required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label htmlFor="password">Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  required
                  value={data.confirmPassword}
                  onChange={handleInputChange}
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
          <Card className="mt-3">
            <div className="mt-5 justify-content-center">
              <Form className="avatarChange" noValidate validated={validated}>
                <h6 className="mt-1">Select a new Avatar:</h6>
                <AvatarPicker
                  setProfileImage={setProfileImage}
                  profileImage={profileImage}
                  setAvatarChanged={setAvatarChanged}
                />
              </Form>
            </div>
          </Card>

          <Modal show={showModal} onHide={toggleModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Album</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddAlbums
                onAlbumSubmit={handleAddAlbum}
                toggleModal={toggleModal}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <div className="text-center m-3">
          <Button
            variant="info"
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
