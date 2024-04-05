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
import TrashIcon from "../icons/TrashIcon";
import api from "../../util/api";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useNavigate, useParams } from "react-router-dom";

const DisplayAlbums = ({ username, onAlbumsChange }) => {
  const { response } = useApiFetch("/albums");
  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const [sortAlbum, setSortAlbum] = useState("albumTitle");
  const [showModal, setShowModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState({ id: null, title: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { state } = useProvideAuth();
  let params = useParams();
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

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
      await api.delete(`${API_URL}/albums/${id}`);
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

  const capitalizeFirstLetter = (string) => {
    if (!string) return "Unknown";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    onAlbumsChange(displayedAlbums.length);
  }, [displayedAlbums]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get(
          `${API_URL}/albums?sortBy=${sortAlbum}&username=${username}`
        );
        setDisplayedAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [sortAlbum, username]);

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
        <div className="sort-tabs text-center">
          <Button
            className="m-2"
            variant="outline-dark"
            onClick={() => handleSort("albumTitle")}
          >
            Title
          </Button>
          <Button
            className="m-2"
            variant="outline-dark"
            onClick={() => handleSort("releaseYear")}
          >
            Year
          </Button>
          <Button
            className="m-2"
            variant="outline-dark"
            onClick={() => handleSort("artistName")}
          >
            Artist
          </Button>

          {state.user.username === params.uname && (
            <Button
              className="m-2"
              variant="dark"
              style={{ color: "white" }}
              // style={{ color: "white", backgroundColor: "#bdfa7b", border: "#bdfa7b", }}
              onClick={toggleModal}
            >
              Add Album
            </Button>
          )}
        </div>
        <ConfirmDelete
          showConfirmModal={showConfirmModal}
          handleCloseConfirmModal={handleCloseConfirmModal}
          handleConfirmDelete={handleConfirmDelete}
          albumTitle={albumToDelete.title || "this album"}
        />

        {displayedAlbums &&
          displayedAlbums.map((album) => (
            <Card
              bg="dark"
              className="mx-auto mt-5"
              key={album._id}
              style={{
                margin: "5px",
                padding: "15px",
                width: "80%",
                postition: "relative",
                maxWidth: "800px",
                borderColor: "transparent",
              }}
            >
              <Card.Body>
                <div className="row text-center">
                  <Col
                    lg={6}
                    xs={12}
                    style={{
                      color: "white",
                      alignSelf: "center",
                      padding: "20px",
                    }}
                  >
                    <img
                      src={album.image || "/default-image.jpg"}
                      alt={album.albumTitle}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.target.onerror = null; // Prevents recursion
                        e.target.src = "/album8.jpg";
                      }}
                    />

                    <Card.Body>
                      <div className="mt-2" style={{ fontSize: "27px" }}>
                        {album.albumTitle}
                      </div>
                      <div className="" style={{ fontSize: "22px" }}>
                        {album.artistName}
                      </div>

                      {album.bandMembers.length > 1 ? (
                        <>
                          <div className="mb-3 band-members">
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

                      <div className="mt-2">{album.releaseYear}</div>
                      <div className="">{albumDuration(album)} Mins</div>
                      <div className="mt-3">
                        {capitalizeFirstLetter(album.condition)} Condition
                      </div>
                      <div className="">Added {formatDate(album.created)}</div>
                    </Card.Body>
                  </Col>

                  <Col
                    lg={6}
                    xs={12}
                    style={{
                      color: "white",

                      padding: "20px",
                    }}
                  >
                    <ListGroup className="">
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
                            bg="dark"
                            style={{
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
                </div>
                {state.user.username === params.uname && (
                  <div className=" ">
                    <Container className="close">
                      {/* Replace the button with the image */}
                      <img
                        src="/trash2.png" // Path to your image file in the public directory
                        alt="Trash Icon"
                        style={{
                          width: "30px",
                          height: "30px",
                          cursor: "pointer",
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                        }}
                        onClick={() =>
                          handleShowConfirmModal(album._id, album.albumTitle)
                        }
                      />
                    </Container>
                    {/* <TrashIcon
                        style={{position: "absolute", bottom: "30px", right: '40px' }}
                          color="red"
                          onClick={() =>
                            handleShowConfirmModal(album._id, album.albumTitle)
                          }
                        /> */}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
      </Container>
    </>
  );
};

export default DisplayAlbums;
