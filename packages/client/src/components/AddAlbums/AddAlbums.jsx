import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";

export const AddAlbums = ({ onAlbumSubmit }) => {
  const [albumData, setAlbumData] = useState({
    albumTitle: "",
    releaseYear: "",
    artistName: "",
    trackTitle: "",
    trackDuration: "",
    bandMembers: [""],
  });

  const handleInputChange = (event) => {
    setAlbumData({ ...albumData, [event.target.name]: event.target.value });
  };

  const handleBandMemberChange = (event, index) => {
    const updatedBandMembers = [...albumData.bandMembers];
    updatedBandMembers[index] = event.target.value;
    setAlbumData({ ...albumData, bandMembers: updatedBandMembers });
  };

  const addBandMemberField = () => {
    setAlbumData({ ...albumData, bandMembers: [...albumData.bandMembers, ""] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newAlbum = {
      albumTitle: albumData.albumTitle,
      releaseYear: albumData.releaseYear,
      artistName: albumData.artistName,
      tracks: [
        {
          trackTitle: albumData.trackTitle,
          trackDuration: albumData.trackDuration,
        },
      ],
      bandMembers: albumData.bandMembers.map((memberName) => ({ memberName })),
    };
    onAlbumSubmit(newAlbum);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Col} controlId="formAlbumTitle">
          <Form.Label>Album Title:</Form.Label>
          <Form.Control
            type="text"
            name="albumTitle"
            value={albumData.albumTitle}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>

        <Form.Group as={Col} controlId="formReleaseYear">
          <Form.Label>Release Year:</Form.Label>
          <Form.Control
            type="number"
            name="ReleaseYear"
            value={albumData.releaseYear}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>

        <Form.Group as={Col} controlId="formArtistName">
          <Form.Label>Artist Name:</Form.Label>
          <Form.Control
            type="text"
            name="ArtistName"
            value={albumData.artistName}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>

        <Form.Group as={Col} controlId="formTrackTitle">
          <Form.Label>Track Title:</Form.Label>
          <Form.Control
            type="text"
            name="TrackTitle"
            value={albumData.trackTitle}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>

        <Form.Group as={Col} controlId="formTrackDuration">
          <Form.Label>Track Duration:</Form.Label>
          <Form.Control
            type="number"
            name="TrackDuration"
            value={albumData.trackDuration}
            onChange={handleInputChange}
            required
          ></Form.Control>
          <Form.Text></Form.Text>
        </Form.Group>

        <Form.Group as={Col} controlId="formBandMembers">
          <Form.Label>Band Members:</Form.Label>
          {albumData.bandMembers.map((member, index) => (
            <Form.Control
            key={index}
            type="text"
            value={member}
            onChange={(event)=> handleBandMemberChange(event, index)}
            
          ></Form.Control>
          ))}
          
          <Button variant="secondary" type="button" onClick={addBandMemberField}>Add Band Member</Button>
        </Form.Group>
        <Button variant="primary" type="submit">Add Album</Button>
      </Form>
    </>
  );
};

export default AddAlbums;
