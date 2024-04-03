import React, { useState, useEffect } from "react";
import { Container, Card, Button, Figure, Row, Col } from "react-bootstrap";
import DisplayAlbums from "../components/DisplayAlbums/displayAlbums";
import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../util/api";


export default function ProfilePage(props) {
  const { state, updateUser } = useProvideAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [albumCount, setAlbumCount] = useState(0);

  let navigate = useNavigate();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  
  const updateAlbumCount = (count) => {
    setAlbumCount(count);
  };

  useEffect(() => {
    console.log("username on profile page:", params)
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        setUser(userResponse.data);
        setProfileImage(userResponse.data.profile_image);
        setLoading(false);
        updateUser(userResponse.data)
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
      <Container className="" style={{ maxWidth: "500px" }}>
        <Card
          bg="header"
          className="text-center justify-content-center align-items-center mt-5"
        >
          <Card.Body>
            <Row className="align-items-center ">
              <Col>
                <Figure
                  className="bg-border-color overflow-hidden my-auto ml-2 p-1 "
                  style={{ height: "100px", width: "100px" }}
                >
                  <Figure.Image
                    src={user.profile_image}
                    style={{
                      borderRadius: "0%",
                      maxheight: "90px",
                      maxWidth: "90px",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Figure>
              </Col>
              <Col xs="auto ">
                <Card.Text className="mb-2">
                  {user.firstName} {user.lastName}
                </Card.Text>
                <Card.Text className="mb-2">{user.email}</Card.Text>
                <Card.Text className="mb-2">
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
                size="sm"
                variant="dark"
                className="d-inline-block"
                // style={{
                //   border: "none",
                //   color: "white",
                //   display: "inline-block",
                // }}
                onClick={() => navigate(`/u/${params.uname}/edit`)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </Card>
      </Container>

      <Container>
        <DisplayAlbums
          username={params.uname}
          onAlbumsChange={updateAlbumCount}
        />
      </Container>
    </>
  );
}
