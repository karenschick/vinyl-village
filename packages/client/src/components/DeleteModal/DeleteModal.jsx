// Import React and necessary components from React Bootstrap
import React from "react";
import { Modal, Button } from "react-bootstrap";

// DeleteModal Component: A modal to confirm the deletion of a post
const DeleteModal = ({
  show, // Boolean to control the visibility of the modal
  handleClose, // Function to handle closing the modal
  handleDelete, // Function to handle the delete action
  albumTitle, // Title of the album to display in the confirmation message
  deleteType, // Type of item to delete (e.g., "post", "comment", or "album")
}) => {
  // Genererate a dynamic message based on the delete type
  const getDeleteMessage = () => {
    switch (deleteType) {
      case "post":
        return "Are you sure you wish to delete this post?";
      case "comment":
        return "Are you sure you wish to delete this comment?";
      case "album":
        return `Are you sure you wish to delete ${albumTitle || ""}?`;
    }
  };

  return (
    // Modal component, visible when 'show' is true
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getDeleteMessage()}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-warning" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="warning"
          style={{ color: "white" }}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Export the DeleteModal component for use in other parts of the application
export default DeleteModal;
