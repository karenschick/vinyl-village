import React, { useState } from "react";
import axios from "axios";
import { Modal, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useApiFetch } from "../../util/api";
import { API_URL } from "../../util/constants";
import api from "../../util/api";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNavigate, useParams, Link } from "react-router-dom";

const SearchForm = () => {
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
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  //const response = await api.get(`${API_URL}/albums/search`,{
  // params: { ...search, filteredSearchParams },

  const handleSearch = async (e) => {
    e.preventDefault();
    const filteredSearchParams = Object.fromEntries(
      Object.entries(search).filter(([key, value]) => value.trim() !== "")
    );
    try {
      const response = await api.get("/albums/search", {
        params: filteredSearchParams,
      });
      setSearchResults(response.data);

      setShowModal(true);
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
    <div>
      <h1>Search for Albums</h1>
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
            <option value="poor">Poor</option>
            <option value="fair">Fair</option>
            <option value="good">Good</option>
            <option value="excellent">Excellent</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>

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
                    <Card.Body>
                      <Card.Title>{album.albumTitle}</Card.Title>
                      <Card.Subtitle>{album.artistName}</Card.Subtitle>
                      <Card.Text>
                        Condition: {album.condition.toUpperCase()}
                      </Card.Text>
                      <Card.Text className="mt-3">
                        <Row className="align-items-center">
                          <Col>
                            {album.author.profile_image && (
                              <Link to={`/u/${album.author.username}`}>
                                <img
                                  src={album.author.profile_image}
                                  alt="Profile"
                                  style={{ width: "50px", height: "50px" }}
                                />
                              </Link>
                            )}{" "}
                          </Col>{" "}
                          <Col>
                            <Link to={`/u/${album.author.username}`}>
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
    </div>
  );
};

export default SearchForm;
