// Importing required modules and components from React and react-bootstrap
import React, { useState } from "react";
import { Container, Form, Button, InputGroup, Row, Col } from "react-bootstrap";

// Define the SearchBar component, which receives 'keywords' and 'setKeywords' as props for managing search input
const SearchBar = ({ keywords, setKeywords }) => {
  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    setKeywords(e.target.value); // Updates the keywords state with the input value
  };

  // Function to clear the search input field
  const handleClearSearchInput = () => {
    setKeywords(""); // Clears the keywords state, resetting the input field
  };

  return (
    <Container className="pt-3 pb-3 mb-2 ml-5">
      <Row>
        <Col>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search posts"
              name="keywords"
              onChange={handleSearchInputChange}
              value={keywords}
              minLength={1}
              maxLength={100}
            />
          </InputGroup>
        </Col>
        <Col className="my-auto">
          <Button className="btn-sm " onClick={handleClearSearchInput}>
            {" "}
            Clear
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

// Export the SearchBar component for use in other files
export default SearchBar;
