import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Figure,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Post.scss";
import DeleteModal from "../DeleteModal/DeleteModal.jsx";
import { useProvideAuth } from "../../hooks/useAuth";
import api from "../../util/api.jsx";
import { timeSince } from "../../util/timeSince";
import useToggle from "../../hooks/useToggle";

const Post = ({
  post: { _id, author, text, comments, created, likes, image },
  onPostUpdate,
}) => {
  const [showDelete, toggleShowDelete] = useToggle();
  const [isDeleted, toggleIsDeleted] = useToggle();
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(text);

  let navigate = useNavigate();
  const {
    state: { user },
  } = useProvideAuth();

  const [likedState, setLiked] = useState(likes.includes(user.uid));
  const [likesState, setLikes] = useState(likes.length);
  console.log("Image URL:", image);
  const defaultImage = "/images/default-post.jpg";
  // const toggleEditMode = () => {
  //   setEditMode(!editMode);
  // };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/posts/${_id}`, { text: editedText });
      onPostUpdate(_id, response.data.text);
      toast.success("Post updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update post");
    }
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditedText(text);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditedText(text);
    }
  };

  const handleToggleLike = async () => {
    if (!likedState) {
      setLiked(true);
      setLikes(likesState + 1);
      try {
        await api.post(`/posts/like/${_id}`);
      } catch (error) {
        console.log(error);
        return error;
      }
    } else {
      setLiked(false);
      setLikes(likesState - 1);
      try {
        await api.post(`/posts/like/${_id}`);
      } catch (error) {
        console.log(error);
        return error;
      }
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${_id}`);

      toggleShowDelete();
      toggleIsDeleted();
    } catch (error) {
      toast.error(`An error occurred deleting post ${_id}.`);
      toggleShowDelete();
    }
  };

  //console.log(likes)

  // const tooltip = (
  //   <Tooltip id="tooltip">
  //     {likes.map((like) => like.username).join(", ")}
  //   </Tooltip>
  // );

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
                  style={{ lineHeight: ".75", padding: "0", fontSize: "30px" }}
                >
                  <span className="text-muted">&#8230;</span>
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
          <Row className="d-flex profile ">
            <Col className="d-flex ms-4">
              <Figure as={Link} to={`/u/${author.username}`}>
                <Figure.Image
                  src={author.profile_image}
                  className={`img-fluid mb-3 ${
                    window.innerWidth < 768 ? "half-size" : ""
                  }`}
                  style={{ maxWidth: "100%", height: "auto", margin: "auto" }}
                />
              </Figure>
            </Col>
            <Col md={10} className="mt-2 profile_info mx-auto mx-md-0">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <div>
                  <Link
                    to={`/u/${author.username}`}
                    style={{ textDecoration: "none" }}
                  >
                    {author.username}
                  </Link>
                  &nbsp; - &nbsp;
                </div>
                <span>{` ${timeSince(created)} ago`}</span>
              </div>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip">
                      {likes.map((like) => like.username).join(", ")}
                    </Tooltip>
                  }
                >
                  <span>
                    {likesState === 1 ? "1 like" : `${likesState} likes`}
                  </span>
                </OverlayTrigger>
                <Button
                  style={{ textDecoration: "none" }}
                  variant="link"
                  size="md"
                  onClick={() => navigate(`/p/${_id}`)}
                >
                  {comments.length === 1
                    ? "1 comment"
                    : `${comments.length} comments`}
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="mt-5 text-center">
            {image && image !== defaultImage && (
              <img
                className="img-fluid mb-3"
                src={image}
                alt="Post"
                style={{ maxWidth: "300px", maxheight: "auto", margin: "auto" }}
              />
            )}
            {editMode ? (
              <div>
                <textarea
                  className="p-2"
                  value={editedText}
                  onChange={handleTextChange}
                />
                <div>
                  <Button
                    size="sm"
                    variant="secondary-outline"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
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
              <Button
                className="m-2"
                variant="info"
                style={{ border: "none", color: "white" }}
                size="sm"
                onClick={() => navigate(`/p/${_id}`)}
              >
                {" "}
                Comment
              </Button>

              <Button
                className="m-2"
                variant="info"
                style={{ border: "none", color: "white" }}
                size="sm"
                onClick={handleToggleLike}
              >
                Like
              </Button>
            </div>
          </Row>
        </Card>
      </ListGroup.Item>

      <DeleteModal
        show={showDelete}
        handleClose={toggleShowDelete}
        handleDelete={handleDeletePost}
      />
    </>
  );
};

export default Post;
