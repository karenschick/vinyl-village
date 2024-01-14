import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../util/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AddAlbums = ({ onAlbumSubmit, toggleModal }) => {
  const [albumData, setAlbumData] = useState({
    albumTitle: "",
    releaseYear: "",
    artistName: "",
    tracks: [{ trackTitle: "", trackDuration: "" }],
    bandMembers: [{ memberName: "" }],
  });

  const isValidYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year >= 1889 && year <= currentYear;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "releaseYear" && value < 0) {
      return;
    }
    setAlbumData({ ...albumData, [name]: value });
  };

  const handleTrackChange = (index, event) => {
    const newTracks = [...albumData.tracks];

    const { name, value } = event.target;
    if (name === "trackDuration" && value < 0) {
      return;
    }

    newTracks[index][name] = value;
    setAlbumData({ ...albumData, tracks: newTracks });
  };

  const handleBandMemberChange = (index, event) => {
    const newBandMembers = [...albumData.bandMembers];
    newBandMembers[index][event.target.name] = event.target.value;
    setAlbumData({ ...albumData, bandMembers: newBandMembers });
  };

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

  const addBandMember = () => {
    setAlbumData({
      ...albumData,
      bandMembers: [...albumData.bandMembers, { memberName: "" }],
    });
  };

  const removeTrack = (index) => {
    const newTracks = [...albumData.tracks];
    newTracks.splice(index, 1);
    setAlbumData({ ...albumData, tracks: newTracks });
  };

  const removeBandMember = (index) => {
    const newBandMembers = [...albumData.bandMembers];
    newBandMembers.splice(index, 1);
    setAlbumData({ ...albumData, bandMembers: newBandMembers });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!albumData.albumTitle) {
      toast.error("Album title is required");
      return;
    }

    if (!albumData.artistName) {
      toast.error("Artist name is required");
      return;
    }

    const year = parseInt(albumData.releaseYear, 10);
    if (isNaN(year) || !isValidYear(year)) {
      toast.error(
        "Invalid release year. Please enter a year between 1889 and the current year."
      );
      return;
    }

    if (
      albumData.tracks.length === 0 ||
      albumData.tracks.some(
        (track) => !track.trackTitle || !track.trackDuration
      )
    ) {
      toast.error("Each track must have a title and duration");
      return;
    }

    const adjustedAlbumData = {
      ...albumData,
      releaseYear: year,
      tracks: albumData.tracks
        .filter((track) => track.trackTitle)
        .map((track, index) => ({
          ...track,
          trackNumber: index + 1,
          trackDuration: parseInt(track.trackDuration, 10) || 0,
        })),
    };

    console.log("sending data:", adjustedAlbumData);

    try {
      const response = await axios.post(API_URL + "/albums", adjustedAlbumData);
      console.log("response data:", response.data);
      onAlbumSubmit(adjustedAlbumData);
      toggleModal();
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      toast.error("An error occurred while submitting the form.");
      //console.error("Error:", error.response.data);
    }

    setAlbumData({
      albumTitle: "",
      releaseYear: "",
      artistName: "",
      tracks: [{ trackTitle: "", trackDuration: "" }],
      bandMembers: [{ memberName: "" }],
    });
  };

  return (
    <>
      <ToastContainer />
      <Form onSubmit={handleSubmit} style={{ padding: "50px" }}>
        <Form.Group>
          <h5>Album</h5>
          <Form.Control
            type="text"
            name="albumTitle"
            placeholder="Album Title"
            value={albumData.albumTitle}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <h5>Year</h5>
          <Form.Control
            type="number"
            name="releaseYear"
            placeholder="Release Year"
            value={albumData.releaseYear}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <h5>Artist</h5>
          <Form.Control
            type="text"
            name="artistName"
            placeholder="Artist Name"
            value={albumData.artistName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <h5>Tracks</h5>
          {albumData.tracks.map((track, index) => (
            <div key={index}>
              <Form.Control
                type="text"
                name="trackTitle"
                placeholder="Track Title"
                value={track.trackTitle}
                onChange={(e) => handleTrackChange(index, e)}
              />
              <Form.Control
                type="number"
                name="trackDuration"
                placeholder="Track Duration (seconds)"
                value={track.trackDuration}
                onChange={(e) => handleTrackChange(index, e)}
              />
              <Row className="justify-content-center mt-2 mb-2">
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Button
                    variant="danger"
                    onClick={() => removeTrack(index)}
                    className="w-100"
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Row className="text-center mt-2">
            <Col>
              <Button variant="secondary" onClick={addTrack}>
                Add Track
              </Button>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mt-3">
          <h5>Band Members</h5>
          {albumData.bandMembers.map((member, index) => (
            <div key={index} className="mb-2">
              <Form.Control
                type="text"
                name="memberName"
                placeholder="Band Member Name"
                value={member.memberName}
                onChange={(e) => handleBandMemberChange(index, e)}
              />

              <Row className="justify-content-center mt-2">
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Button
                    variant="danger"
                    onClick={() => removeBandMember(index)}
                    className="w-100"
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Row className="text-center mt-2">
            <Col>
              <Button variant="secondary" onClick={addBandMember}>
                Add Band Member
              </Button>
            </Col>
          </Row>
        </Form.Group>
        <Row className="text-center mt-5">
          <Col>
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddAlbums;
