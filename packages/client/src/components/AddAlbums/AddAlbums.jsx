import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";

export const AddAlbums = ({ onAlbumSubmit }) => {
  const [albumData, setAlbumData] = useState({
    albumTitle: "",
    releaseYear: "",
    artistName: "",
    tracks: [{ trackTitle: "", trackDuration: "" }],
    bandMembers: [""],
  });

  const handleInputChange = (event) => {
    setAlbumData({ ...albumData, [event.target.name]: event.target.value });
  };

  const handleTrackChange = (event, index, field) => {
    const updatedTracks = [...albumData.tracks];
    updatedTracks[index] = {
      ...updatedTracks[index],
      [field]: event.target.value,
    };
    setAlbumData({ ...albumData, tracks: updatedTracks });
  };

  const addTrackField = () => {
    setAlbumData({
      ...albumData,
      tracks: [...albumData.tracks, { trackTitle: "", trackDuration: "" }],
    });
  };

  const removeTrackField = (index) => {
    const updatedTracks = [...albumData.tracks];
    updatedTracks.splice(index, 1);
    setAlbumData({ ...albumData, tracks: updatedTracks });
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
      ...albumData,
      tracks: albumData.tracks,
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

        {albumData.tracks.map((track, index) => (
          <div key={index}>
            <Form.Group as={Col} controlId={`formTrackTitle-${index}`}>
              <Form.Label>Track Title:</Form.Label>
              <Form.Control
                type="text"
                value={track.trackTitle}
                onChange={(event) =>
                  handleTrackChange(event, index, "trackTitle")
                }
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId={`formTrackDuration-${index}`}>
              <Form.Label>Track Duration:</Form.Label>
              <Form.Control
                type="number"
                value={track.trackDuration}
                onChange={(event) =>
                  handleTrackChange(event, index, "trackDuration")
                }
                required
              />
            </Form.Group>

            {index > 0 && (
              <Button
                variant="danger"
                type="button"
                onClick={() => removeTrackField(index)}
              >
                Remove Track
              </Button>
            )}
          </div>
        ))}

        <Button variant="secondary" type="button" onClick={addTrackField}>
          Add Track
        </Button>

        <Form.Group as={Col} controlId="formBandMembers">
          <Form.Label>Band Members:</Form.Label>
          {albumData.bandMembers.map((member, index) => (
            <Form.Control
              key={index}
              type="text"
              value={member}
              onChange={(event) => handleBandMemberChange(event, index)}
            ></Form.Control>
          ))}

          <Button
            variant="secondary"
            type="button"
            onClick={addBandMemberField}
          >
            Add Band Member
          </Button>
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Album
        </Button>
      </Form>
    </>
  );
};

export default AddAlbums;
