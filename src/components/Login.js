import React from 'react';
import { Form, Col, Button , Container, Alert} from 'react-bootstrap';
import './Login.scss';

export const Login = () => (
    <Form>
        <Container className="wrapper-login">
            <Form.Group  controlId="formHorizontalEmail">
                <Form.Label column>
                Username
                </Form.Label>
                <Col>
                    <Form.Control type="text" placeholder="Username" />
                </Col>
            </Form.Group>

            <Form.Group  controlId="formHorizontalPassword">
                <Form.Label column>
                Password
                </Form.Label>
                <Col>
                    <Form.Control type="password" placeholder="Password" />
                </Col>
            </Form.Group>

            <Form.Group  controlId="formHorizontalCheck">
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

            <Form.Group>
                <Col>
                    <Button type="submit" block>Login</Button>
                </Col>
            </Form.Group>
        </Container>
    </Form>
)