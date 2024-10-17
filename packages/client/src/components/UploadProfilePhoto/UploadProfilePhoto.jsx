// import React from "react";
// import { useState } from "react";
// import { Form, Container, Button, Col, Row } from "react-bootstrap";
// import useFileUploader from "../../hooks/useFileUploader";
// import "bootstrap/dist/css/bootstrap.min.css";
// import api from "../../util/api";

// const UploadProfilePhoto = ({ profileImage, setProfileImage }) => {
//   const [file, setFile] = useState();
//   const [uploadedFilePath, setUploadedFilePath] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const { uploadFile } = useFileUploader();
//   const [user, setUser] = useState();

//   const handleFileSelection = (e) => {
//     setFile(e.target.files[0]);
//   };
//   console.log(file);

//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     setUploading(true);
//     console.log(file);
//     const response = await uploadFile("/files/images", file, "file");
//     setUploadedFilePath(response.data.path);
//     setUser({
//       ...profileImage,
//       imgUrl: response.data.path,
//     });
//     setProfileImage(res.data.path);
//   };

//   return (
//     <Container>
//       <Form.Group>
        
//         <Form.Label className="mt-4" htmlFor="file">
//           Or Upload a New Image
//         </Form.Label>
//         <Row>
//           <Col>
//             <Form.Control
//               id="file"
//               type="file"
//               name="file"
//               filename={file ? file.name : ""}
//               onChange={handleFileSelection}
//             />
//           </Col>
//           <Col className="my-auto">
//             <Button
//               className="btn-sm "
//               type="button"
//               onClick={handleFileUpload}
//             >
//               Upload
//             </Button>
//           </Col>
//         </Row>
//       </Form.Group>
//     </Container>
//   );
// };

// export default UploadProfilePhoto;

import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../util/api";

const UploadProfilePhoto = ({ onUpload, handleClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [userId, setUserId] = useState(userData?._id);
  const handleFileUpload = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const filesArray = Array.from(event.dataTransfer.files);
    setSelectedFiles([...selectedFiles, ...filesArray]);
  };

  const handleUpload = async () => {
    // console.log(userId);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post(`/files/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload(response.data.path);

      handleClose();
      console.log(response.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="container mt-5 p-3 border border-primary rounded"
      onDrop={handleDrop}
      onDragOver={preventDefaults}
      onDragEnter={preventDefaults}
    >
      <h3>Upload File</h3>
      <div className="mb-3">
        <label htmlFor="fileInput" className="form-label">
          Drag and drop files here or click to browse.
        </label>
        <input
          type="file"
          id="fileInput"
          className="form-control"
          multiple
          onChange={handleFileUpload}
        />
      </div>
      <div>
        <h5>Selected Files:</h5>
        <ul className="list-group">
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {file.name}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFile(index)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default UploadProfilePhoto;