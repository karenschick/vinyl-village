// Import required modules and components from React and external libraries
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
//import "./FeedPage.scss";

// Main component for the feed page, where posts are displayed
const FeedPage = () => {
  const { state, updateUser } = useProvideAuth(); // Get auth state and updateUser function
  const [posts, setPosts] = useState(null); // State to hold posts
  const [postLoading, setPostLoading] = useState(true); // Loading state for posts
  const [loading, setLoading] = useState(true); // General loading state
  const [postError, setPostError] = useState(null); // Error state for posts
  const [keywords, setKeywords] = useState(""); // State for search keywords
  const {
    state: { isAuthenticated }, // Check if user is authenticated
  } = useRequireAuth();

  // Handle post updates, send update to API, and provide feedback
  const handlePostUpdate = async (postId, newText) => {
    try {
      const response = await api.put(`/posts/${postId}`, { text: newText });
      updateUser(response.data); // Update user info in auth context
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post: " + error.message);
    }
  };

  // Add a new post to the list of posts
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Fetch all posts on component mount if authenticated
  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await api.get("/posts");
        setPosts(allPosts.data); // Store posts data
        setPostLoading(false); // Set posts loading state to false
        //setLoading(false);
      } catch (err) {
        console.error(err.message);
        setPostError(err.message); // Update error state if fetching fails
      } finally {
        //setPostLoading(false);
        setLoading(false); // Set general loading state to false
      }
    };
    // Fetch posts only if the user is authenticated
    isAuthenticated && getPosts();
  }, [isAuthenticated]);

  // Render a loading spinner if the user is not authenticated or loading data
  if (!isAuthenticated) {
    return <LoadingSpinner full />;
  }

  if (loading) {
    return <LoadingSpinner full />;
  }

  return (
    <>
      {/* Header component with user authentication state */}
      <Header authState={state} />
      <Container className="pt-3 pb-3 clearfix" style={{ width: "80%" }}>
        <Row>
          <Col md={4} className="left-column">
            {/* Static album image */}
            <Figure>
              <Figure.Image
                width={400}
                height={180}
                alt="Collection of Albums"
                src="album1.jpg"
              />
            </Figure>
            {/* Component for adding a new post */}
            <AddPost onPostSubmit={handleNewPost} />
            {/* Search form component */}
            <SearchForm className="search" />
          </Col>
          <Col md={8} className="post-feed">
            {/* Conditionally render posts if not loading */}
            {!postLoading ? (
              <Container className=" pb-3">
                {postError && "Error fetching posts"}
                {/* Filter posts based on search keywords and map through them */}
                {posts &&
                  posts
                    .filter((post) =>
                      post.text.toLowerCase().includes(keywords.toLowerCase())
                    )
                    .map((post) => (
                      <Post
                        key={post._id} // Unique key for each post
                        post={post}
                        onPostUpdate={handlePostUpdate} // Pass post update function to each post
                      />
                    ))}
              </Container>
            ) : (
              <LoadingSpinner full /> // Show loading spinner if posts are loading
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FeedPage;
