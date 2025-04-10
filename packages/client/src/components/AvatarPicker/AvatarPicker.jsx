// Importing necessary components from React and react-bootstrap
//import { Container, Image } from "react-bootstrap"; // Container for layout, Image for displaying avatars
import React, { useState, useEffect } from "react";
import { Image, Card, Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import api from "../../util/api";
import UploadFile from "../UploadFile/UploadFile";


// Array of avatar image paths that will be displayed for selection
let imgs = [
  `${import.meta.env.BASE_URL}albumblue.jpg`,
  `${import.meta.env.BASE_URL}albumgreen.jpg`,
  `${import.meta.env.BASE_URL}albumorange.jpg`,
  `${import.meta.env.BASE_URL}albumpurple.jpg`,
  `${import.meta.env.BASE_URL}albumred.jpg`,
  `${import.meta.env.BASE_URL}albumyellow3.jpg`,
  `${import.meta.env.BASE_URL}albumgray2.jpg`,
  `${import.meta.env.BASE_URL}albumaqua3.jpg`,
  `${import.meta.env.BASE_URL}albumpink.jpg`, 
];

// AvatarPicker component allows the user to select an avatar image
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
      toast.success("Avatar updated successfully!");
      updateUser({ profile_image: updatedProfileImage });
      console.log("updateUser profile image:", user);
    } catch (error) {
      console.log("Error with Avatar upload", error);
      //toast.error("Error updating avatar: " + error.message);
    }
  };

  const handleSubmitProfileImage = (event) => {
    event.preventDefault();
    if (profileImage) {
      setAvatarChanged(true);
      handleCloseModal();
      toast.success("Avatar updated successfully!");
      updateUser({ profile_image: profileImage });
    } else {
      console.log("please select an image");
    }
  };

  const handleUpload = async (path) => {
    try {
      const fullPath = `${import.meta.env.BASE_URL}${path}`;
      if (isRegistration) {
        // For registration, set profileImageRegistration
        setProfileImageRegistration(fullPath);
        toast.success("Profile Image uploaded successfully!");
        console.log("Uploaded image path for registration:", fullPath);
      } else {
        // For editing, set profileImage
        const response = await api.put(`/users/${params.uname}/avatar`, {
          profile_image: fullPath,
        });
        const updatedProfileImage = response.data.profile_image;
        setProfileImage(updatedProfileImage);
        toast.success("Profile Image updated successfully!");
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
    if (!isRegistration) {
      // Only set profile_image if it's not a registration process
      setProfileImage(avatar);
    }
  };

  useEffect(() => {
    if (avatarChanged) {
      updateAvatar();
      setAvatarChanged(false);
    }
  }, [avatarChanged]);
  const convertImageToBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const handleAvatarPicker = async (avatar) => {
    // Convert the avatar image to Base64
    try {
      const base64Avatar = await convertImageToBase64(avatar);
      // Check if it's for registration
      if (isRegistration) {
        // Use profileImageRegistration for registration
        setProfileImageRegistration(base64Avatar);
      } else {
        // Use profileImage for editing
        setProfileImage(base64Avatar);
      }
      handleAvatarSelection(avatar);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };
  
  // const handleAvatarPicker = (avatar) => {
  //   const imagePath = avatar ||   `${import.meta.env.BASE_URL}vinyl-village/default-avatar.jpg` 

  //   // Check if it's for registration
  //   if (isRegistration) {
  //     // Use profileImageRegistration for registration
  //     setProfileImageRegistration(imagePath);
  //   } else {
  //     // Use profileImage for editing
  //     setProfileImage(imagePath);
  //   }
  //   handleAvatarSelection(avatar);
  // };

  const handleToggleBack = () => {
    setShowAvatarCard(true);
    setProfileImage("");
  };

  return (
    <Card className="mb-4 mt-3 p-3">
      {showAvatarCard && (
        <div className="avatar-card">
          <h6 className="mt-1">Choose an Avatar</h6>
          {imgs.map((avatar, index) => (
            <Image
              className={profileImage === avatar ? "selectedAvatar " : "avatar"}
              onClick={() => handleAvatarPicker(avatar)}
              key={index}
              // src={avatar || `${import.meta.env.BASE_URL}vinyl-village/default-avatar.jpg`} 
              src={profileImage === avatar ? profileImage : avatar} //using base64
              alt={`Avatar ${index}`}
              style={{maxWidth:"150px"}}
            ></Image>
          ))}
          {!isRegistration && (
            <Button
              type="submit"
              variant="warning"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "350px",
                margin: "auto",
                color: "white",
              }}
              onClick={handleSubmitProfileImage}
              className="mt-3 mb-2"
              disabled={!profileImage}
            >
              Select
            </Button>
          )}
          <Button
            size="sm"
            className="mt-3"
            variant="outline-warning"
            onClick={() => setShowAvatarCard(false)}
          >
            Or Upload an Image
          </Button>
        </div>
      )}
      {!showAvatarCard && (
        <UploadFile onUpload={handleUpload} toggleBack={handleToggleBack} />
      )}
    </Card>
  );
};

// Exporting the AvatarPicker component for use in other parts of the application
export default AvatarPicker;
