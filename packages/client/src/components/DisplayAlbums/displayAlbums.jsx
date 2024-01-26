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
import { useApiFetch } from "../../util/api";
import AddAlbums from "../AddAlbums/AddAlbums";
import axios from "axios";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";
import { API_URL } from "../../util/constants";

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

  const handleSort = (sortBy) => {
    setSortAlbum(sortBy);
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
      <Container className="mt-5 ">
        
          <div className="sort-tabs text-center">
            <Button
              className="m-2"
              variant="outline-info"
              onClick={() => handleSort("albumTitle")}
            >
              Title
            </Button>
            <Button
              className="m-2"
              variant="outline-info"
              onClick={() => handleSort("releaseYear")}
            >
              Year
            </Button>
            <Button
              className="m-2"
              variant="outline-info"
              onClick={() => handleSort("artistName")}
            >
              Artist
            </Button>
            <Button
            
              className="m-2"
              variant="info"
              style={{ color: "white" }}
              // style={{ color: "white", backgroundColor: "#bdfa7b", border: "#bdfa7b", }}
              onClick={toggleModal}
            >
              Add Album
            </Button>
          </div>
          <ConfirmDelete
            showConfirmModal={showConfirmModal}
            handleCloseConfirmModal={handleCloseConfirmModal}
            handleConfirmDelete={handleConfirmDelete}
            albumTitle={albumToDelete.title || "this album"}
          />

          {displayedAlbums &&
            displayedAlbums.map((album) => (
              <Card bg="dark"
                className="mx-auto mt-5"
                key={album._id}
                style={{
                  // backgroundColor: "#bdfa7b",
                  margin: "5px",
                  padding: "15px",
                  width: "80%",
                }}
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
                            <Badge
                            bg="info"
                              style={{
                                // backgroundColor: "#37dbff",
                                border: "none",
                                color: "white",
                                marginLeft: "5px",
                              }}
                            >
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
                        Remove Album
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
        
      </Container>
    </>
  );
};

export default DisplayAlbums;
