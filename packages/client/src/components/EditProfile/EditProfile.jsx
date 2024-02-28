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
import { useProvideAuth, useAuth } from "../../hooks/useAuth";
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
    firstName: "",
    lastName: "",
    email: "",
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
  const { updateUser } = useAuth();
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
      // Update the profile_image field in the user object stored in the state
      updateUser({ profile_image: profileImage });
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
      <Container fluid style={{ maxWidth: "500px" }}>
        {/* <div className="text-center mt-2 mb-5">
          <h1>Edit Profile</h1>
        </div> */}
        <Container>
          <Card className="mt-3 p-3">
            <Form className="text-start">
              <Form.Group controlId="firstName" className="mt-1">
                <h5>First Name</h5>
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

              <Form.Group controlId="lastName" className="mt-3">
                <h5>Last Name</h5>
                <Form.Control
                  type="text"
                  value={data.lastName}
                  onChange={(e) =>
                    setData({ ...data, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="email" className="mt-3">
                <h5>Email</h5>
                <Form.Control
                  type="text"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="city" className="mt-3">
                <h5>City</h5>
                <Form.Control
                  type="text"
                  value={data.city}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="state" className="mt-3">
                <h5>State</h5>
                <Form.Select
                  value={data.state}
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
              onSubmit={handleUpdatePassword}
            >
              <Form.Group>
                <h5 htmlFor="password">Current Password</h5>
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
                <h5 htmlFor="password">New Password</h5>
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
                <h5 htmlFor="password">Confirm New Password</h5>
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
            <div className="mt-3 justify-content-center">
              <Form className="avatarChange" noValidate validated={validated}>
                <h5 className="mt-1">Select a new Avatar:</h5>
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
            variant="dark"
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
