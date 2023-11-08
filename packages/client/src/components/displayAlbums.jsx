import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { useApiFetch } from "../util/api";

export const DisplayAlbums = () => {
  const {response} = useApiFetch("/albums")
  console.log(response)

  const handleRemoveAlbum = () => {};

  const durationConversion = (duration) => {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    //padStart is used to ensure the seconds is always two digits
    const timeFormat = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
    return timeFormat;
  };

  const albumDuration = (album) => {
    const totalDuration = album.tracks.reduce((total, track) => {      
      return total + track.duration;
    }, 0);
    //durationConversion
    return durationConversion(totalDuration);
  };

  // {albumDuration(album)}
  // {durationConversion(track.trackDuration)}

  return (
    <Card border="primary">
        {/* map in card Body */}
      <Card.Body>
        <Card.Header>Album Name</Card.Header>
        <Card.Title className="mb-4">Artist & Bandnames</Card.Title>
        <Card.Subtitle>Album Duration</Card.Subtitle>
        <ListGroup > 
          <ListGroup.Item>
            Track List with duration, title, trackNumber
          </ListGroup.Item>
        </ListGroup>
        <Button onClick={handleRemoveAlbum}>remove</Button>
      </Card.Body>
    </Card>
  );
};

export default DisplayAlbums;
