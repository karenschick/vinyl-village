// Importing required modules and components from React and react-bootstrap
import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../util/api";

// Define the UploadFile component, which receives props for managing file upload behavior
const UploadFile = ({ onUpload, toggleBack, isEditPage }) => {
  // State for managing selected files and preview URL for the first file
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  // Function to handle file selection through the input element
  const handleFileUpload = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]); // Append selected files to state

    // Set preview URL for the first selected file
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result); // Update preview URL for display
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Function to handle file drop (drag-and-drop feature)
  const handleDrop = (event) => {
    event.preventDefault(); // Prevents default behavior on drop
    event.stopPropagation(); // Stops propagation of the drop event
    const filesArray = Array.from(event.dataTransfer.files); // Convert dropped files to an array
    setSelectedFiles([...selectedFiles, ...filesArray]); // Add dropped files to state
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

  // Function to handle file upload to the server using API
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file); // Append each file to form data
      });
      // Send POST request to upload files
      const response = await api.post(`/files/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload(response.data.path); // Call onUpload prop function with uploaded file path
    } catch (err) {
      console.error("Upload failed:", err); // Log any errors during upload
    }
  };

  // Function to remove a specific file from selected files
  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1); // Remove file at specified index
    setSelectedFiles(newFiles);
    setPreviewUrl(""); // Reset preview if file removed is the first one

    // Reset the file input element
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = ""; // Clear input value
    }
  };

  // Function to prevent default behavior for drag events
  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    // Main container for file upload component
    <Container
      className="container   "
      onDrop={handleDrop} // Handle file drop
      onDragOver={preventDefaults} // Prevent defaults on drag over
      onDragEnter={preventDefaults} // Prevent defaults on drag enter
    >
      <h6>Drag and drop files here or click to browse</h6>
      <div className=" mt-3 mb-3">
        <input
          type="file"
          id="fileInput"
          className="form-control"
          multiple // Allows multiple file selection
          onChange={handleFileUpload} // Calls file upload handler on change
        />
      </div>
      <div>
        {" "}
        {/* Preview and list of selected files */}
        <ul className="list-group">
          {previewUrl && ( // Display preview if available
            <div>
              <img
                src={previewUrl}
                alt="Preview"
                className="img-thumbnail mt-3" // Thumbnail styling for preview image
              />
            </div>
          )}
          {/* Display each selected file with a remove button */}
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {file.name}
              <Button className="btn  btn-sm" onClick={() => removeFile(index)}>
                <img
                  src={`${import.meta.env.BASE_URL}vinyl-village/trash2.png`}
                  alt="Trash Icon"
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

      {/* Display upload button if files are selected */}
      {selectedFiles.length > 0 && (
        <>
          <Row className="mt-3">
            <Col>
              <Button
                className="mt- "
                variant="warning"
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
        {/* Button to toggle to avatar selection */}
        <Button
          size="sm"
          variant="outline-warning"
          className="mt-3"
          onClick={toggleBack} // Calls toggleBack prop function
        >
          Or Choose an Avatar
        </Button>
      </div>
    </Container>
  );
};

// Export the UploadFile component for use in other files
export default UploadFile;
