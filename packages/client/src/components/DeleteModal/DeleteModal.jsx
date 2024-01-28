import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, handleClose, handleDelete }) => {
  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you wish to delete this post?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-info" onClick={handleClose}>
          Cancel
        </Button>
        <Button style={{backgroundColor: "#ff52ce", border: "none"}} onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
