import React, { useEffect } from "react";
import { Card, Button, ListGroup, CardTitle, Row, Col } from "react-bootstrap";
import { useApiFetch } from "../util/api";

import { useState } from "react";

export const DisplayAlbums = () => {
  const { response } = useApiFetch("/albums");
  console.log(response);

  const [displayedAlbums, setDisplayedAlbums] = useState([]);

  const handleRemoveAlbum = (albumId) => {
    const updatedAlbums =
      displayedAlbums &&
      displayedAlbums.filter((album) => album.albumId !== albumId);
    setDisplayedAlbums(updatedAlbums);
  };

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

  useEffect(() => {
    if (response) {
      setDisplayedAlbums(response);
    }
  }, [response]);

  return (
    <>
       {displayedAlbums &&
         displayedAlbums.map((album) => (
           <Card key={album.albumId} style={{ border: "solid", margin:"15px", padding:"20px" }} >
             <Card.Header style={{ margin:"5px" }}>{album.albumTitle}</Card.Header>
             <Card.Body>
             <Card.Title className="mt-5">
               {album.artistName}{" "}
               {album.bandMembers.length > 1 ? (
                 <>
                   (
                   {album.bandMembers.map((member, index) => (
                     <span key={index}>
                       {member.memberName}
                       {index !== album.bandMembers.length - 1 ? ", " : ""}
                     </span>
                   ))}
                   )
                 </>
               ) : (
                 ""
               )}
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
             <Button style={{ margin:"5px" }}onClick={() => handleRemoveAlbum(album.albumId)}>
               Remove
             </Button>
             </Card.Body>
           </Card>
         ))}
     </>
   );
 };

export default DisplayAlbums;
