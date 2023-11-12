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
      <div>
        {displayedAlbums &&
          displayedAlbums.map((album) => (
            <Card
            className="mx-auto"
              key={album.albumId}
              style={{ margin: "20px", padding: "20px", width: "70%" }}
            >
              <Card.Header style={{ width: "40%", lineHeight:"2", fontSize:"30px", margin:"15px"}} className="mx-auto">
                {album.albumTitle}
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <Col xs={6} className="align-self-center">
                    <div style={{ width: "50%", marginLeft:"100px" }}>
                      <Card.Title style={{fontSize:"27px"}}>
                        {album.artistName}{" "}
                        </Card.Title>
                        <Card.Subtitle style={{fontSize:"20px"}}>
                        {album.bandMembers.length > 1 ? (
                          <>(
                        
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
                      </Card.Subtitle>
                      <Card.Subtitle className="mt-4">
                        Album Duration: {albumDuration(album)}
                      </Card.Subtitle>
                    </div>
                  </Col>

                  <Col xs={6}>
                    <ListGroup>
                      {album.tracks.map((track, index) => (
                        <ListGroup.Item
                          key={index}
                          style={{ lineHeight: "0.1", padding:"18px" }}
                        >
                          <span className="d-flex justify-content-start">
                            {track.trackNumber}. {track.trackTitle}
                          </span>
                          <span className="d-flex justify-content-end">
                            {durationConversion(track.trackDuration)}
                          </span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                  <div className="mx-auto mt-3">
                    <Button
                      style={{ marginTop: "15px" }}
                      onClick={() => handleRemoveAlbum(album.albumId)}
                    >
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
