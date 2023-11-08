import React from "react";
import { Card, Button, ListGroup, CardTitle } from "react-bootstrap";
import { useApiFetch } from "../util/api";

export const DisplayAlbums = () => {
  const { response } = useApiFetch("/albums");
  console.log(response);

  // const handleRemoveAlbum = (albums, albumId) => {
  //   return albums.filter((album) => album.albumId !== albumId);
  // };

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
      return total + parseInt(track.trackDuration, 10);
    }, 0);
    return durationConversion(totalDuration);
  };

  // {albumDuration(album)}

  return (
    <Card>
      {response &&
        response.map((album) => (
          <div key={album.albumId}>
            <Card.Header>{album.albumTitle}</Card.Header>
            <Card.Title>
              {album.artistName} (
              {album.bandMembers.map((member, index) => (
                <span key={index}>
                  {member.memberName}
                  {index !== album.bandMembers.length - 1 ? ", " : ""}
                </span>
              ))}
              ){" "}
            </Card.Title>
            <Card.Subtitle>
              Album Duration: {albumDuration(album)}
            </Card.Subtitle>
            <ListGroup>
              {album.tracks.map((track, index) => (
                <ListGroup.Item key={index}>
                  {track.trackNumber}. {track.trackTitle} -{" "}
                  {durationConversion(track.trackDuration)}
                </ListGroup.Item>
              ))}
            </ListGroup>
            {/* <Button onClick={handleRemoveAlbum(album.album, album.albumId)}>
              remove
            </Button> */}
          </div>
        ))}
    </Card>
  );
};

export default DisplayAlbums;
