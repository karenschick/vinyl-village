// Import necessary modules from React and other libraries
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
import { useApiFetch } from "../../util/api"; // Custom hook for API fetch
import AddAlbums from "../AddAlbums/AddAlbums"; // Component to add new albums
import axios from "axios"; // Axios for making HTTP requests
import { API_URL } from "../../util/constants"; // API URL constant
//import TrashIcon from "../icons/TrashIcon"; // Custom trash icon component
import api from "../../util/api"; // Custom API instance
import { useProvideAuth } from "../../hooks/useAuth"; // Authentication context hook
import { useRequireAuth } from "../../hooks/useRequireAuth"; // Hook to ensure user authentication
import { useNavigate, useParams } from "react-router-dom"; // Hooks for navigation and URL parameters
import DeleteModal from "../DeleteModal/DeleteModal"; // Component for confirmation modal on deletion

// Main component for displaying albums
const DisplayAlbums = ({ username, onAlbumsChange }) => {
  // State management
  const { response } = useApiFetch("/albums"); // Fetch albums from API
  const [displayedAlbums, setDisplayedAlbums] = useState([]); // Holds the albums to be displayed
  const [sortAlbum, setSortAlbum] = useState("albumTitle"); // State to manage sorting criteria
  const [showModal, setShowModal] = useState(false); // Controls visibility of add album modal
  const [albumToDelete, setAlbumToDelete] = useState({ id: null, title: "" }); // Album selected for deletion
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Controls visibility of delete confirmation modal

  const { state } = useProvideAuth(); // Provides authentication state
  let params = useParams(); // Retrieves URL parameters
  const {
    state: { isAuthenticated },
  } = useRequireAuth(); // Ensures the user is authenticated

  // Handles deletion of album after confirmation
  const handleDeleteModal = async () => {
    setShowConfirmModal(false); // Close confirmation modal
    if (albumToDelete && albumToDelete.id) {
      // If album is selected, delete it
      await handleRemoveAlbum(albumToDelete.id); // Calls the remove function
      setAlbumToDelete({ id: null, title: "" }); // Resets selected album
    }
  };

  // Opens the confirmation modal and sets album for deletion
  const handleShowConfirmModal = (albumId, albumTitle) => {
    setAlbumToDelete({ id: albumId, title: albumTitle });
    setShowConfirmModal(true);
  };

  // Closes the confirmation modal
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setAlbumToDelete({ id: null, title: "" });
  };

  // Toggles the add album modal visibility
  const toggleModal = () => setShowModal(!showModal);

  //Adds a new album to the displayed list
  const handleAddAlbum = (newAlbum) => {
    setDisplayedAlbums([...displayedAlbums, newAlbum]);
  };

  // Removes an album from the list after deletion
  const handleRemoveAlbum = async (id) => {
    try {
      await api.delete(`${API_URL}/albums/${id}`); // API call to delete the album
      const updatedAlbum = displayedAlbums.filter((album) => album._id !== id); // Filters out the deleted album
      setDisplayedAlbums(updatedAlbum); // Updates the album list
    } catch (error) {
      console.error(`An error occurred deleting album ${id}.`); // Logs error if deletion fails
    }
  };

  // Converts track duration from seconds to MM:SS format
  const durationConversion = (duration) => {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const timeFormat = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
    return timeFormat;
  };

  // Calculates total album duration by summing up the durations of its tracks
  const albumDuration = (album) => {
    const totalDuration = album.tracks.reduce((total, track) => {
      return total + parseInt(track.trackDuration, 10);
    }, 0);
    return durationConversion(totalDuration); // Converts the total duration to MM:SS format
  };

  // Handles sorting by different album attributes (title, year, artist)
  const handleSort = (sortBy) => {
    setSortAlbum(sortBy); // Updates the sorting state
  };

  // Formats the date into a readable string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options); // Converts date string to a formatted date
  };

  // Effect to update parent component when the number of albums changes
  useEffect(() => {
    onAlbumsChange(displayedAlbums.length); // Calls the onAlbumsChange callback prop
  }, [displayedAlbums]);

  // Fetches albums when sorting changes or the username is updated
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get(
          `${API_URL}/albums?sortBy=${sortAlbum}&username=${username}`
        );
        setDisplayedAlbums(response.data); // Sets the fetched albums in state
      } catch (error) {
        console.error("Error fetching albums:", error); // Logs error if fetching fails
      }
    };

    fetchAlbums(); // Calls the fetchAlbums function
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
            variant="outline-orange"
            onClick={() => handleSort("albumTitle")}
          >
            Title
          </Button>
          <Button
            className="m-2"
            variant="outline-orange"
            onClick={() => handleSort("releaseYear")}
          >
            Year
          </Button>
          <Button
            className="m-2"
            variant="outline-orange"
            onClick={() => handleSort("artistName")}
          >
            Artist
          </Button>

          {state.user.username === params.uname && (
            <Button
              className="m-2"
              variant="orange"
              style={{ color: "white" }}
              // style={{ color: "white", backgroundColor: "#bdfa7b", border: "#bdfa7b", }}
              onClick={toggleModal}
            >
              Add Album
            </Button>
          )}
        </div>
        <DeleteModal
          show={showConfirmModal}
          handleClose={handleCloseConfirmModal}
          handleDelete={handleDeleteModal}
          albumTitle={albumToDelete.title || "this album"}
          deleteType={"album"}
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
                      <div className="mt-3">{album.condition} Condition</div>
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
                      <img
                        src="/trash2.png"
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
