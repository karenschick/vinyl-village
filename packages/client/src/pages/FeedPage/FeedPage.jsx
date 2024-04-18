import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Figure } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../util/api";
import Post from "../../components/Post/Post";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useProvideAuth } from "../../hooks/useAuth";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import Header from "../../components/Header/Header";
import SearchForm from "../../components/Search/Search";
import AddPost from "../../components/AddPost/AddPost";
import "./FeedPage.scss";

const FeedPage = () => {
  const { state, updateUser } = useProvideAuth();
  const [posts, setPosts] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [keywords, setKeywords] = useState("");
  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  const handlePostUpdate = async (postId, newText) => {
    try {
      const response = await api.put(`/posts/${postId}`, { text: newText });
      updateUser(response.data);
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post: " + error.message);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await api.get("/posts");
        setPosts(allPosts.data);
        setPostLoading(false);
        //setLoading(false);
      } catch (err) {
        console.error(err.message);
        setPostError(err.message);
      } finally {
        //setPostLoading(false);
        setLoading(false);
      }
    };
    isAuthenticated && getPosts();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  return (
    <>
      <Header authState={state} />
      <Container className="pt-3 pb-3 clearfix" style={{ width: "80%" }}>
        <Row>
          <Col md={4} className="left-column">
            <Figure>
              <Figure.Image
                width={400}
                height={180}
                alt="Collection of Albums"
                src="album1.jpg"
              />
            </Figure>

            <AddPost onPostSubmit={handleNewPost} />
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
