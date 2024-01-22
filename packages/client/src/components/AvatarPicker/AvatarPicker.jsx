import React from "react";
import { Container, Image } from "react-bootstrap";
//import "./AvatarPicker.scss";
//import UploadProfilePhoto from "../UploadProfilePhoto/UploadProfilePhoto";

let imgs = [
  
];


const AvatarPicker = ({ profileImage, setProfileImage }) => {
  const handleAvatarPicker = (src) => {
    setProfileImage(src);
  };

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
