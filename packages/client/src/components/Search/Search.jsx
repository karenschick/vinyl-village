// Importing necessary modules and components from React, React-Bootstrap, and routing
import React, { useState } from "react";
import {
  Modal,
  Card,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import api from "../../util/api";
import { Link } from "react-router-dom";

// SearchForm component definition
const SearchForm = () => {
  // State variables for search criteria, search results, and modal visibility
  const [search, setSearch] = useState({
    albumTitle: "",
    artistName: "",
    bandMember: "",
    trackTitle: "",
    releaseYear: "",
    condition: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Handles input changes in the form and updates search state
  const handleInputChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Function to handle form submission and perform a search
  const handleSearch = async (e) => {
    e.preventDefault();
    // Filtering out empty search parameters for cleaner requests
    const filteredSearchParams = Object.fromEntries(
      Object.entries(search).filter(([key, value]) => value.trim() !== "")
    );
    try {
      // Sending a GET request with filtered search parameters
      const response = await api.get("/albums/search", {
        params: filteredSearchParams,
      });
      // Setting search results and displaying modal
      setSearchResults(response.data);
      setShowModal(true);

      // Resetting the search form after submission
      setSearch({
        albumTitle: "",
        artistName: "",
        bandMember: "",
        trackTitle: "",
        releaseYear: "",
        condition: "",
      });
    } catch (error) {
      console.error("Error handling search:", error.message);
    }
  };

  return (
    <Container>
      <h1>Album Search</h1>
      {/* Search form with individual input fields for search criteria */}
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="formTitle">
          <Form.Control
            type="text"
            placeholder="Album Title"
            value={search.albumTitle}
            onChange={handleInputChange}
            name="albumTitle"
            style={{ marginBottom: "2px", opacity: "0.8" }}
          />
        </Form.Group>
        <Form.Group controlId="formArtist">
          <Form.Control
            type="text"
            placeholder="Artist Name "
            value={search.artistName}
            onChange={handleInputChange}
            name="artistName"
            style={{ marginBottom: "2px", opacity: "0.8" }}
          />
        </Form.Group>

        <Form.Group controlId="formMember">
          <Form.Control
            type="text"
            placeholder="Band Member"
            value={search.bandMember}
            name="bandMember"
            onChange={handleInputChange}
            style={{ marginBottom: "2px", opacity: "0.8" }}
          />
        </Form.Group>
        <Form.Group controlId="formTrack">
          <Form.Control
            type="text"
            placeholder="Song"
            value={search.trackTitle}
            name="trackTitle"
            onChange={handleInputChange}
            style={{ marginBottom: "2px", opacity: "0.8" }}
          />
        </Form.Group>
        <Form.Group controlId="formYear">
          <Form.Control
            type="number"
            placeholder="Release Year"
            value={search.releaseYear}
            name="releaseYear"
            onChange={handleInputChange}
            min="1889"
            max={new Date().getFullYear()}
            style={{ marginBottom: "2px", opacity: "0.8" }}
          />
        </Form.Group>
        <Form.Group controlId="formCondition">
          <Form.Control
            as="select"
            name="condition"
            value={search.condition}
            onChange={handleInputChange}
            style={{ marginBottom: "2px", opacity: "0.8" }}
          >
            <option value="">Condition</option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="warning"
          className="mt-3"
          style={{ border: "none", color: "white" }}
        >
          Search
        </Button>
      </Form>

      {/* Modal to display search results when showModal is true */}
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Search Results</Modal.Title>
          </Modal.Header>
          <Modal.Body className="align-items-center text-center">
            {searchResults.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {searchResults.map((album, index) => (
                  <Card key={index} style={{ width: "18rem", margin: "10px" }}>
                    <Card.Img
                      variant="top"
                      src={album.image ? album.image :`${import.meta.env.BASE_URL}vinyl-village/default-image.jpg`}
                      alt={album.albumTitle}
                      onError={(e) => {
                        e.target.onerror = null; // Prevents recursion
                        e.target.src = `${import.meta.env.BASE_URL}vinyl-village/album8.jpg`;
                      }}
                    ></Card.Img>
                    <Card.Body>
                      <Card.Title>{album.albumTitle}</Card.Title>
                      <Card.Subtitle className="mt-2">
                        {album.artistName}
                      </Card.Subtitle>
                      <Card.Text className="mt-2">
                        {album.condition} Condition
                      </Card.Text>
                      <Card.Text className="mt-3">
                        <Row className="align-items-center mt-4">
                          <Col md={2} className="ms-4">
                            {album.author.profile_image && (
                              <Link to={`/u/${album.author.username}`}>
                                <img
                                  src={album.author.profile_image || `${import.meta.env.BASE_URL}vinyl-village/default-profile.jpg`}
                                  alt={`Profile Image of ${album.author.username}`}
                                  style={{ width: "50px", height: "50px" }}
                                  onError={(e) => { e.target.onerror = null;
                                    EventTarget.src = `{import.meta.env.BASE_URL}vinyl-village/default-profile.jpg}`
                                  }}
                                />
                              </Link>
                            )}{" "}
                          </Col>{" "}
                          <Col md={8}>
                            <Link
                              style={{
                                textDecoration: "none",
                                color: "dark",
                              }}
                              to={`/u/${album.author.username}`}
                            >
                              {album.author.firstName} {album.author.lastName}
                            </Link>
                            <br />
                            {album.author.city}, {album.author.state}
                          </Col>
                        </Row>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>No results available.</div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

// Exporting SearchForm component for use in other files
export default SearchForm;
