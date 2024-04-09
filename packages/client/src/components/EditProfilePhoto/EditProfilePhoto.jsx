import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AvatarPicker from "../AvatarPicker/AvatarPicker";
import UploadFile from "../UploadFile/UploadFile";
import { useProvideAuth } from "../../hooks/useAuth";
import api from "../../util/api";
import { toast } from "react-toastify";

function EditProfilePhoto({ handleCloseModal }) {
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [validated, setValidated] = useState(false);

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

      const updatedProfileImage = response.data.profile_image; // Get the updated profile image path from the response
      setProfileImage(updatedProfileImage); // Update the profile image state with the new path
      updateUser({ profile_image: updatedProfileImage });
      console.log("updateUser profile image:", user)
      toast.success(`Successfully updated the Avatar`);
    } catch (error) {
      console.log("Error with Avatar upload", error);
      toast.error(`Error updating avatar: ${error.message}`);
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
      const response = await api.put(`/users/${params.uname}/avatar`, {
        profile_image: path,
      });
      const updatedProfileImage = response.data.profile_image; // Get the updated profile image path from the response
      setProfileImage(updatedProfileImage); // Update the profile image state with the new path
      // Update the user object in the authentication context
      updateUser({ profile_image: updatedProfileImage });
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

  return (
    <Card className="mt-3">
      <div className="mt-3 justify-content-center">
        <Form
          className="avatarChange"
          noValidate
          validated={validated}
          onSubmit={handleSubmitProfileImage}
        >
          <h5 className="mt-1">Select a new Avatar:</h5>
          <AvatarPicker
            setProfileImage={setProfileImage}
            profileImage={profileImage}
            setAvatarChanged={setAvatarChanged}
            handleAvatarSelection={handleAvatarSelection}
            updateUser={updateUser}
          />
          <UploadFile onUpload={handleUpload} />
          <Button type="submit" variant="dark" className="mt-3 mb-3">
            Update Profile Image
          </Button>
        </Form>
      </div>
    </Card>
  );
}

export default EditProfilePhoto;
