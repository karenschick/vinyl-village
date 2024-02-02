import React, { useState } from "react";
import {
  Container,
  Button,
  Card,
  Figure,
  ListGroup,
  OverlayTrigger,
  Tooltip,
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
  post: { _id, author, text, comments, created, likes },
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

  // const toggleEditMode = () => {
  //   setEditMode(!editMode);
  // };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const toggleEditMode = async () => {
    if (editMode) {
      try {
        const response = await api.put(`/posts/${_id}`, { text: editedText });
        // Assuming response.data.text is the updated text
        onPostUpdate(_id, response.data.text);
        toast.success("Post updated successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update post");
      }
    }
    setEditMode(!editMode);
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
                @{author.username}
              </Link>
              <pre className="m-0 text-muted">{" - "}</pre>
              <span className="text-muted">{timeSince(created)} ago</span>
            </div>
            <div className="mb-n1 mt-1 position-relative">
              <div className="mb-n1 mt-1 position-relative">
                {editMode ? (
                  <textarea
                    className="p-2"
                    value={editedText}
                    onChange={handleTextChange}
                  />
                ) : (
                  <blockquote className="mb-1  mw-100">
                    <div className="mw-100 overflow-hidden mt-2">{text}</div>
                  </blockquote>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end align-items-bottom">
              {user.username === author.username && (
                <Button onClick={toggleEditMode}>
                  {editMode ? "Save" : "Edit"}
                </Button>
              )}
              <div className="d-flex align-items-center">
                {user.username === author.username && (
                  <Container className="close">
                    <TrashIcon color="#ff52ce" onClick={toggleShowDelete} />
                  </Container>
                )}
              </div>

              <div className="d-flex align-items-center mr-2">
                <Button
                  variant="link"
                  size="md"
                  onClick={() => navigate(`/p/${_id}`)}
                >
                  <ReplyIcon color="#0dcaf0" />
                </Button>
                <span>{comments.length > 0 ? comments.length : 0}</span>
              </div>
              <div
                className={`d-flex align-items-center mr-3 ${
                  likedState ? "isLiked" : ""
                }`}
              >
                <Button variant="link" size="md" onClick={handleToggleLike}>
                  {likedState ? (
                    <LikeIconFill color="#0dcaf0" />
                  ) : (
                    <LikeIcon color="#0dcaf0" />
                  )}
                </Button>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip">
                      {likes.map((like) => like.username).join(", ")}
                    </Tooltip>
                  }
                >
                  <span>{likesState}</span>
                </OverlayTrigger>
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
