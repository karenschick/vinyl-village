// Import necessary libraries and componentsimport React, { useState, useEffect } from "react";
import { Container, Card, Button, Figure, Row, Col } from "react-bootstrap";
import DisplayAlbums from "../components/DisplayAlbums/displayAlbums";
import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../util/api";

export default function ProfilePage(props) {
  // Retrieve user state and update function from authentication context
  const { state, updateUser } = useProvideAuth();

  // Define state variables for user data, loading status, profile image, and album count
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [albumCount, setAlbumCount] = useState(0);

  // Initialize navigation and route parameter hooks
  let navigate = useNavigate();
  let params = useParams();

  // Destructure the isAuthenticated state from the authentication hook
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // Function to update the album count state
  const updateAlbumCount = (count) => {
    setAlbumCount(count);
  };

  // useEffect hook to fetch user data when the component mounts or when the username changes
  useEffect(() => {
    console.log("username on profile page:", params);
    // Asynchronous function to fetch user data from the API
    const getUser = async () => {
      try {
        // API call to get user data based on the username from route parameters
        const userResponse = await api.get(`/users/${params.uname}`);
        // Update user state with the fetched data
        setUser(userResponse.data);
        // Set the profile image state with the fetched user data
        setProfileImage(userResponse.data.profile_image);
        // Set loading state to false after data is fetched
        setLoading(false);
        // Update the user context with the fetched data
        updateUser(userResponse.data);
      } catch (err) {
        // Log any error that occurs during the API call
        console.error(err.message);
      }
    };
    // Fetch user data only if the user is authenticated
    isAuthenticated && getUser();
  }, [params.uname, isAuthenticated]);

  // Display a loading spinner if the user is not authenticated
  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  // Display a loading spinner while fetching user data
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
                    alt={`Profile Image of ${user.username}`}
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
                <Card.Text className="mb-2">{user.username}</Card.Text>
                <Card.Text className="mb-2">
                  {user.firstName} {user.lastName}
                </Card.Text>
                {/* <Card.Text className="mb-2">{user.email}</Card.Text> */}
                {/* <Card.Text className="mb-2">
                  {user.city}, {user.state}
                </Card.Text> */}
                <Card.Text>{albumCount} albums</Card.Text>
              </Col>
            </Row>
          </Card.Body>
          {state.user.username === params.uname && (
            <div className="mb-3">
              {" "}
              <Button
                size="sm"
                variant="orange"
                className="d-inline-block"
                style={{
                  color: "white",
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
        <DisplayAlbums
          username={params.uname}
          onAlbumsChange={updateAlbumCount}
        />
      </Container>
    </>
  );
}
