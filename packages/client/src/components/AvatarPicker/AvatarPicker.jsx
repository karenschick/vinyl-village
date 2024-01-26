import React from "react";
import { Container, Image } from "react-bootstrap";
import "./AvatarPicker.scss";
//import UploadProfilePhoto from "../UploadProfilePhoto/UploadProfilePhoto";

let imgs = [
  "/donut.jpg",
  "/astronaunt.jpg",
  "/_pinkdino.jpg",
  "/boombox.jpg",
  "/burger.jpg",
  "/headphone.jpg",
  
  "/_unicorn.jpg",
  
  
  "/moon.jpg",
  "/turntable.jpg",
  
  "/_astrosax.jpg",
  "/_cactus.jpg",
  "/_cow.jpg",
  
  
  
  
  "/_panda.jpg",
  "/_pandaboom.jpg",
  "/_dinosaur.jpg",
  
 
  
  "/keyboard.jpg",
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
