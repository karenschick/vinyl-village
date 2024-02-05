import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../util/api";
//import api from "../../utils/api.utils.js";
//import { Post, LoadingSpinner } from "../components";
import Post from "../components/Post/Post";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { useProvideAuth } from "../hooks/useAuth";
import Header from "../components/Header/Header";
//import { useProvideAuth } from "../../hooks/useAuth";
//import SearchBar from "../SearchBar/SearchBar.jsx";
import SearchForm from "../components/Search/Search";

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

  const [keywords, setKeyWords] = useState("");

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handlePostSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      toast.error("Post text is required");
      setValidated(true);
      return;
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    api
      .post("/posts", {
        text: data.postText,
        author: user.username,
      })
      .then(
        (res) => {
          setData(initialState);
          setPosts((posts) => [
            {
              ...res.data,
              author: {
                username: user.username,
                profile_image: user.profile_image,
              },
            },
            ...posts,
          ]);
          setValidated(false);
        },
        (error) => {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message,
          });
        }
      );
  };

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

  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await api.get("/posts");
        setPosts(allPosts.data);
        setPostLoading(false);
      } catch (err) {
        console.error(err.message);
        setPostLoading(false);
        setPostError(true);
      }
    };
    getPosts();
  }, []);

  return (
    <>
      <Header />
      <Container className="pt-3 pb-3 clearfix" style={{ width: "50%" }}>
        <SearchForm />

        <h4>Share a Snip</h4>
        <Form noValidate validated={validated} onSubmit={handlePostSubmit}>
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
          />

          {data.errorMessage && (
            <span className="form-error">{data.errorMessage}</span>
          )}
          <Button
            variant="info"
            style={{ border: "none", color: "white" }}
            className="float-right mt-3"
            type="submit"
            disabled={data.isSubmitting}
          >
            {data.isSubmitting ? <LoadingSpinner /> : "Post"}
          </Button>
        </Form>
      </Container>
      {/* <SearchBar keywords={keywords} setKeywords={setKeyWords} /> */}
      {!postLoading ? (
        <Container className="pt-3 pb-3" style={{ width: "50%" }}>
          <h6>Recent Snips</h6>
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
    </>
  );
};

export default FeedPage;
