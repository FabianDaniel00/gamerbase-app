import React, { useState } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import "./Form.scss";

export const Register = () => {
  const [username, setUsername] = useState(String);
  const [email, setEmail] = useState(String);
  const [password, setPassword] = useState(String);
  const [confirmPassword, setConfirmPassword] = useState(String);
  const [show, setShow] = useState(Boolean);
  const [response, setResponse] = useState(String);
  const [variant, setVariant] = useState(String);
  const [confirmPasswordError, setConfirmPasswordError] = useState(String);
  const [usernameError, setUsernameError] = useState(String);
  const [emailError, setEmailError] = useState(String);

  const REGISTER = gql`
    mutation($userName: String!, $password: String!, $email: String!) {
      createUser(
        user: { userName: $userName, password: $password, email: $email }
      ) {
        userName
        password
        email
      }
    }
  `;

  const [register, { loading, error }] = useMutation(REGISTER);

  function successRegister() {
    setUsernameError("");
    setEmailError("");
    setConfirmPasswordError("");
    setResponse(`User '${username}' was registered! now you can login :D`);
    setVariant("success");
    setShow(true);
  }

  function registerError(error) {
    setUsernameError("");
    setEmailError("");
    setConfirmPasswordError("");
    if (error === "This username is exist!") {
      setUsernameError("warning");
    } else if (error === "This email is exist!") {
      setEmailError("warning");
    }
    setResponse(`User '${username}' was not registered! ${error}`);
    setVariant("danger");
    setShow(true);
  }

  function handleSubmit() {
    if (confirmPassword !== password) {
      setResponse("Passwords does not match!");
      setConfirmPasswordError("warning");
      setVariant("danger");
      setShow(true);
    } else {
      register({
        variables: { userName: username, email: email, password: password },
      })
        .then(() => successRegister())
        .catch((error) => registerError(error.message));

      if (error) {
        registerError(error.message);
      }
      setShow(false);
    }
  }

  return (
    <Form
      className="form-wrapper"
      onSubmit={(event) => handleSubmit(event.preventDefault())}
    >
      <div className="title-div">
        <Form.Label className="title">Register</Form.Label>
      </div>

      <Form.Group controlId="formHorizontalUsername">
        <Form.Label column>Username</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => {
              setUsername(event.target.value);
              setUsernameError("");
              setShow(false);
            }}
            type="text"
            placeholder="Username"
            value={username}
            id={usernameError}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalEmail">
        <Form.Label column>Email</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
              setShow(false);
            }}
            type="email"
            placeholder="email@adress.com"
            value={email}
            id={emailError}
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
              setConfirmPasswordError("");
              setShow(false);
            }}
            type="password"
            placeholder="Password"
            value={password}
            id={confirmPasswordError}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalConfirmPassword">
        <Form.Label column>Confirm password</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => {
              setShow(false);
              setConfirmPassword(event.target.value);
              setConfirmPasswordError("");
            }}
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            id={confirmPasswordError}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalCheck">
        <Col>
          <Form.Check
            type="checkbox"
            className="my-1 mr-sm-2"
            id="rememberme"
            label="Remember me"
            custom
          />
        </Col>
      </Form.Group>

      <Form.Group>
        <Col>
          <Button type="submit" block>
            Sign up
          </Button>
        </Col>
      </Form.Group>

      {show && (
        <Form.Group>
          <Col>
            <Alert variant={variant}>{response}</Alert>
          </Col>
        </Form.Group>
      )}

      {loading && (
        <Form.Group>
          <Col>
            <Alert className="text-center" variant="info">
              <i className="fas fa-spinner fa-spin" />
            </Alert>
          </Col>
        </Form.Group>
      )}

      <Form.Group className="if-you">
        <Col>
          If you already have an account,&nbsp;
          <Alert.Link href="/login">click here</Alert.Link> to login.
        </Col>
      </Form.Group>
    </Form>
  );
};
