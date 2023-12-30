import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:3001/api";


export const AddAlbums = ({ onAlbumSubmit }) => {
  const [albumData, setAlbumData] = useState({
    albumTitle: "",
    releaseYear: "",
    artistName: "",
    tracks: [{ trackTitle: "", trackDuration: "" }],
    bandMembers: [{ memberName: "" }],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAlbumData({ ...albumData, [name]: value });
  };

  const handleTrackChange = (index, event) => {
    const newTracks = [...albumData.tracks];
    newTracks[index][event.target.name] = event.target.value;
    setAlbumData({ ...albumData, tracks: newTracks });
  };

  const handleBandMemberChange = (index, event) => {
    const newBandMembers = [...albumData.bandMembers];
    newBandMembers[index][event.target.name] = event.target.value;
    setAlbumData({ ...albumData, bandMembers: newBandMembers });
  };

  const addTrack = () => {
    setAlbumData({
      ...albumData,
      tracks: [...albumData.tracks, { trackTitle: "", trackDuration: "" }],
    });
  };

  const addBandMember = () => {
    setAlbumData({
      ...albumData,
      bandMembers: [...albumData.bandMembers, { memberName: "" }],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const adjustedAlbumData = {
      ...albumData,
      releaseYear: parseInt(albumData.releaseYear, 10),
      tracks: albumData.tracks.map((track) => ({
        ...track,
        trackDuration: track.trackDuration ? parseInt(track.trackDuration, 10) : 0
      })).filter(track => track.trackTitle)
    }

   console.log("sending data:", adjustedAlbumData)

      try {
        const response = await axios.post(API_URL + '/albums', adjustedAlbumData)
        console.log("response data:", response.data)
        onAlbumSubmit(adjustedAlbumData);
      }catch (error){
        console.error("Error:", error.response.data)
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
    <Form onSubmit={handleSubmit} style={{padding:"100px"}}>
      <Form.Group>
        <Form.Label>Album Title</Form.Label>
        <Form.Control
          type="text"
          name="albumTitle"
          value={albumData.albumTitle}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Release Year</Form.Label>
        <Form.Control
          type="number"
          name="releaseYear"
          value={albumData.releaseYear}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Artist Name</Form.Label>
        <Form.Control
          type="text"
          name="artistName"
          value={albumData.artistName}
          onChange={handleInputChange}
        />
      </Form.Group>
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
        </div>
      ))}
      <Button onClick={addTrack}>Add Track</Button>
      <h5>Band Members</h5>
      {albumData.bandMembers.map((member, index) => (
        <Form.Control
          key={index}
          type="text"
          name="memberName"
          placeholder="Band Member Name"
          value={member.memberName}
          onChange={(e) => handleBandMemberChange(index, e)}
        />
      ))}
      <Button onClick={addBandMember}>Add Band Member</Button>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default AddAlbums;
