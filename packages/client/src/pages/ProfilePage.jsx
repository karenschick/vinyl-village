import React, { useState, useEffect } from "react";
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
import { useApiFetch } from "../util/api";
import DisplayAlbums from "../components/displayAlbums";
import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../util/api";
import AvatarPicker from "../components/AvatarPicker/AvatarPicker";
import { toast } from "react-toastify";
import AddAlbums from "../components/AddAlbums/AddAlbums";

export default function ProfilePage(props) {
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

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  const toggleModal = () => setShowModal(!showModal);

  const handleAddAlbum = (newAlbum) => {
    setDisplayedAlbums([...displayedAlbums, newAlbum]);
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
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    // handle invalid or empty form
    if (form.checkValidity() === false) {
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

  const handleAvatarChange = (event) => {
    event.preventDefault();

    setUser({
      ...user,
      profile_image: profileImage,
    });

    api
      .put(`/users/${params.uname}/avatar`, { profile_image: profileImage })
      .then((response) => {
        console.log("Avatar Updated", response.data);
        toast.success(`Successfully updated the Avatar`);
      })
      .catch((error) => {
        console.log("Error with Avatar upload", error);
        toast.error(`Error updating to ${response.data.profile_image}`);
      });
  };

  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  return (
    <>
      <Header />
      <main>
        <Row
          className="justify-content-center align-items-center mt-3"
          style={{ height: "100px" }} 
        >
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
              {capitalizeFirstLetter(state.user?.username)}'s Album Collection
            </div>
          </Col>
        </Row>
        <Container style={{ border: "black" }}>
          <DisplayAlbums />
        </Container>
      </main>
      <Container className="clearfix">
        <Button
          variant="outline-info"
          onClick={() => {
            navigate(-1);
          }}
          style={{ border: "none", color: "#E5E1DF" }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>
        <Card bg="header" className="text-center">
          <Card.Body>
            <Figure
              className="bg-border-color rounded-circle overflow-hidden my-auto ml-2 p-1 mt-2"
              style={{
                height: "50px",
                width: "50px",
                backgroundColor: "white",
              }}
            >
              <Figure.Image src={user.profile_image} className="w-100 h-100" />
            </Figure>
            <Card.Title>{params.uname}</Card.Title>
            <Card.Text className="mb-3">{user.email}</Card.Text>
            {state.user.username === params.uname && (
              <div
                className={open ? "invisible" : ""}
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer", color: "#BFBFBF" }}
              >
                Edit Profile
              </div>
            )}
            {open && (
              <Container animation="false">
                <div className="row justify-content-center p-4">
                  <div className="col text-center">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleUpdatePassword}
                    >
                      <Form.Group>
                        <Form.Label htmlFor="password">
                          Current Password
                        </Form.Label>
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
                        <Form.Label htmlFor="password">
                          Confirm New Password
                        </Form.Label>
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
                      <Button
                        className=" mt-3"
                        type="submit"
                        disabled={data.isSubmitting}
                      >
                        {data.isSubmitting ? <LoadingSpinner /> : "Update"}
                      </Button>
                    </Form>
                    <div className="mt-5 justify-content-center">
                      <Form
                        className="avatarChange"
                        noValidate
                        validated={validated}
                        onSubmit={handleAvatarChange}
                      >
                        <h6 className="mt-1">Select a new Avatar:</h6>
                        <AvatarPicker
                          setProfileImage={setProfileImage}
                          profileImage={profileImage}
                        />
                        <Button
                          className="mt-3"
                          type="submit"
                          disabled={data.isSubmitting}
                        >
                          {data.isSubmitting ? <LoadingSpinner /> : "Update"}
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
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
                    <Card className="mb-3">
                      <Card.Body>
                        <h3>Add Album to Collection</h3>
                        <Button variant="primary" onClick={toggleModal}>
                          Add
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
