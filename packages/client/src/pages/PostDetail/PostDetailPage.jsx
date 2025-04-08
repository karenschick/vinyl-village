// Import necessary React hooks and components
import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import Post from "../../components/Post/Post.jsx";
import Comment from "../../components/Comment/Comment.jsx";
import { useRequireAuth } from "../../hooks/useRequireAuth.jsx";
import { useProvideAuth } from "../../hooks/useAuth.jsx";
import api from "../../util/api.jsx";
import { toast } from "react-toastify";

// Define the initial state for form data and submission status
const initialState = {
  commentText: "", // Holds the text for the comment input
  isSubmitting: false, // Indicates if the comment is being submitted
  errorMessage: null, // Stores any error message during submission
};

// Main component for the post detail page
const PostDetailPage = () => {
  // State hooks for managing post data, loading status, form data, comments, and form validation
  const [post, setPost] = useState(); // Stores the current post details
  const [loading, setLoading] = useState(true); // Indicates if the page is loading
  const [data, setData] = useState(initialState); // Holds form input data
  const [stateComments, setStateComments] = useState([]); // Stores the list of comments
  const [validated, setValidated] = useState(false); // Tracks if the form is validated
  const {
    state: { user },
  } = useProvideAuth(); // Get the authenticated user info

  // Function to handle input changes in the comment form
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value, // Update the input field value in the state
    });
  };

  // Function to handle comment submission
  const handleCommentSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault(); // Prevent default form submission behavior
    event.stopPropagation(); // Stop event propagation

    // Check if the form is valid
    if (form.checkValidity() === false) {
      toast.error("Comment text is required"); // Show error if input is invalid
      setValidated(true); // Set form as validated
      return;
    }

    // Update state to indicate form submission and reset error message
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    // Make an API call to submit the comment
    api
      .put("/posts/comments", {
        text: data.commentText,
        userId: user.uid,
        postId: post._id,
      })
      .then(
        ({ data }) => {
          // Reset form state and update comments list
          setData(initialState);
          setStateComments(data.comments);
          setValidated(false);
        },
        (error) => {
          // Handle API error
          console.log("Axios error", error);
        }
      );
  };

  // Function to handle updating a comment
  const handleUpdateComment = async (commentId, newText) => {
    try {
      // API call to update the comment text
      await api.put(`/posts/comments/${commentId}`, { text: newText });
      // Update the local state with the new text
      setStateComments((currentComments) =>
        currentComments.map((comment) =>
          comment._id === commentId ? { ...comment, text: newText } : comment
        )
      );
      toast.success("Comment updated successfully"); // Notify user of success
    } catch (error) {
      console.error("Failed to update comment", error);
      toast.error("Failed to update comment"); // Notify user of failure
    }
  };

  // React Router hooks for navigation and retrieving URL parameters
  let navigate = useNavigate();
  let params = useParams();

  // Hook to check if the user is authenticated
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // Function to handle updating the post text
  const handlePostUpdate = (postId, newText) => {
    setPosts(
      posts.map((post) => {
        if (post._id === postId) {
          return { ...post, text: newText }; // Update the post text
        }
        return post;
      })
    );
  };

  // Function to handle deleting a comment
  const handleCommentDeleted = (deletedCommentId) => {
    // Update the state to remove the comment
    setStateComments((currentComments) =>
      currentComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  // useEffect hook to fetch post details when the component loads
  useEffect(() => {
    const getPost = async () => {
      try {
        const postDetail = await api.get(`/posts/${params.pid}`);
        setPost(postDetail.data); // Set the post data
        setStateComments(postDetail.data.comments); // Set the comments list
        setLoading(false); // Update loading status
      } catch (err) {
        console.error(err.message);
      }
    };
    isAuthenticated && getPost(); // Fetch post data if the user is authenticated
  }, [params.pid, isAuthenticated]);

  // Display loading spinner if the user is not authenticated or data is still loading
  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  // Render the post detail page
  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "60%" }}>
          <Button
            variant="outline-warning"
            onClick={() => {
              navigate(-1);
            }}
            style={{ border: "none", color: "#white" }}
            className="mt-3 mb-3"
          >
            Go Back
          </Button>

          <Post
            className=""
            post={post}
            onPostUpdate={handlePostUpdate}
            detail
            detailView={false}
          />
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
                  variant="warning"
                  //style={{ color: "white" }}
                  style={{ border: "none", color: "white" }}
                  className="float-right mt-3 mb-5"
                  type="submit"
                >
                  Post
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
            <Container style={{ width: "80%" }}>
              <div>
                {stateComments
                  .slice()
                  .reverse()
                  .map((c, index) => (
                    <Comment
                      key={c._id}
                      comment={c}
                      onCommentDeleted={handleCommentDeleted}
                      onUpdateComment={handleUpdateComment}
                    />
                  ))}
              </div>
            </Container>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PostDetailPage;
