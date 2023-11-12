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
    <div >
      {displayedAlbums &&
        displayedAlbums.map((album) => (
          <Card key={album.albumId} style={{ margin: "20px", padding: "20px", width: "70%",  }}>
            <Card.Header style={{width: "30%"}}>{album.albumTitle}</Card.Header>
            <Card.Body>
              <div className="row">
                {/* Left side content */}
                <Col xs={6} className="mt-5">
                  <Card.Title>
                    {album.artistName}{" "}
                    {album.bandMembers.length > 1 ? (
                      <><br />
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
                </Col>
  
                {/* Right side content */}
                <Col xs={6}>
                  <ListGroup style={{ width: "500px" }}>
                    {album.tracks.map((track, index) => (
                      <ListGroup.Item key={index} style={{ lineHeight: "1" }}>
                        <span className="d-flex justify-content-start">{track.trackNumber}. {track.trackTitle}</span>
                        <span className="d-flex justify-content-end">{durationConversion(track.trackDuration)}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                </Col>
                <div className="mx-auto">
                  <Button style={{ marginTop: "15px" }} onClick={() => handleRemoveAlbum(album.albumId)}>
                    Remove
                  </Button>
                  </div>
              </div>
            </Card.Body>
          </Card>
        ))}
        </div>
    </>
  );
 };

export default DisplayAlbums;
