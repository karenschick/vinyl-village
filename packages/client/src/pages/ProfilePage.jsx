import React, { useState, useEffect } from "react";
import { Container, Card, Button, Figure, Row, Col } from "react-bootstrap";
//import { useApiFetch } from "../util/api";
import DisplayAlbums from "../components/DisplayAlbums/displayAlbums";
import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../util/api";


export default function ProfilePage(props) {
  const { state } = useProvideAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
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
      <Container className="mt-3"style={{width: "50%"}}>
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
                <h1>
                  {capitalizeFirstLetter(params.uname)}'s Album Collection
                </h1>
                <Card.Text className="mb-3">{user.email}</Card.Text>
              </Col>
            </Row>
          </Card.Body>

          {state.user.username === params.uname && (
            <div className="mb-3">
              {" "}
              <Button
                variant="info"
                className="d-inline-block" 
                style={{
                  border: "none",
                  color: "white",
                  display: "inline-block",
                }}
                onClick={() => navigate(`/u/${params.uname}/edit`)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </Card>
      </Container>

      <Container>
        <DisplayAlbums />
      </Container>
    </>
  );
}
