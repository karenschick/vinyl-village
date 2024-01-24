import React, { useState } from "react";
import { Container, Form, Button, InputGroup, Row, Col } from "react-bootstrap";

const SearchBar = ({ keywords, setKeywords }) => {
  const handleSearchInputChange = (e) => {
    e.preventDefault();
    setKeywords(e.target.value);
  };

  const handleClearSearchInput = () => {
    setKeywords("");
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

export default SearchBar;
