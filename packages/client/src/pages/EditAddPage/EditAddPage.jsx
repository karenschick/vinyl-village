// Import necessary modules and components from React and other libraries
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Card,
  Row,
  Col,
  Figure,
  Modal,
} from "react-bootstrap";
import { useProvideAuth } from "../../hooks/useAuth";
import { useApiFetch } from "../../util/api";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../util/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import EditProfile from "../../components/EditProfile/EditProfile";
import AvatarPicker from "../../components/AvatarPicker/AvatarPicker";

// Main component for editing a user's profile page
const EditAddPage = () => {
  // Destructure auth state and user update function
  const { state, updateUser } = useProvideAuth();
  // Fetch album data using a custom hook
  const { error, isLoading, response } = useApiFetch("/albums");
  const [loading, setLoading] = useState(true); // State for loading user data
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Define navigation and route parameters for user navigation
  let navigate = useNavigate();
  let params = useParams();
  // Retrieve authentication state to control access to this page
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // Fetch user data on component mount if authenticated
  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        updateUser(userResponse.data); // Update user info in auth context
        setLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };

    // Only fetch user data if isAuthenticated is true
    if (isAuthenticated && loading) {
      getUser();
    }
  }, [params.uname, isAuthenticated, loading, updateUser]);

  // Handle opening the profile image edit modal
  const handleEditProfileImage = () => {
    setShowModal(true);
  };

  // Handle closing the profile image picker modal
  const handleClosePicker = () => {
    setShowModal(false);
  };

  return (
    <div className="text-center">
      <Container style={{ maxWidth: "500px" }}>
        {/* Back button to navigate to the user's profile */}
        <Button
          variant="outline-orange"
          onClick={() => {
            navigate(`/u/${state.user?.username}`);
          }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>
        {/* Card component to display user profile info */}
        <Container>
          <Card
            bg="header"
            className="text-center justify-content-center align-items-center "
          >
            <Card.Body>
              <Row className="align-items-center">
                <Col xs="auto">
                  {/* Display user profile image */}
                  <Figure
                    className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                    style={{ height: "100px", width: "100px" }}
                  >
                    {!loading && state.user && (
                      <Figure.Image
                        alt={`Profile Image of ${state.user.username}`}
                        src={state.user.profile_image}
                        style={{
                          borderRadius: "0%",
                          maxheight: "90px",
                          maxWidth: "90px",
                          width: "auto",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Figure>
                  {/* Button to open profile image editor */}
                  {state.user && (
                    <div>
                      <Button
                        size="sm"
                        variant="orange"
                        style={{ color: "white" }}
                        className="d-inline-block"
                        onClick={handleEditProfileImage}
                      >
                        Edit Profile Image
                      </Button>
                    </div>
                  )}
                </Col>
                <Col xs="auto ">
                  {/* Display username */}
                  <h2>{state.user?.username}</h2>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </Container>

      {/* Modal for editing the profile image */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Edit Profile Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "350px",
            margin: "auto",
          }}
        >
          <AvatarPicker
            handleCloseModal={() => setShowModal(false)}
            user={state.user}
            isRegistration={false}
            isEditPage={true}
            handleClosePicker={handleClosePicker}
          />
        </Modal.Body>
      </Modal>
      {/* Component for editing profile details */}
      <EditProfile />
    </div>
  );
};

export default EditAddPage;
