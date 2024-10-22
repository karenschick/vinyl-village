// Importing React and useState hook for managing component state
import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  Figure,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap"; // Importing components from React Bootstrap for UI layout and styling
import { useNavigate, Link } from "react-router-dom"; // Importing navigation and linking functionality for routing
import { toast } from "react-toastify"; // Importing toast notifications for feedback to users
import "./Post.scss"; // Importing custom SCSS for Post component styles
import DeleteModal from "../DeleteModal/DeleteModal.jsx"; // Importing a modal component for confirming post deletion
import { useProvideAuth } from "../../hooks/useAuth"; // Importing custom hook for authentication management
import api from "../../util/api.jsx"; // Importing API utility for making HTTP requests
import { timeSince } from "../../util/timeSince"; // Importing utility function to display time since post creation
import useToggle from "../../hooks/useToggle"; // Importing a custom hook to manage toggling states

// Post component that displays a single post and handles editing, deleting, liking, and commenting
const Post = ({
  post: { _id, author, text, comments, created, likes, image }, // Destructuring props to extract post details
  onPostUpdate, // Callback function to update post content after editing
  detailView = true, // Flag to determine if detailed view buttons should be shown
}) => {
  // Getting the current authenticated user using custom auth hook
  const {
    state: { user },
  } = useProvideAuth();
  // State to toggle delete modal visibility
  const [showDelete, toggleShowDelete] = useToggle();
  // State to track if post has been deleted
  const [isDeleted, toggleIsDeleted] = useToggle();
  // State to toggle edit mode for editing post content
  const [editMode, setEditMode] = useState(false);
  // State for handling edited text input
  const [editedText, setEditedText] = useState(text);
  // State for handling the number of likes
  const [likesState, setLikes] = useState(likes.length);
  // State for tracking if the current user has liked the post
  const [likedState, setLiked] = useState(
    likes.some((like) => like._id === user.uid)
  );
  // Fallback image if no image is provided for the post
  const defaultImage = "/images/default-post.jpg";
  // Hook to programmatically navigate to different routes
  let navigate = useNavigate();

  // Handles changes in the edit text area
  const handleTextChange = (e) => {
    setEditedText(e.target.value); // Updates the edited text as the user types
  };

  // Handles saving the edited post content
  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/posts/${_id}`, { text: editedText }); // API request to update the post
      onPostUpdate(_id, response.data.text); // Callback to update the post content in the parent component
      toast.success("Post updated successfully"); // Success toast notification
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error("Failed to update post"); // Error toast notification
    }
    setEditMode(false); // Exit edit mode after saving
  };

  // Cancels the editing process and reverts changes
  const handleCancelEdit = () => {
    setEditedText(text); // Revert the text to the original post content
    setEditMode(false); // Exit edit mode
  };

  // Toggles the edit mode state when the "Edit" option is clicked
  const toggleEditMode = () => {
    setEditMode(!editMode); // Toggles between edit and non-edit mode
    if (!editMode) {
      setEditedText(text); // Ensures the text area is populated with the original text when entering edit mode
    }
  };

  // Handles liking or unliking a post
  const handleLikePost = async () => {
    try {
      const response = await api.post(`/posts/like/${_id}`); // API request to like/unlike the post
      setLikes(response.data.likes.length); // Update the number of likes
      setLiked((prevLiked) => !prevLiked); // Toggle the liked state for the current user
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error("Failed to like/unlike the post. Please try again later."); // Error toast notification
    }
  };

  // Handles deleting a post
  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${_id}`); // API request to delete the post
      toggleShowDelete(); // Hide delete modal
      toggleIsDeleted(); // Mark the post as deleted
      toast.success("Post deleted successfully"); // Success toast notification
    } catch (error) {
      toast.error(`An error occurred deleting post ${_id}.`); // Error toast notification
      toggleShowDelete(); // Hide delete modal if an error occurs
    }
  };

  // If the post has been deleted, return an empty fragment (no post content will be shown)
  if (isDeleted) return <></>;

  return (
    <>
      <ListGroup.Item className="text-danger rounded-edge" as={"div"}>
        <Card
          className={`p-2 mb-2 ${
            user.username === author.username ? "pt-1" : "pt-4"
          }`}
        >
          <div className="d-flex justify-content-end align-items-center ">
            {user.username === author.username && (
              <Dropdown>
                <Dropdown.Toggle
                  className="d-flex align-items-center"
                  variant="light"
                  id="dropdown-basic"
                  bsPrefix="p-0"
                  style={{ lineHeight: ".5", padding: "0" }}
                >
                  <img
                    src="/menu.png"
                    alt="Menu Button"
                    style={{ maxHeight: "40px" }}
                  ></img>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={toggleEditMode}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={toggleShowDelete}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          {/* Display author information and post date */}
          <Row className="d-flex profile ">
            <Col className="d-flex ms-4">
              <Figure as={Link} to={`/u/${author.username}`}>
                <Figure.Image
                  src={author.profile_image} // Display author's profile image
                  alt={`Profile Image of ${author.username}`} // Alt text for accessibility
                  className={`img-fluid mb-3 ${
                    window.innerWidth < 768 ? "author-image" : ""
                  }`} // Responsive styling for profile image
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "auto",
                  }}
                />
              </Figure>
            </Col>
            <Col md={10} className="mt-2 mx-auto mx-md-0">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start profile_info">
                <div>
                  <Link
                    to={`/u/${author.username}`} // Link to the author's profile
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {author.username}
                  </Link>
                  &nbsp; - &nbsp;
                </div>
                <span>{` ${timeSince(created)} ago`}</span>{" "}
                {/* Time since post creation */}
              </div>
              {/* Display number of likes and comments */}
              <div className="d-flex align-items-center profile_info justify-content-center justify-content-md-start">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip">
                      {likes.map((like) => like.username).join(", ")}{" "}
                      {/* Tooltip displaying usernames who liked the post */}
                    </Tooltip>
                  }
                >
                  <span>
                    {likesState === 1 ? "1 like" : `${likesState} likes`}{" "}
                    {/* Conditionally displaying "1 like" or the number of likes */}
                  </span>
                </OverlayTrigger>
                <Button
                  style={{
                    textDecoration: "none",
                    border: "none",
                    marginLeft: "3px",
                  }}
                  variant="outline-dark"
                  size="md"
                  onClick={() => navigate(`/p/${_id}`)} // Navigate to post detail view when comments are clicked
                >
                  {comments.length === 1
                    ? "1 comment"
                    : `${comments.length} comments`}{" "}
                  {/* Conditionally displaying "1 comment" or the number of comments */}
                </Button>
              </div>
            </Col>
          </Row>

          {/* Display post image if provided, otherwise fall back to a default image */}
          <Row className="mt-5 text-center">
            {image && image !== defaultImage && (
              <img
                className="img-fluid mb-3"
                src={image}
                alt="Post"
                style={{ maxWidth: "300px", maxheight: "auto", margin: "auto" }}
              />
            )}
            {/* Conditional rendering for edit mode (textarea for editing post) or display post text */}
            {editMode ? (
              <div>
                <textarea
                  className="p-2"
                  value={editedText} // Displaying edited text in the textarea
                  onChange={handleTextChange} // Handling changes in the textarea
                />
                <div>
                  <Button
                    className="m-2"
                    size="sm"
                    variant="orange"
                    style={{ color: "white" }}
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-orange"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <blockquote className="mb-1 mw-100">
                <div className="mw-100 overflow-hidden mt-2">{text}</div>
              </blockquote>
            )}
          </Row>
          <Row className="mt-5">
            <div className="text-center">
              {detailView && (
                <Button
                  className="m-2"
                  variant="orange"
                  style={{ color: "white" }}
                  size="sm"
                  onClick={() => navigate(`/p/${_id}`)} // Navigate to post detail view
                >
                  {" "}
                  Comment
                </Button>
              )}
              {detailView && (
                <Button
                  className="m-2"
                  variant="orange"
                  style={{ color: "white" }}
                  size="sm"
                  onClick={handleLikePost}
                >
                  Like
                </Button>
              )}
            </div>
          </Row>
        </Card>
      </ListGroup.Item>

      {/* Modal for confirming post deletion */}
      <DeleteModal
        show={showDelete}
        handleClose={toggleShowDelete}
        handleDelete={handleDeletePost}
        deleteType={"post"}
      />
    </>
  );
};

export default Post;
