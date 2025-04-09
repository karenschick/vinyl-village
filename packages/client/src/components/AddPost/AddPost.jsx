import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Row, Col, Figure } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../util/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const initialState = {
  postText: "",
  isSubmitting: false,
  errorMessage: null,
};

const AddPost = ({ onPostSubmit }) => {
  const [posts, setPosts] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [postError, setPostError] = useState(false);
  const [data, setData] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const fileInputRef = useRef(null);

  const {
    state: { isAuthenticated },
  } = useRequireAuth();

  // Handle text input change
  const handleInputChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  // Convert images to base64
  const convertImages = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // save base64 image to state
      };
      reader.readAsDataURL(file); //read file as base64
    }
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
    if (base64Image) {
      formData.append("image", base64Image);
    }

    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response data:", response.data);

      if (response.status === 200) {
        setData(initialState);
        setSelectedFile(null);
        fileInputRef.current.value = "";
        setPosts([response.data, ...posts]);
        onPostSubmit(response.data);
        setValidated(false);
        toast.success("Post created successfully!");
      } else {
        toast.error("Error creating post. Please try again.");
      }
    } catch (error) {
      setData({ ...data, isSubmitting: false, errorMessage: error.message });
      toast.error("Error creating post: " + error.message);
    }
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

  return (
    <Container className="mb-5 post">
      <h1>Post</h1>
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
          variant="warning"
          style={{ border: "none", color: "white" }}
          className="m-auto mt-3"
          type="submit"
          disabled={data.isSubmitting}
        >
          {data.isSubmitting ? <LoadingSpinner /> : "Post"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddPost;
