import React, { useEffect } from "react";
import { Card, Button, ListGroup, Col } from "react-bootstrap";
import { useApiFetch } from "../util/api";

import { useState } from "react";

export const DisplayAlbums = () => {
  const { response } = useApiFetch("/albums");
  console.log(response);

  const [displayedAlbums, setDisplayedAlbums] = useState([]);

  const handleRemoveAlbum = (_id) => {
    const updatedAlbums =
      displayedAlbums &&
      displayedAlbums.filter((album) => album._id !== _id);
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
              className="mx-auto bg-dark mt-4"
              key={album._id}
              style={{ margin: "20px", padding: "30px", width: "70%" }}
            >
              <Card.Body>
                <div className="row">
                  <Col xs={6} style={{ color: "white" }}>
                    <Card.Title style={{ fontSize: "27px" }}>
                      {album.albumTitle}
                    </Card.Title>
                    <Card.Subtitle className="mt-4">
                      {album.releaseYear}
                    </Card.Subtitle>
                    <Card.Body className="mt-3">
                      {album.artistName} <br></br>
                      {album.bandMembers.length > 1 ? (
                        <>
                          <div className="mt-2 ">
                            (
                            {album.bandMembers.map((member, index) => (
                              <span key={index}>
                                {member.memberName}
                                {index !== album.bandMembers.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                            )
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      <br></br>
                      <div className="">
                        Album Length: {albumDuration(album)}
                      </div>
                    </Card.Body>
                  </Col>

                  <Col xs={6}>
                    <ListGroup>
                      {album.tracks.map((track, index) => (
                        <ListGroup.Item
                          key={index}
                          style={{ lineHeight: "0.1", padding: "15px" }}
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
                      variant="secondary"
                      style={{ marginTop: "15px" }}
                      onClick={() => handleRemoveAlbum(album._id)}
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
