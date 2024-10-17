// Importing necessary components from React and react-bootstrap
import React from "react";
import { Container, Image } from "react-bootstrap"; // Container for layout, Image for displaying avatars
import "./AvatarPicker.scss"; // Importing custom styles for AvatarPicker component
//import UploadProfilePhoto from "../UploadProfilePhoto/UploadProfilePhoto";

// Array of avatar image paths that will be displayed for selection
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

// AvatarPicker component allows the user to select an avatar image
const AvatarPicker = ({
  profileImage,
  setProfileImage,
  setAvatarChanged,
  handleAvatarSelection,
}) => {
  // Function to handle avatar selection when an image is clicked
  const handleAvatarPicker = (src) => {
    setProfileImage(src); // Sets the selected image as the profile image
    setAvatarChanged(true); // Marks the avatar as changed
    handleAvatarSelection(src); // Executes any additional actions related to avatar selection
  };
  console.log("profile image set:", profileImage); // Logs the current profile image for debugging

  return (
    <Container className="mb-4 mt-4">
      <div className="editAvatar">
        {imgs.map((avatar, index) => (
          <Image
            className={profileImage === avatar ? "selectedAvatar " : "avatar"} // Adds selectedAvatar class if current avatar is selected
            onClick={() => handleAvatarPicker(avatar)} // Calls handleAvatarPicker when an avatar is clicked
            //key = {index} // Unique key for each avatar in the list
            src={avatar} // The avatar image source
            alt={`Avatar ${index}`} // Alternative text for the image
          ></Image>
        ))}
      </div>
      {/* <UploadProfilePhoto /> */}
    </Container>
  );
};

// Exporting the AvatarPicker component for use in other parts of the application
export default AvatarPicker;
