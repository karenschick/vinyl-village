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
import DisplayAlbums from "../components/DisplayAlbums/displayAlbums";
import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../util/api";
import AvatarPicker from "../components/AvatarPicker/AvatarPicker";
import { toast } from "react-toastify";
import AddAlbums from "../components/AddAlbums/AddAlbums";
import EditProfile from "../components/EditProfile/EditProfile";

export default function ProfilePage(props) {
  const { state } = useProvideAuth();
  //const { error, isLoading, response } = useApiFetch("/albums");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  //const [validated, setValidated] = useState(false);
  //const [showModal, setShowModal] = useState(false);
  //const [open, setOpen] = useState(false);
  // const [data, setData] = useState({
  //   password: "",
  //   currentPassword: "",
  //   confirmPassword: "",
  //   isSubmitting: false,
  //   errorMessage: null,
  // });
  const [profileImage, setProfileImage] = useState("");

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

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

  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  return (
    <>
      <Header />
      <Container>
        <Card bg="header" className="text-center">
          <Card.Body>
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
                  {capitalizeFirstLetter(params.uname)}'s Album
                  Collection
                </div>
                <Card.Text className="mb-3">{user.email}</Card.Text>
              </Col>
            </Row>
          </Card.Body>

          {state.user.username === params.uname && (
          <Button
            variant="info"
            style={{ border: "none", color: "white" }}
            onClick={() => navigate(`/u/${params.uname}/edit`)} 
          >
            Edit Profile
          </Button>)}
        </Card>
      </Container>

      <Container style={{ border: "black" }}>
        <DisplayAlbums />
      </Container>
    </>
  );
}
