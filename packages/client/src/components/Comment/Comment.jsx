import React, { useState } from "react"; // Import React and useState for managing component state
import {
  Figure,
  Row,
  Col,
  Button,
  Card,
  Dropdown,
  DropdownMenu,
} from "react-bootstrap"; // Import Bootstrap components for layout and styling
import { timeSince } from "../../util/timeSince"; // Import utility function for calculating time since the comment was created
import { Link } from "react-router-dom"; // Import Link for navigation to other user profiles
import api from "../../util/api"; // Import API utility for making server requests
import { toast } from "react-toastify"; // Import toast for user notifications
import { useProvideAuth } from "../../hooks/useAuth"; // Import authentication hook for current user data
import DeleteModal from "../DeleteModal/DeleteModal"; // Import DeleteModal component for comment deletion confirmation
import useToggle from "../../hooks/useToggle"; // Import custom hook for toggling boolean states

// Comment component to render an individual comment, allowing editing, deletion, and interaction
const Comment = ({ comment, onUpdateComment, onCommentDeleted }) => {
  const { author } = comment; // Destructure author from the comment object
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode for the comment
  const [editedText, setEditedText] = useState(comment.text); // State to track edited comment text
  const [showDelete, toggleShowDelete] = useToggle(); // State to control the visibility of the delete modal
  const [isDeleted, toggleIsDeleted] = useToggle(); // State to indicate whether the comment has been deleted

  const {
    state: { user },
  } = useProvideAuth(); // Get the current authenticated user from the auth hook

  const handleCommentTextChange = (e) => {
    setEditedText(e.target.value);
  };

  // Toggle between edit and view mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Save the updated comment to the server
  const saveComment = async () => {
    try {
      const response = await api.put(`/posts/comments/${comment._id}`, {
        text: editedText,
      });
      onUpdateComment(comment._id, response.data.text); // Update comment in the parent component
      toast.success("Comment updated successfully"); // Notify the user of success
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment"); // Notify the user of an error
    }
    toggleEditMode(); // Exit edit mode after saving
  };

  // Handle deletion of the comment
  const handleDeleteComment = async () => {
    try {
      await api.delete(`/posts/comments/${comment._id}`); // Delete the comment from the server
      onCommentDeleted(comment._id); // Notify the parent component about the deletion
      toggleShowDelete(); // Close the delete modal
      toggleIsDeleted(); // Mark the comment as deleted in the UI
    } catch (error) {
      toast.error(`An error occurred deleting post ${comment._id}.`); // Notify the user of an error during deletion
      toggleShowDelete(); // Close the delete modal in case of an error
    }
  };

  return (
    <>
      <Card className="mt-2 pb-3">
        <div className="d-flex justify-content-end align-items-center">
          {user.username === author.username && (
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                bsPrefix="p-0"
                style={{ lineHeight: ".5", padding: "0", fontSize: "30px" }}
              >
                <img
                  alt="menu button"
                  src={`${import.meta.env.BASE_URL}vinyl-village/menu.png`}
                  style={{ maxHeight: "30px", marginRight: "15px" }}
                ></img>
              </Dropdown.Toggle>
              <DropdownMenu>
                <Dropdown.Item onClick={toggleShowDelete}>Delete</Dropdown.Item>
                <Dropdown.Item onClick={toggleEditMode}>Edit</Dropdown.Item>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <Row className="my-3 px-3 py-2" style={{ flexWrap: "nowrap" }}>
          <Col
            as={Link}
            to={`/u/${author.username}`}
            xs={3}
            className="d-flex align-items-center flex-row mr-4 bg-border-color rounded-circle ml-2 p-1"
            style={{
              height: "65px",
              minHeight: "65px",
              widtidth: "65px",
              marginTop: "0px",
            }}
          >
            <Figure.Image
              alt={`Profile image of ${author.username}`}
              src={author.profile_image}
              className="avatar w-100 h-100 mr-4"
            />
          </Col>
          <Col xs={9} className="d-flex align-items-center flex-row">
            <div className="mb-2 comment-author">
              <Link
                to={`/u/${author.username}`}
                className="comment-author-link"
                style={{ textDecoration: "none", color: "black" }}
              >
                <span style={{ textDecoration: "none" }}>
                  {comment.author?.username}
                </span>
              </Link>
              &nbsp; - &nbsp;
              <span className="text-muted ">
                {timeSince(comment.created)} ago
              </span>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="text-center">
            {editMode ? (
              <>
                <textarea
                  className="p-2"
                  value={editedText}
                  onChange={handleCommentTextChange}
                />{" "}
                <br></br>
                <Button
                  size="sm"
                  variant="orange"
                  style={{ color: "white" }}
                  className="m-2"
                  onClick={saveComment}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline-orange"
                  onClick={toggleEditMode}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <p className="comment-text">{comment.text}</p>
              </>
            )}
          </div>

          <DeleteModal
            show={showDelete}
            handleClose={toggleShowDelete}
            handleDelete={handleDeleteComment}
            deleteType={"comment"}
          />
        </Row>
      </Card>
    </>
  );
};

export default Comment;
