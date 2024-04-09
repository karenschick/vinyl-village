import React from "react";
import { Container, Image } from "react-bootstrap";
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
  profileImage,
  setProfileImage,
  setAvatarChanged,
  handleAvatarSelection,
  updateUser,
}) => {
  const handleAvatarPicker = (src) => {
    setProfileImage(src);
    setAvatarChanged(true);
    handleAvatarSelection(src);
    updateUser({ profile_image: src });
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
            alt={`Avatar ${index}`}
          ></Image>
        ))}
      </div>
    </Container>
  );
};

export default AvatarPicker;
