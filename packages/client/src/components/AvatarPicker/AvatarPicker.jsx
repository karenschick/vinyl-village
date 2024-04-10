import React, { useState, useEffect } from "react";
import { Container, Image, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useAuth";
import api from "../../util/api";
import UploadFile from "../UploadFile/UploadFile";
import "./AvatarPicker.scss";

let imgs = [
  "/albumblue.jpg",
  "/albumgreen.jpg",
  "/albumorange.jpg",
  "/albumpurple.jpg",
  "/albumred.jpg",
  "/albumyellow3.jpg",
  "/albumgray2.jpg",
  "/albumaqua3.jpg",
  "/albumpink.jpg",
];

const AvatarPicker = ({
  handleCloseModal,
  profileImageRegistration,
  setProfileImageRegistration,
  isRegistration,
  isEditPage,
  handleClosePicker,
}) => {
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [validated, setValidated] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [showAvatarCard, setShowAvatarCard] = useState(true);

  let params = useParams();

  const {
    state: { isAuthenticated, user },
    updateUser,
  } = useProvideAuth();

  useEffect(() => {
    const getUserProfileImage = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`);
        setProfileImage(userResponse.data.profile_image);
      } catch (error) {
        console.error("Error fetching user profile image", error);
      }
    };
    if (isAuthenticated) {
      getUserProfileImage();
    }
  }, [params.uname, isAuthenticated]);

  const updateAvatar = async () => {
    try {
      const response = await api.put(`/users/${params.uname}/avatar`, {
        profile_image: profileImage,
      });
      console.log("Avatar Updated", response.data);

      const updatedProfileImage = response.data.profile_image;
      setProfileImage(updatedProfileImage);
      updateUser({ profile_image: updatedProfileImage });
      console.log("updateUser profile image:", user);
    } catch (error) {
      console.log("Error with Avatar upload", error);
    }
  };

  const handleSubmitProfileImage = (event) => {
    event.preventDefault();
    if (profileImage) {
      setAvatarChanged(true);
      handleCloseModal();
    } else {
      console.log("please select an image");
    }
  };

  const handleUpload = async (path) => {
    try {
      if (isRegistration) {
        // For registration, set profileImageRegistration
        setProfileImageRegistration(path);
        console.log("Uploaded image path for registration:", path);
      } else {
        // For editing, set profileImage
        const response = await api.put(`/users/${params.uname}/avatar`, {
          profile_image: path,
        });
        const updatedProfileImage = response.data.profile_image;
        setProfileImage(updatedProfileImage);
        updateUser({ profile_image: updatedProfileImage });
        console.log("Updated profile image:", updatedProfileImage);
      }
      if (isEditPage) {
        handleClosePicker();
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleAvatarSelection = (avatar) => {
    console.log("Selected avatar:", avatar);
  };

  useEffect(() => {
    if (avatarChanged) {
      updateAvatar();
      setAvatarChanged(false);
    }
  }, [avatarChanged]);

  const handleAvatarPicker = (avatar) => {
    // Check if it's for registration
    if (isRegistration) {
      // Use profileImageRegistration for registration
      setProfileImageRegistration(avatar);
    } else {
      // Use profileImage for editing
      setProfileImage(avatar);
      setAvatarChanged(true);
      updateUser({ profile_image: avatar });
    }
    handleAvatarSelection(avatar);
  };
  const handleToggleBack = () => {
    setShowAvatarCard(true);
  };
  return (
    <Container className="mb-4 mt-4">
      {showAvatarCard && (
        <div className="avatar-card">
          <h5 className="mt-1">Choose an Avatar:</h5>
          {imgs.map((avatar, index) => (
            <Image
              className={profileImage === avatar ? "selectedAvatar " : "avatar"}
              onClick={() => handleAvatarPicker(avatar)}
              key={index}
              src={avatar}
              alt={`Avatar ${index}`}
            ></Image>
          ))}
          {!isRegistration && (
            <Button
              type="submit"
              variant="dark"
              onClick={handleSubmitProfileImage}
              className="mt-3 mb-3"
            >
              Update Profile Image
            </Button>
          )}
          <h5 className="mt-4">Or Upload an Image:</h5>
          <Button variant="dark" onClick={() => setShowAvatarCard(false)}>
            Choose Image
          </Button>
        </div>
      )}

      {!showAvatarCard && (
        <UploadFile onUpload={handleUpload} toggleBack={handleToggleBack} />
      )}
    </Container>
  );
};

export default AvatarPicker;
