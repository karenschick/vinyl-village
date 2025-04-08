// Importing necessary libraries and components from React, react-bootstrap, and react-toastify
import React, { useState } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { toast } from "react-toastify";
import api from "../../util/api";
import capitalizeFirstLetter from "../../util/capitalizeFirstLetter";

const AddAlbums = ({ onAlbumSubmit, toggleModal }) => {
  const [albumData, setAlbumData] = useState({
    albumTitle: "",
    releaseYear: "",
    artistName: "",
    tracks: [{ trackTitle: "", trackDuration: "" }], // Initial track structure
    bandMembers: [{ memberName: "" }], // Initial band member structure
    condition: "",
  });

  // Getting current authenticated user state
  const {
    state: { user },
  } = useProvideAuth();

  // Check if the user is authenticated
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // State to handle file upload for album image
  const [selectedFile, setSelectedFile] = useState(null);

  // Validates if the year is between 1889 and the current year
  const isValidYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year >= 1889 && year <= currentYear;
  };

  // Handles input changes for album details (title, year, artist, etc.)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Preventing negative values for year input
    if (name === "releaseYear" && value < 0) {
      return;
    }
    setAlbumData({ ...albumData, [name]: value });
  };

  // Handles track input changes for title and duration
  const handleTrackChange = (index, event) => {
    const newTracks = [...albumData.tracks];
    const { name, value } = event.target;

    // Preventing negative values for track duration
    if (name === "trackDuration" && value < 0) {
      return;
    }

    newTracks[index][name] = value;
    setAlbumData({ ...albumData, tracks: newTracks });
  };

  // Handles band member name changes
  const handleBandMemberChange = (index, event) => {
    const newBandMembers = [...albumData.bandMembers];
    newBandMembers[index][event.target.name] = event.target.value;
    setAlbumData({ ...albumData, bandMembers: newBandMembers });
  };

  // Adds a new track to the album
  const addTrack = () => {
    const newTrackNumber = albumData.tracks.length + 1;
    setAlbumData({
      ...albumData,
      tracks: [
        ...albumData.tracks,
        { trackTitle: "", trackDuration: "", trackNumber: newTrackNumber },
      ],
    });
  };

  // Adds a new band member to the list
  const addBandMember = () => {
    setAlbumData({
      ...albumData,
      bandMembers: [...albumData.bandMembers, { memberName: "" }],
    });
  };

  // Removes a track from the album
  const removeTrack = (index) => {
    const newTracks = [...albumData.tracks];
    newTracks.splice(index, 1); // Removes the track at the given index
    setAlbumData({ ...albumData, tracks: newTracks });
  };

  // Removes a band member from the list
  const removeBandMember = (index) => {
    const newBandMembers = [...albumData.bandMembers];
    newBandMembers.splice(index, 1); // Removes the band member at the given index
    setAlbumData({ ...albumData, bandMembers: newBandMembers });
  };

  // Handles the form submission to submit the album data
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Basic validation checks for album title and artist name
    if (!albumData.albumTitle) {
      console.log("Album title is required");
      toast.error("Album title is required");
      return;
    }
    if (!albumData.artistName) {
      toast.error("Artist name is required");
      return;
    }

    // Validates the release year
    const year = parseInt(albumData.releaseYear, 10);
    if (isNaN(year) || !isValidYear(year)) {
      toast.error(
        "Invalid release year. Please enter a year between 1889 and the current year."
      );
      return;
    }
    // Ensuring all tracks have a title and duration
    if (
      albumData.tracks.length === 0 ||
      albumData.tracks.some(
        (track) => !track.trackTitle || !track.trackDuration
      )
    ) {
      toast.error("Each track must have a title and duration");
      return;
    }

    if (!albumData.condition) {
      toast.error("Condition is required");
    }

    // Prepares the album data for submission (tracks and band members serialized as JSON)
    const adjustedAlbumData = {
      albumTitle: albumData.albumTitle,
      releaseYear: year,
      artistName: albumData.artistName,
      condition: albumData.condition,
      tracks: JSON.stringify(
        albumData.tracks
          .filter((track) => track.trackTitle) // Only include tracks with titles
          .map((track, index) => ({
            trackTitle: track.trackTitle,
            trackNumber: index + 1,
            trackDuration: parseInt(track.trackDuration, 10) || 0,
          }))
      ),
      bandMembers: JSON.stringify(albumData.bandMembers),
    };
    // Creates a FormData object to send album data along with the image file
    const formData = new FormData();
    Object.keys(adjustedAlbumData).forEach((key) => {
      formData.append(key, adjustedAlbumData[key]);
    });

    if (selectedFile) {
      formData.append("image", selectedFile); // Adding the selected image to the form
    }
    // Logging form data for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Submits the form data to the API endpoint
    try {
      const response = await api.post("/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response data:", response.data);
      onAlbumSubmit(response.data);
      toggleModal();
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      toast.error("An error occurred while submitting the form.");
    }

    // Resets the form after submission
    setAlbumData({
      albumTitle: "",
      releaseYear: "",
      artistName: "",
      tracks: [{ trackTitle: "", trackDuration: "" }],
      bandMembers: [{ memberName: "" }],
    });
  };

  // JSX return - renders the form to add albums with tracks, band members, and condition
  return (
    <>
      <Form onSubmit={handleSubmit} className="p-sm-4 p-2">
        <Form.Group controlId="formFile" className="mb-3">
          <h5>Album Image</h5>
          <Form.Control
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <h5>Album</h5>
          <Form.Control
            type="text"
            name="albumTitle"
            placeholder="Album Title"
            value={albumData.albumTitle}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mt-4">
          <h5>Year</h5>
          <Form.Control
            type="number"
            name="releaseYear"
            placeholder="Release Year"
            value={albumData.releaseYear}
            min="1889"
            max={new Date().getFullYear()}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mt-4">
          <h5>Artist</h5>
          <Form.Control
            type="text"
            name="artistName"
            placeholder="Artist Name"
            value={albumData.artistName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mt-4">
          <h5>Band Members</h5>
          {albumData.bandMembers.map((member, index) => (
            <Row key={index} className="align-items-center mb-2">
              <Col>
                <Form.Control
                  type="text"
                  name="memberName"
                  placeholder="Band Member Name"
                  value={member.memberName}
                  onChange={(e) => handleBandMemberChange(index, e)}
                />
              </Col>
              <Col xs="auto">
                <Container className="close">
                  <img
                    alt="Trash Icon"
                    src={`${import.meta.env.BASE_URL}vinyl-village/trash2.png`}
                    style={{
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeBandMember(index)}
                  ></img>
                </Container>
              </Col>
            </Row>
          ))}
          <Button
            variant="outline-warning"
            onClick={addBandMember}
            className="mt-1"
          >
            Add Member
          </Button>
        </Form.Group>
        <Form.Group className="mt-4">
          <h5>Tracks</h5>
          {albumData.tracks.map((track, index) => (
            <Row key={index} className="align-items-center mb-2">
              <Col>
                <Form.Control
                  type="text"
                  name="trackTitle"
                  placeholder="Track Title"
                  value={track.trackTitle}
                  onChange={(e) => handleTrackChange(index, e)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  name="trackDuration"
                  placeholder="Duration (sec)"
                  value={track.trackDuration}
                  onChange={(e) => handleTrackChange(index, e)}
                />
              </Col>
              <Col xs="auto">
                <Container className="close">
                  <img
                    alt="Trash Icon"
                    src={`${import.meta.env.BASE_URL}vinyl-village/trash2.png`}
                    style={{
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeTrack(index)}
                  ></img>
                </Container>
              </Col>
            </Row>
          ))}
          <Button variant="outline-warning" onClick={addTrack} className="mt-1">
            Add Track
          </Button>
        </Form.Group>

        <Form.Group className="mt-4">
          <h5>Condition</h5>
          <Form.Control
            as="select"
            name="condition"
            value={albumData.condition}
            onChange={handleInputChange}
            style={{ opacity: "0.8" }}
          >
            <option value=""></option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </Form.Control>
        </Form.Group>

        <Row className="text-center mt-4">
          <Col>
            <Button variant="warning" style={{ color: "white" }} type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

// Exporting the AddAlbums component for use in other parts of the application
export default AddAlbums;
