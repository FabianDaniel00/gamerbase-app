import React from "react";
import { Form, Col, Button, Container, Alert } from "react-bootstrap";
import "./Form.scss";

export const Register = (props) => (
  <Form>
    <Container className="form-wrapper">
      <Form.Group controlId="formHorizontalUsername">
        <Form.Label column>Username</Form.Label>
        <Col>
          <Form.Control type="text" placeholder="Username" />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalEmail">
        <Form.Label column>Email</Form.Label>
        <Col>
          <Form.Control type="email" placeholder="email@adress.com" />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalPassword">
        <Form.Label column>Password</Form.Label>
        <Col>
          <Form.Control type="password" placeholder="Password" />
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
          If you already have an account,
          <Alert.Link href="/login"> click here</Alert.Link> to login.
        </Col>
      </Form.Group>

      <Form.Group>
        <Col>
          <Button type="submit" block>
            Sign up
          </Button>
        </Col>
      </Form.Group>
    </Container>
  </Form>
);
