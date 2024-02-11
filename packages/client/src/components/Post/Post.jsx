import React, { useState } from "react";
import {
  Container,
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
import TrashIcon from "../icons/TrashIcon.jsx";
import LikeIcon from "../icons/LikeIcon.jsx";
import ReplyIcon from "../icons/ReplyIcon.jsx";
import LikeIconFill from "../icons/LikeIconFill.jsx";
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
    setEditedText(text); // Reset text to original if cancelled
    setEditMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditedText(text); // Reset to original text when entering edit mode
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
        <Card className=" py-2 px-3 d-flex flex-row gap-3 align-items-start78 mt-2">
          <Figure
            as={Link}
            to={`/u/${author.username}`}
            className="mr-4 bg-border-color rounded-circle ml-2 p-1"
            style={{
              height: "70px",
              minHeight: "70px",
              width: "70px",
              minWidth: "70px",
              marginTop: "0px",
            }}
          >
            <Figure.Image
              src={author.profile_image}
              className="avatar w-100 h-100 mr-4"
            />
          </Figure>
          <div className="w-100">
            <div className="d-flex align-items-center">
              <Link
                to={`/u/${author.username}`}
                className="text-muted mr-1 username"
                variant="secondary"
              >
                {author.username}
              </Link>
              <pre className="m-0 text-muted">{" - "}</pre>
              <span className="text-muted">{timeSince(created)} ago</span>
              <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip">
                      {likes.map((like) => like.username).join(", ")}
                    </Tooltip>
                  }
                >
                  <div> likes: {likesState}</div> 
                </OverlayTrigger> <Button
                  variant="link"
                  size="md"
                  onClick={() => navigate(`/p/${_id}`)}
                > Comments:
                  
                </Button>
                <div> {comments.length > 0 ? comments.length : 0}</div>
            </div>
            <div className="mb-n1 mt-1 position-relative">
              <div className="mb-n1 mt-1 position-relative">
                {editMode ? (
                  <div>
                    <textarea
                      className="p-2"
                      value={editedText}
                      onChange={handleTextChange}
                    />
                    <div>
                      <Button variant="success" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <blockquote className="mb-1 mw-100">
                    <div className="mw-100 overflow-hidden mt-2">{text}</div>
                  </blockquote>
                )}
                {image && image !== defaultImage && (
                  <img
                    src={image}
                    alt="Post"
                    style={{ maxWidth: "300px", maxheight: "auto" }}
                  />
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-to">
              {user.username === author.username && (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    bsPrefix="p-0"
                  >
                    <span className="text-muted" style={{ fontSize: "30px" }}>
                      &#8230;
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={toggleEditMode}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={toggleShowDelete}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}

              <div className="d-flex align-items-center mr-2">
                <Button
                  variant="link"
                  size="md"
                  onClick={() => navigate(`/p/${_id}`)}
                > Comment
                  
                </Button>
                
              </div>
              <div
                className={`d-flex align-items-center mr-3 ${
                  likedState ? "isLiked" : ""
                }`}
              >
                <Button variant="link" size="md" onClick={handleToggleLike}>
                  Like
                </Button>
                
                
              </div>
            </div>
          </div>
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
