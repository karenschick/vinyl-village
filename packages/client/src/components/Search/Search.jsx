import React, { useState } from "react";
import axios from "axios";
import { Modal, Card, Form, Button } from "react-bootstrap";
import { useApiFetch } from "../../util/api";
import { API_URL } from "../../util/constants";
import api from "../../util/api";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNavigate, useParams } from "react-router-dom";

const SearchForm = () => {
  const [search, setSearch] = useState({
    albumTitle: "",
    artistName: "",
    bandMember: "",
    trackTitle: "",
    releaseYear: "",
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
      Object.entries(search).filter(([key, value]) => value.trim() !== '')
    );
    try {
      const response = await api.get("/albums/search", {
        params: filteredSearchParams,
      });
      setSearchResults(response.data);
      
        setShowModal(true);
    } catch (error) {
      console.error("Error handling search:", error.message);
    }
  };
  
  
  
  
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Form onSubmit={handleSearch}>
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
        <Button type="submit">Search</Button>
      </Form>

      {searchResults.length > 0 && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Search Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {searchResults.map((album, index) => (
          <Card key={index} style={{ width: "18rem", margin: "10px" }}>
            <Card.Body>
            {album.author.profile_image && (
                <img src={album.author.profile_image} alt="Profile" style={{ width: "50px", height: "50px" }} />
              )}
              <Card.Title>{album.albumTitle}</Card.Title>
              <Card.Text>
                Owner: {album.author.firstName} {album.author.lastName}
                <br />
                {album.author.city} {album.author.state}
                
              </Card.Text>
              {/* Display profile image if available */}
              
            </Card.Body>
          </Card>
        ))}
      </div>
    </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default SearchForm;
