import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../util/api";

const UploadFile = ({ onUpload, toggleBack, isEditPage }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);

    // Set preview URL for the first selected file
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const filesArray = Array.from(event.dataTransfer.files);
    setSelectedFiles([...selectedFiles, ...filesArray]);
    // setSelectedFile(event.target.files[0])

    //Set preview URL for the first dropped file
    if (filesArray.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(filesArray[0]);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      const response = await api.post(`/files/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload(response.data.path);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviewUrl("");

    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Container
      className="container   "
      onDrop={handleDrop}
      onDragOver={preventDefaults}
      onDragEnter={preventDefaults}
    >
      <h6>Drag and drop files here or click to browse</h6>
      <div className=" mt-3 mb-3">
        <input
          type="file"
          id="fileInput"
          className="form-control"
          multiple
          onChange={handleFileUpload}
        />
      </div>
      <div>
        {" "}
        <ul className="list-group">
          {previewUrl && (
            <div>
              <img
                src={previewUrl}
                alt="Preview"
                className="img-thumbnail mt-3"
              />
            </div>
          )}
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {file.name}
              <Button className="btn  btn-sm" onClick={() => removeFile(index)}>
                <img
                  src="/trash2.png"
                  style={{
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                  }}
                ></img>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {selectedFiles.length > 0 && (
        <>
          <Row className="mt-3">
            <Col>
              <Button
                className="mt- "
                variant="orange"
                style={{ color: "white" }}
                onClick={handleUpload}
              >
                Select
              </Button>{" "}
            </Col>
          </Row>
        </>
      )}
      <div>
        <Button
          size="sm"
          variant="outline-orange"
          className="mt-3"
          onClick={toggleBack}
        >
          Or Choose an Avatar
        </Button>
      </div>
    </Container>
  );
};

export default UploadFile;
