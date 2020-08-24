import React, { useState, useEffect } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import "./Form.scss";

const LOGIN = gql`
  mutation($userName: String!, $password: String!) {
    login(userName: $userName, password: $password)
  }
`;

export const Login = ({ redirectToHome }) => {
  const [username, setUsername] = useState(String);
  const [password, setPassword] = useState(String);
  const [showResponse, setShowResponse] = useState(Boolean);
  const [response, setResponse] = useState(String);
  const [isLogged, setIsLogged] = useState(Boolean);
  const [token, setToken] = useState(String);

  const [login, { loading, error }] = useMutation(LOGIN);

  function loginError(error) {
    localStorage.clear();
    setIsLogged(false);
    setToken("");
    setResponse(`The login was unsuccessful! ${error}`);
    setShowResponse(true);
  }

  useEffect(() => {
    if (isLogged && token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          isLogged: isLogged,
          token: token,
        })
      );
    }
  }, [isLogged, token]);

  function successLogin(token_) {
    setIsLogged(true);
    setToken(token_);
    redirectToHome();
  }

  function handleSubmit() {
    login({
      variables: { userName: username, password: password },
    })
      .then((token) => successLogin(token.data.login))
      .catch((error) => loginError(error.message));

    if (error) {
      loginError(error.message);
    }
    setShowResponse(false);
  }

  return (
    <Form
      className="form-wrapper"
      onSubmit={(event) => handleSubmit(event.preventDefault())}
    >
      <div className="title-div">
        <Form.Label className="title">Login</Form.Label>
      </div>

      <Form.Group controlId="formHorizontalUsername">
        <Form.Label column>Username</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => {
              setUsername(event.target.value);
              setShowResponse(false);
            }}
            type="text"
            value={username}
            placeholder="Username"
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalPassword">
        <Form.Label column>Password</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => {
              setPassword(event.target.value);
              setShowResponse(false);
            }}
            type="password"
            value={password}
            placeholder="Password"
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalCheck">
        <Col>
          <Form.Check
            type="checkbox"
            className="my-1 mr-sm-2"
            id="customControlInline"
            label="Remember me"
            custom
          />
        </Col>
      </Form.Group>

      <Form.Group>
        <Col>
          If you don't have an account,&nbsp;
          <Alert.Link href="/signup">click here</Alert.Link> to create.
        </Col>
      </Form.Group>
      <Form.Group>
        <Col>
          <Button type="submit" block>
            Login
          </Button>
        </Col>
      </Form.Group>

      {loading && (
        <Form.Group>
          <Col>
            <Alert className="text-center" variant="info">
              <i className="fas fa-spinner fa-spin" />
            </Alert>
          </Col>
        </Form.Group>
      )}

      {showResponse && (
        <Form.Group>
          <Col>
            <Alert variant="danger">{response}</Alert>
          </Col>
        </Form.Group>
      )}
    </Form>
  );
};
