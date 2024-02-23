import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col, Figure } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../util/api";
import Post from "../../components/Post/Post";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useProvideAuth } from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import SearchForm from "../../components/Search/Search";
import "./FeedPage.scss";

const initialState = {
  postText: "",
  isSubmitting: false,
  errorMessage: null,
};

const FeedPage = () => {
  const {
    state: { user },
  } = useProvideAuth();
  const [posts, setPosts] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(false);
  const [data, setData] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Added state for selected file
  const [keywords, setKeywords] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      toast.error("Post text is required");
      setValidated(true);
      return;
    }

    setData({ ...data, isSubmitting: true, errorMessage: null });

    const formData = new FormData();
    formData.append("text", data.postText);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setData(initialState);
      setSelectedFile(null); // Reset file input
      fileInputRef.current.value = ""; //clear file input field
      setPosts([response.data, ...posts]);
      setValidated(false);
      toast.success("Post created successfully!");
    } catch (error) {
      setData({ ...data, isSubmitting: false, errorMessage: error.message });
      toast.error("Error creating post: " + error.message);
    }
  };

  const handlePostUpdate = (postId, newText) => {
    setPosts(
      posts.map((post) =>
        post._id === postId ? { ...post, text: newText } : post
      )
    );
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await api.get("/posts");
        setPosts(allPosts.data);
        setPostLoading(false);
      } catch (err) {
        console.error(err.message);
        setPostError(true);
      } finally {
        setPostLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <>
      <Header />
      <Container className="pt-3 pb-3 clearfix" style={{ width: "80%" }}>
        <Row>
          <Col md={4} className="left-column">
            <Figure>
              <Figure.Image
                width={400}
                height={180}
                alt="171x180"
                src="album1.jpg"
              />
            </Figure>
            <Container className="mb-5 post">
              <h1>Post</h1>
              <Form
                noValidate
                validated={validated}
                onSubmit={handlePostSubmit}
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  maxLength="120"
                  name="postText"
                  placeholder="What's on your mind?"
                  aria-describedby="post-form"
                  size="lg"
                  required
                  value={data.postText}
                  onChange={handleInputChange}
                  style={{ marginBottom: "2px", opacity: "0.8" }}
                />
                <Form.Control
                  style={{ opacity: "0.8" }}
                  type="file"
                  name="image"
                  onChange={(event) => setSelectedFile(event.target.files[0])}
                  ref={fileInputRef}
                />

                {data.errorMessage && (
                  <span className="form-error">{data.errorMessage}</span>
                )}
                <Button
                  variant="orange"
                  style={{ border: "none", color: "white" }}
                  className="m-auto mt-3"
                  type="submit"
                  disabled={data.isSubmitting}
                >
                  {data.isSubmitting ? <LoadingSpinner /> : "Post"}
                </Button>
              </Form>
            </Container>

            <SearchForm className="search" />
          </Col>
          <Col md={8} className="post-feed">
            {!postLoading ? (
              <Container className=" pb-3">
                {postError && "Error fetching posts"}
                {posts &&
                  posts
                    .filter((post) =>
                      post.text.toLowerCase().includes(keywords.toLowerCase())
                    )
                    .map((post) => (
                      <Post
                        key={post._id}
                        post={post}
                        onPostUpdate={handlePostUpdate}
                      />
                    ))}
              </Container>
            ) : (
              <LoadingSpinner full />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FeedPage;
