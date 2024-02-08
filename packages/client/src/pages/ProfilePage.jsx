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
import "../custom.scss";

export default function ProfilePage(props) {
  const { state } = useProvideAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [albumCount, setAlbumCount] = useState(0)

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // function capitalizeFirstLetter(string) {
  //   if (!string) return "";
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  const updateAlbumCount = (count) =>{
    setAlbumCount(count)
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
      <Container className="mt-3" style={{ width: "60%" }}>
        <Card bg="header" className="text-center">
          <Card.Body>
            <Row className="justify-content-center align-items-center mt-3">
              <Col xs={12} sm={4} md={3} lg={2}>
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
                <Card.Text className="mb-3">
                  {user.firstName} {user.lastName}
                </Card.Text>
                <Card.Text className="mb-3">{user.email}</Card.Text>
                <Card.Text className="mb-3">
                  {user.city}, {user.state}
                </Card.Text>
                <Card.Text>{albumCount} albums</Card.Text>

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
        {/* <h1 className="mt-5 text-center">
          {capitalizeFirstLetter(params.uname)}'s Album Collection
          {user.firstName}'s Album Collection
        </h1> */}
        <DisplayAlbums username={params.uname} onAlbumsChange={updateAlbumCount} />
      </Container>
    </>
  );
}
