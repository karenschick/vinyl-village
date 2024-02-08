import React, { useState } from "react";

import { Form, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../util/constants";
import { ToastContainer, toast } from "react-toastify";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import api from "../../util/api";
import "react-toastify/dist/ReactToastify.css";
import TrashIcon from "../icons/TrashIcon";

export const AddAlbums = ({ onAlbumSubmit, toggleModal }) => {
  const [albumData, setAlbumData] = useState({
    albumTitle: "",
    releaseYear: "",
    artistName: "",
    tracks: [{ trackTitle: "", trackDuration: "" }],
    bandMembers: [{ memberName: "" }],
    condition: "excellent",
  });
  const {
    state: { user },
  } = useProvideAuth();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();
  const [selectedFile, setSelectedFile] = useState(null);

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
      albumTitle: albumData.albumTitle,
      releaseYear: year,
      artistName: albumData.artistName,
      condition: albumData.condition,
      tracks: JSON.stringify(albumData.tracks
        .filter((track) => track.trackTitle)
        .map((track, index) => ({
          trackTitle: track.trackTitle,
          trackNumber: index + 1,
          trackDuration: parseInt(track.trackDuration, 10) || 0,
        }))),
        bandMembers: JSON.stringify(albumData.bandMembers),
    };
  
    const formData = new FormData();
    Object.keys(adjustedAlbumData).forEach(key => {
      formData.append(key, adjustedAlbumData[key]);
    });
    // Object.keys(adjustedAlbumData).forEach(key => {
    //   if (Array.isArray(adjustedAlbumData[key])) {
    //     adjustedAlbumData[key].forEach((item, index) => {
    //       Object.keys(item).forEach(subKey => {
    //         formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
    //       });
    //     });
    //   } else {
    //     formData.append(key, adjustedAlbumData[key]);
    //   }
    // });
  
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
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
  
    setAlbumData({
      albumTitle: "",
      releaseYear: "",
      artistName: "",
      tracks: [{ trackTitle: "", trackDuration: "" }],
      bandMembers: [{ memberName: "" }],
    });
  };
  
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (!albumData.albumTitle) {
  //     toast.error("Album title is required");
  //     return;
  //   }

  //   if (!albumData.artistName) {
  //     toast.error("Artist name is required");
  //     return;
  //   }

  //   const year = parseInt(albumData.releaseYear, 10);
  //   if (isNaN(year) || !isValidYear(year)) {
  //     toast.error(
  //       "Invalid release year. Please enter a year between 1889 and the current year."
  //     );
  //     return;
  //   }

  //   if (
  //     albumData.tracks.length === 0 ||
  //     albumData.tracks.some(
  //       (track) => !track.trackTitle || !track.trackDuration
  //     )
  //   ) {
  //     toast.error("Each track must have a title and duration");
  //     return;
  //   }

    

  //   const adjustedAlbumData = {
  //     ...albumData,
  //     releaseYear: year,
  //     tracks: albumData.tracks
  //       .filter((track) => track.trackTitle)
  //       .map((track, index) => ({
  //         ...track,
  //         trackNumber: index + 1,
  //         trackDuration: parseInt(track.trackDuration, 10) || 0,
  //       })),
        
  //   };

  //   console.log("sending data:", adjustedAlbumData);

  //   try {
  //     const response = await api.post("/albums", adjustedAlbumData, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },});
  //     console.log("response data:", response.data);
      
  //     onAlbumSubmit(adjustedAlbumData);
  //     toggleModal();
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error);
  //     toast.error("An error occurred while submitting the form.");
  //     //console.error("Error:", error.response.data);
  //   }

  //   setAlbumData({
  //     albumTitle: "",
  //     releaseYear: "",
  //     artistName: "",
  //     tracks: [{ trackTitle: "", trackDuration: "" }],
  //     bandMembers: [{ memberName: "" }],
  //   });
  // };

  return (
    <>
      <ToastContainer />
      <Form onSubmit={handleSubmit} className="p-sm-4 p-2">
      <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Album Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
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
                  <TrashIcon
                    color="#ff52ce"
                    onClick={() => removeBandMember(index)}
                  />
                </Container>
                {/* <Button
                  variant="danger"
                  onClick={() => removeBandMember(index)}
                >
                  Remove
                </Button> */}
              </Col>
            </Row>
          ))}
          <Button
            variant="outline-info"
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
                  <TrashIcon
                    color="#ff52ce"
                    onClick={() => removeTrack(index)}
                  />
                </Container>
                {/* <Button variant="danger" onClick={() => removeTrack(index)}>
                  Remove
                </Button> */}
              </Col>
            </Row>
          ))}
          <Button variant="outline-info" onClick={addTrack} className="mt-1">
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
            style={{  opacity: "0.8" }}
          >
            <option value="poor">Poor</option>
            <option value="fair">Fair</option>
            <option value="good">Good</option>
            <option value="excellent">Excellent</option>
          </Form.Control>
        </Form.Group>

        <Row className="text-center mt-4">
          <Col>
            <Button variant="info" style={{ color: "white" }} type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddAlbums;
