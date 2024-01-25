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

import Header from "../Header/Header";
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
    isSubmitting: false,
    errorMessage: null,
  });
  const [profileImage, setProfileImage] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [albumChanged, setAlbumChanged] = useState(false);
  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const addAlbumSubmitRef = useRef(null);

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
    })
    if (event.target.name === "currentPassword" || event.target.name === "password" || event.target.name === "confirmPassword") {
      setPasswordChanged(true);
    };
  };

  const handleUpdatePassword = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // const form = event.currentTarget;
    // // handle invalid or empty form
    // if (form.checkValidity() === false) {
    //   setValidated(true);
    //   return;
    // }
    const form = document.getElementById('passwordForm'); // Add an ID to your form
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

  // const handleAvatarChange = (event) => {
  //   event.preventDefault();

  //   setUser({
  //     ...user,
  //     profile_image: profileImage,
  //   });

  //   api
  //     .put(`/users/${params.uname}/avatar`, { profile_image: profileImage })
  //     .then((response) => {
  //       console.log("Avatar Updated", response.data);
  //       toast.success(`Successfully updated the Avatar`);
  //     })
  //     .catch((error) => {
  //       console.log("Error with Avatar upload", error);
  //       toast.error(`Error updating to ${response.data.profile_image}`);
  //     });
  //     setAvatarChanged(true);
  // };

  const updateAvatar = async () => {
    try {
      const response = await api.put(`/users/${params.uname}/avatar`, { profile_image: profileImage });
      console.log("Avatar Updated", response.data);
      toast.success(`Successfully updated the Avatar`);
    } catch (error) {
      console.log("Error with Avatar upload", error);
      toast.error(`Error updating avatar: ${error.message}`);
    }
  };
  
  

  const handleSubmitAll = async () => {
  if (passwordChanged) {
    await handleUpdatePassword();
  }

  if (avatarChanged) {
    await updateAvatar(); 
  }

  // if (albumChanged && addAlbumSubmitRef.current) {
  //   addAlbumSubmitRef.current();
  // }

  // Reset change flags
  setPasswordChanged(false);
  setAvatarChanged(false);
  // setAlbumChanged(false);
  
    navigate(`/u/${user.username}`);
  
};

if (!isAuthenticated) {
  return <LoadingSpinner full />;
}

if (loading) {
  return <LoadingSpinner full />;
}
  return (
    <>
      <Container>
        <Button
          variant="outline-info"
          onClick={() => {
            navigate(`/u/${user.username}`);
          }}
          style={{ border: "none", color: "#E5E1DF" }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>

        <Container animation="false">
          <Card bg="header" className="text-center justify-content-center align-items-center mt-3" >
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
                  <div>
                    {capitalizeFirstLetter(state.user?.username)}
                  </div>
                  {/* <Card.Text className="mb-3">{user.email}</Card.Text> */}
                </Col>
                </Row>
            </Card.Body>
          </Card>

          <Card className= "mt-3 p-3">
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
              {/* <Button
                className=" mt-3"
                type="submit"
                disabled={data.isSubmitting}
              >
                {data.isSubmitting ? <LoadingSpinner /> : "Update"}
              </Button> */}
            </Form>
          </Card>
          <Card className="mt-3 p-3">
            <div className="mt-5 justify-content-center">
              <Form
                className="avatarChange"
                noValidate
                validated={validated}
                // onSubmit={handleAvatarChange}
              >
                <h6 className="mt-1">Select a new Avatar:</h6>
                <AvatarPicker
                  setProfileImage={setProfileImage}
                  profileImage={profileImage}
                  setAvatarChanged={setAvatarChanged}
                />
                {/* <Button
                  className="mt-3"
                  type="submit"
                  disabled={data.isSubmitting}
                >
                  {data.isSubmitting ? <LoadingSpinner /> : "Update"}
                </Button> */}
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
          <Row className="justify-content-center">
            <Col md={4} className="text-center">
              <Card className="m-3">
                <Card.Body>
                  <h3>Add Album to Collection</h3>
                  <Button variant="primary" onClick={toggleModal}>
                    Add
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* <Card>
          <h3>Add Album to Collection</h3>
          <AddAlbums/>
          </Card> */}
        </Container>
        <Button onClick={handleSubmitAll}>Submit All</Button>
      </Container>
    </>
  );
};

export default EditProfile;
