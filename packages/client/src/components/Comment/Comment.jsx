import React, { useState } from "react";
import {
  Figure,
  Row,
  Col,
  Button,
  Card,
  Dropdown,
  DropdownMenu,
} from "react-bootstrap";
//import "./Comment.scss";
import { timeSince } from "../../util/timeSince";
import { Link } from "react-router-dom";
import api from "../../util/api";
import { toast } from "react-toastify";
import { useProvideAuth } from "../../hooks/useAuth";
import DeleteModal from "../DeleteModal/DeleteModal";
import TrashIcon from "../icons/TrashIcon";
import useToggle from "../../hooks/useToggle";

const Comment = ({ comment, onUpdateComment, onCommentDeleted }) => {
  const { author } = comment;
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [showDelete, toggleShowDelete] = useToggle();
  const [isDeleted, toggleIsDeleted] = useToggle();

  const {
    state: { user },
  } = useProvideAuth();

  console.log(comment);

  console.log("Comment Author ID:", comment.author?._id);
  const handleCommentTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveComment = async () => {
    try {
      const response = await api.put(`/posts/comments/${comment._id}`, {
        text: editedText,
      });
      onUpdateComment(comment._id, response.data.text); // Update comment in the parent component
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment");
    }
    toggleEditMode();
  };

  const handleDeleteComment = async () => {
    try {
      await api.delete(`/posts/comments/${comment._id}`);
      onCommentDeleted(comment._id);
      toggleShowDelete();
      toggleIsDeleted();
    } catch (error) {
      toast.error(`An error occurred deleting post ${comment._id}.`);
      toggleShowDelete();
    }
  };

  return (
    <>
      <Card className="mt-2 pb-3"style={{ width: "30%" }}>
        <div className="d-flex justify-content-end align-items-center">
          {user.username === author.username && (
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                bsPrefix="p-0"
                style={{ lineHeight: ".75", padding: "0", fontSize: "30px" }}
              >
                <span className="text-muted" style={{ fontSize: "30px" }}>
                  &#8230;
                </span>
              </Dropdown.Toggle>
              <DropdownMenu>
                <Dropdown.Item onClick={toggleShowDelete}>Delete</Dropdown.Item>
                <Dropdown.Item onClick={toggleEditMode}>Edit</Dropdown.Item>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <Row
          className="comment-card my-3 px-3 py-2"
          style={{ flexWrap: "nowrap" }}
        >
          <Col
            as={Link}
            to={`/u/${author.username}`}
            xs={3}
            className="d-flex align-items-center flex-row mr-4 bg-border-color rounded-circle ml-2 p-1"
            style={{
              height: "65px",
              minHeight: "65px",
              width: "65px",
              minWidth: "65px",
              marginTop: "0px",
            }}
          >
            <Figure.Image
              src={author.profile_image}
              className="avatar w-100 h-100 mr-4"
            />
          </Col>
          <Col xs={9} className="d-flex align-items-center flex-row">
            <div className="mb-2 comment-author">
              <Link
                to={`/u/${author.username}`}
                className="comment-author-link"
                style={{ textDecoration: "none" }}
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
                />
                <Button onClick={saveComment}>Save</Button>
                <Button onClick={toggleEditMode}>Cancel</Button>
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
          />
        </Row>
      </Card>
    </>
  );
};

export default Comment;
