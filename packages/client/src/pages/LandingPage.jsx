import React from 'react';
import Login from '../components/Login/Login';


import { Container } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <Container>
      <h1>Need an album? Share an album. chat with other music lovers</h1>
      
      <Login />
    </Container>
  );
};

export default LandingPage;
