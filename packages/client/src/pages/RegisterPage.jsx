import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { setAuthToken } from "../util/api";
//import LandingHeader from "../components/LandingHeader";
import AvatarPicker from "../components/AvatarPicker/AvatarPicker";
import UploadProfilePhoto from "../components/UploadProfilePhoto/UploadProfilePhoto";
import { useProvideAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";



const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isSubmitting: false,
    errorMessage: null,
  };

const RegisterPage = () => {

    const [data, setData] = useState(initialState);
    const auth = useProvideAuth();
  
    let navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(getRandomProfileUrl());

    function getRandomProfileUrl() {
      //geneartes random pic in img
      let imgs = [
        "bird.svg",
        "dog.svg",
        "fox.svg",
        "frog.svg",
        "lion.svg",
        "owl.svg",
        "tiger.svg",
        "whale.svg",
      ];
      let img = imgs[Math.floor(Math.random() * imgs.length)];
      return `/${img}`;
    }



    const handleInputChange = (event) => {
        setData({
          ...data,
          [event.target.name]: event.target.value,
        });
      };
    
      const handleSignup = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
    
        if (form.checkValidity() === false) {
          return
        }
    
        setData({
          ...data,
          isSubmitting: true,
          errorMessage: null,
        });
        try {
          const res = await auth.signup(
            data.username,
            data.email,
            data.password,
            data.confirmPassword,
            profileImage,
            
          );
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: null,
          });
          setAuthToken(res.token);
          toast.success("Just because someone stumbles and loses their path, doesn't mean they're lost forever.")
          navigate("/");
        } catch (error) {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error ? error.message || error.statusText : null,
          });
          toast.error("We've made some mistakes along the way.  Some, very recently")
        }
      };
      //to see if profile image is being selected
      console.log("profile image:",profileImage);
      return (
        <div style={{ overflow: "auto", height: "100vh" }}>
          {/* <LandingHeader /> */}
    
          <Container className="mb-5">
            <Row className="pt-5 justify-content-center">
              <Form
                noValidate
                validated
                style={{ width: "350px" }}
                onSubmit={handleSignup}
              >
                <h2 className="mb-4">Join Us!</h2>
                <h5>Select an Avatar:</h5>
                <AvatarPicker
                  setProfileImage={setProfileImage}
                  profileImage={profileImage}
                />
                <Form.Group controlId="username-register">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Username"
                      aria-describedby="inputGroupPrepend"
                      required
                      value={data.username}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="email-register">
                  <Form.Label className="mt-3">Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    required
                    value={data.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mt-3" htmlFor="Register">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    required
                    id="inputPasswordRegister"
                    value={data.password}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Text id="passwordHelpBlock" muted>
                              Must be 8-20 characters long.
                            </Form.Text>
                <Form.Group>
                  <Form.Label className="mt-3" htmlFor="Register">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    required
                    id="confirmPasswordRegister"
                    value={data.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                {data.errorMessage && (
                  <span className="form-error text-warning">
                    {data.errorMessage}
                  </span>
                )}
                <Row className="mr-0 mt-3">
                  <Col>
                    Already Registered?
                    <Button
                      as="a"
                      variant="link"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  </Col>
    
                  <Button type="submit" disabled={data.isSubmitting}>
                    {data.isSubmitting ? <LoadingSpinner /> : "Sign up"}
                  </Button>
                </Row>
              </Form>
            </Row>
          </Container>
        </div>
      );
}

export default RegisterPage