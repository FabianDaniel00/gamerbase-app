import React, { useState } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import { gql } from "@apollo/client";
import "./Form.scss";

export const Login = (props) => {
  const [username, setUsername] = useState(String);
  const [password, setPassword] = useState(String);
  const [loginErrors, setLoginErrors] = useState(String);

  const { client } = props;

  function handleSubmit() {
    client
      .utation({
        mutation: gql`
            {
              // mutation
            }
          `,
      })
      .then((response) => {
        console.log("response from login: ", response);
      })
      .catch((error) => {
        console.log("login error: ", error);
      });
  }

  return (
    <Form
      className="form-wrapper"
      onSubmit={(event) => handleSubmit(event.preventDefault())}
    >
      <Form.Group controlId="formHorizontalUsername">
        <Form.Label column>Username</Form.Label>
        <Col>
          <Form.Control
            onChange={(event) => setUsername(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
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
          If you don't have an account,
          <Alert.Link href="/signup"> click here</Alert.Link> to create.
        </Col>
      </Form.Group>

      <Col>
        <Button type="submit" block>
          Login
        </Button>
      </Col>
    </Form>
  );
};
