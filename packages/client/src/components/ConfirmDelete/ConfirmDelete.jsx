import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDelete = ({
  showConfirmModal,
  handleCloseConfirmModal,
  handleConfirmDelete,
  albumTitle,
}) => {
  return (
    <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {albumTitle || "this album"}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseConfirmModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDelete;
