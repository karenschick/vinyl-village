import React from "react";
import { Container, Image } from "react-bootstrap";
import "./AvatarPicker.scss";
//import UploadProfilePhoto from "../UploadProfilePhoto/UploadProfilePhoto";

let imgs = [
  "/albumblue.jpg",
  "/albumgreen.jpg",
  "/albumorange.jpg",
  "/albumpurple.jpg",
  "/albumred.jpg",
  "/albumyellow.jpg",
  
];

const AvatarPicker = ({ profileImage, setProfileImage, setAvatarChanged }) => {
  const handleAvatarPicker = (src) => {
    setProfileImage(src);
    setAvatarChanged(true);
  };
  console.log("profile image set:", profileImage);

  return (
    <Container className="mb-4 mt-4">
      <div className="editAvatar">
        {imgs.map((avatar, index) => (
          <Image
            className={profileImage === avatar ? "selectedAvatar " : "avatar"}
            onClick={() => handleAvatarPicker(avatar)}
            key={index}
            src={avatar}
            alt="profile image"
          ></Image>
        ))}
      </div>
      {/* <UploadProfilePhoto /> */}
    </Container>
  );
};

export default AvatarPicker;
