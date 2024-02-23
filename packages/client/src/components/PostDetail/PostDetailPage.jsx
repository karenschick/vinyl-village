import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Post from "../Post/Post.jsx";
import Comment from "../Comment/Comment.jsx";
import { useRequireAuth } from "../../hooks/useRequireAuth.jsx";
import { useProvideAuth } from "../../hooks/useAuth.jsx";
import api from "../../util/api.jsx";
import { toast } from "react-toastify";

const initialState = {
  commentText: "",
  isSubmitting: false,
  errorMessage: null,
};

const PostDetailPage = () => {
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(initialState);
  const [stateComments, setStateComments] = useState([]);
  const [validated, setValidated] = useState(false);
  const {
    state: { user },
  } = useProvideAuth();

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleCommentSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      toast.error("Comment text is required");
      setValidated(true);
      return;
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    api
      .put("/posts/comments", {
        text: data.commentText,
        userId: user.uid,
        postId: post._id,
      })
      .then(
        ({ data }) => {
          setData(initialState);
          setStateComments(data.comments);
          setValidated(false);
        },
        (error) => {
          console.log("Axios error", error);
        }
      );
  };

  const handleUpdateComment = async (commentId, newText) => {
    try {
      await api.put(`/posts/comments/${commentId}`, { text: newText });
      // Update the local state with the new text
      setStateComments((currentComments) =>
        currentComments.map((comment) =>
          comment._id === commentId ? { ...comment, text: newText } : comment
        )
      );
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Failed to update comment", error);
      toast.error("Failed to update comment");
    }
  };

  let navigate = useNavigate();
  let params = useParams();

  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  const handlePostUpdate = (postId, newText) => {
    setPosts(
      posts.map((post) => {
        if (post._id === postId) {
          return { ...post, text: newText };
        }
        return post;
      })
    );
  };

  const handleCommentDeleted = (deletedCommentId) => {
    // Update the state to remove the comment
    setStateComments((currentComments) =>
      currentComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const postDetail = await api.get(`/posts/${params.pid}`);
        setPost(postDetail.data);
        setStateComments(postDetail.data.comments);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
      }
    };
    isAuthenticated && getPost();
  }, [params.pid, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "60%" }}>
          <Button
            variant="outline-info"
            onClick={() => {
              navigate(-1);
            }}
            style={{ border: "none", color: "#white" }}
            className="mt-3"
          >
            Go Back
          </Button>

          <Post post={post} onPostUpdate={handlePostUpdate} detail />
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleCommentSubmit}
              className="clearfix"
              style={{ width: "80%" }}
            >
              <Form.Control
                type="text"
                size="md"
                name="commentText"
                maxLength="120"
                placeholder="Reply"
                aria-describedby="comment-input"
                required
                value={data.commentText}
                onChange={handleInputChange}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="orange"
                  style={{ border: "none", color: "white" }}
                  className="float-right mt-3 mb-5"
                  type="submit"
                >
                  Comment
                </Button>
              </div>
              <Form.Control.Feedback type="invalid" className="text-warning">
                Comment text is required
              </Form.Control.Feedback>

              {data.errorMessage && (
                <span className="form-error">{data.errorMessage}</span>
              )}
            </Form>
          </div>
          {!stateComments.length > 0 ? (
            <div>no comments</div>
          ) : (
            <Container>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div>
                  {stateComments.map((c, index) => (
                    <Comment
                      key={c._id}
                      comment={c}
                      onCommentDeleted={handleCommentDeleted}
                      onUpdateComment={handleUpdateComment}
                    />
                  ))}
                </div>
              </div>
            </Container>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PostDetailPage;
