import React from "react";
import { Container, Image } from "react-bootstrap";
import "./AvatarPicker.scss";
//import UploadProfilePhoto from "../UploadProfilePhoto/UploadProfilePhoto";

let imgs = [
  "/astronaunt.jpg",
  "/boombox.jpg",
  "/burger.jpg",
  "/headphone.jpg",
  "/keyboard.jpg",
  "/moon.jpg",
  "/turntable.jpg",
  "/donut.jpg",
  "/_astrosax.jpg",
  "/_cactus.jpg",
  "/_cow.jpg",
  "/_dinosaur.jpg",
  "/_flower.jpg",
  "/_giraffe.jpg",
  "/_koala.jpg",
  "/_panda.jpg",
  "/_pandaboom.jpg",
  "/_pinkdino.jpg",
  "/_unicorn.jpg",
  "/bunny.jpg"
];


const AvatarPicker = ({ profileImage, setProfileImage, setAvatarChanged }) => {
  const handleAvatarPicker = (src) => {
    setProfileImage(src);
    setAvatarChanged(true)
  };
console.log("profile image set:", profileImage)


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
