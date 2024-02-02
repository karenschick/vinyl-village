import React, { useState } from "react";
import { Figure, Row, Col, Button } from "react-bootstrap";
//import "./Comment.scss";
import { timeSince } from "../../util/timeSince";
import { Link } from "react-router-dom";
import api from "../../util/api"; 
import { toast } from "react-toastify";
import { useProvideAuth } from "../../hooks/useAuth";

const Comment = ({ comment, onUpdateComment}) => {
  
  const { author } = comment;
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  

  const {
    state: { user },
  } = useProvideAuth();

  console.log(comment);
  
  console.log("Comment Author ID:", comment.author?._id)
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

  return (
    <Row className="comment-card my-3 px-3 py-2" style={{ flexWrap: "nowrap" }}>
      <Col
        as={Link}
        to={`/u/${author.username}`}
        xs={3}
        className="mr-4 bg-border-color rounded-circle ml-2 p-1"
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
      <Col xs={9} className="d-flex flex-column">
        <div className="mb-2 comment-author">
          <Link to={`/u/${author.username}`} className="comment-author-link">
            <span>@{comment.author?.username}</span>
          </Link>
          &nbsp; - &nbsp;
          <span className="text-muted ">{timeSince(comment.created)} ago</span>
        </div>

        <div>
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
              {user.username === author.username && <Button onClick={toggleEditMode}>Edit</Button>}
            </>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Comment;
