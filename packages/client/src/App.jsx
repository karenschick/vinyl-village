import React from "react";
import { Route, Routes } from "react-router-dom";
import { Col, Row, ToastContainer } from "react-bootstrap";
import { useProvideAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const App = () => {
  const {
    state: { user },
  } = useProvideAuth();

  return (
    <>
      <ToastContainer position="top-center" />
      {/* {user ? (
        <>
          <Header />
          <Container
            fluid
            style={{
              height: "calc(100vh - 72px)",
              overflow: "auto",
            }}
          >
            <Row>
              <Col xs={0} md={2} xl={3} />
              <Col xs={12} md={8} xl={6}>
                <Routes>
                  <Route exact path="/u/:uname" element={<UserDetailPage />} />
                  <Route exact path="/login" element={<Navigate to="/" />} />
                  <Route exact path="/register" element={<Navigate to="/" />} />
                  <Route
                    element={({ location }) => {
                      return (
                        <div
                          style={{
                            padding: "50px",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          The page <code>{location.pathname}</code> could not be
                          found.
                        </div>
                      );
                    }}
                  />
                </Routes>
              </Col>
              <Col xs={0} md={2} xl={3} />
            </Row>
          </Container>
        </>
      ) : ( */}
        <Routes>
          {/* {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      {/* )} */}
    </>
  );
};

export default App;
