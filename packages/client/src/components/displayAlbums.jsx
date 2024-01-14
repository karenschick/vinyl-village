import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  ListGroup,
  Col,
  Badge,
  Modal,
  Container,
  Row,
} from "react-bootstrap";
import { useApiFetch } from "../util/api";
import AddAlbums from "./AddAlbums/AddAlbums";
import axios from "axios";
import { API_URL } from "../util/constants";
import ConfirmDelete from "./ConfirmDelete/ConfirmDelete";

export const DisplayAlbums = () => {
  const { response } = useApiFetch("/albums");
  console.log("response:", response);

  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const [sortAlbum, setSortAlbum] = useState("albumTitle");
  const [showModal, setShowModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState({ id: null, title: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    if (albumToDelete && albumToDelete.id) {
      await handleRemoveAlbum(albumToDelete.id);
      setAlbumToDelete({ id: null, title: "" });
    }
  };

  const handleShowConfirmModal = (albumId, albumTitle) => {
    setAlbumToDelete({ id: albumId, title: albumTitle });
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setAlbumToDelete({ id: null, title: "" });
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleAddAlbum = (newAlbum) => {
    setDisplayedAlbums([...displayedAlbums, newAlbum]);
  };

  const handleRemoveAlbum = async (id) => {
    try {
      await axios.delete(`${API_URL}/albums/${id}`);
      const updatedAlbum = displayedAlbums.filter((album) => album._id !== id);
      setDisplayedAlbums(updatedAlbum);
    } catch (error) {
      console.error(`An error occurred deleting album ${id}.`);
    }
  };

  const durationConversion = (duration) => {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
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
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/albums?sortBy=${sortAlbum}`
        );
        setDisplayedAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [sortAlbum]);

  return (
    <>
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Album</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAlbums onAlbumSubmit={handleAddAlbum} toggleModal={toggleModal} />
        </Modal.Body>
      </Modal>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4} className="text-center">
            <Card className="mb-3">
              <Card.Body>
                <h3>Add Album to Collection</h3>
                <Button variant="primary" onClick={toggleModal}>
                  Add
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mt-5">
          <h2>Sort Albums</h2>
          <select onChange={(e) => setSortAlbum(e.target.value)}>
            <option value="albumTitle">Title</option>
            <option value="releaseYear">Year</option>
            <option value="artistName">Artist</option>
          </select>

          <ConfirmDelete
            showConfirmModal={showConfirmModal}
            handleCloseConfirmModal={handleCloseConfirmModal}
            handleConfirmDelete={handleConfirmDelete}
            albumTitle={albumToDelete.title || "this album"}
          />

          {displayedAlbums &&
            displayedAlbums.map((album) => (
              <Card
                className="mx-auto bg-dark mt-5"
                key={album._id}
                style={{ margin: "5px", padding: "15px", width: "80%" }}
              >
                <Card.Body>
                  <div className="row">
                    <Col
                      lg={6}
                      xs={12}
                      style={{
                        color: "white",
                        alignSelf: "center",
                        padding: "20px",
                      }}
                    >
                      <Card.Title style={{ fontSize: "27px" }}>
                        {album.albumTitle}
                      </Card.Title>
                      <Card.Subtitle className="mt-4">
                        {album.releaseYear}
                      </Card.Subtitle>
                      <Card.Body className="mt-1">
                        {album.artistName} <br></br>
                        {album.bandMembers.length > 1 ? (
                          <>
                            <div className="mt-3 band-members">
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
                        <div className="mb-4">
                          Album Duration: {albumDuration(album)}
                        </div>
                      </Card.Body>
                    </Col>

                    <Col lg={6} xs={12}>
                      <ListGroup>
                        {album.tracks.map((track, index) => (
                          <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                            key={`${album._id}-track-${index}`}
                          >
                            <div
                              className="ms-2 me-auto align-start"
                              style={{ textAlign: "start" }}
                            >
                              {track.trackNumber}. {track.trackTitle}
                            </div>
                            <Badge style={{ marginLeft: "5px" }}>
                              {durationConversion(track.trackDuration)}
                            </Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                    <div className="mx-auto mt-3">
                      <Button
                        variant="secondary"
                        style={{ marginTop: "15px" }}
                        onClick={() =>
                          handleShowConfirmModal(album._id, album.albumTitle)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      </Container>
    </>
  );
};

export default DisplayAlbums;
