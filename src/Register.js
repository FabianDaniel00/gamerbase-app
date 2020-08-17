import React, { useState } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import { gql } from "@apollo/client";
import "./Form.scss";

export const Register = (props) => {
  const [username, setUsername] = useState(String);
  const [email, setEmail] = useState(String);
  const [password, setPassword] = useState(String);
  const [confirmPassword, setConfirmPassword] = useState(String);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(String);
  const [registerErrors, setRegisterErrors] = useState(String);

  const { client } = props;

  function handleSubmit() {
    if (confirmPassword !== password) {
      setShow(true);
      setId("warning");
    } else {
      client
        .mutation({
          mutation: gql`
              {
                // mutation
              }
            `,
        })
        .then((response) => {
          console.log("response from register: ", response);
        })
        .catch((error) => {
          console.log("register error: ", error);
        });
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
            onChange={(event) => setUsername(event.target.value)}
            type="text"
            placeholder="Username"
            value={username}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalEmail">
        <Form.Label column>Email</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="email@adress.com"
            value={email}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalPassword">
        <Form.Label column>Password</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            value={password}
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
              setId("");
            }}
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            id={id}
            required
          />
        </Col>
      </Form.Group>

      {show && (
        <Form.Group>
          <Col>
            <Alert variant="danger">Passwords not match!</Alert>
          </Col>
        </Form.Group>
      )}

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

      <Col>
        <Button type="submit" block>
          Sign up
        </Button>
      </Col>

      <Form.Group className="if-you">
        <Col>
          If you already have an account,
          <Alert.Link href="/login"> click here</Alert.Link> to login.
        </Col>
      </Form.Group>
    </Form>
  );
};
