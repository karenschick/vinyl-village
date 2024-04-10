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

const EditAddPage = () => {
  const { state, updateUser } = useProvideAuth();
  const { error, isLoading, response } = useApiFetch("/albums");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

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

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleEditProfileImage = () => {
    setShowModal(true);
  };

  return (
    <div className="text-center">
      <Container style={{ maxWidth: "500px" }}>
        <Button
          variant="outline-dark"
          onClick={() => {
            navigate(`/u/${state.user?.username}`);
          }}
          style={{ border: "none", color: "black" }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>
        <Container>
          <Card
            bg="header"
            className="text-center justify-content-center align-items-center "
          >
            <Card.Body>
              <Row className="align-items-center">
                <Col xs="auto">
                  <Figure
                    className="bg-border-color overflow-hidden my-auto ml-2 p-1"
                    style={{ height: "100px", width: "100px" }}
                  >
                    {!loading && state.user && (
                      <Figure.Image
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
                  {state.user && (
                    <div>
                      <Button
                        size="sm"
                        variant="dark"
                        className="d-inline-block"
                        onClick={handleEditProfileImage}
                      >
                        Edit Profile Image
                      </Button>
                    </div>
                  )}
                </Col>
                <Col xs="auto ">
                  <h2>{capitalizeFirstLetter(state.user?.username)}</h2>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AvatarPicker
            handleCloseModal={() => setShowModal(false)}
            user={state.user}
            isRegistration={false}
          />
        </Modal.Body>
      </Modal>

      <EditProfile />
    </div>
  );
};

export default EditAddPage;
