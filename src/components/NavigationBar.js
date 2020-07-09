import React, { Component } from 'react';
import { Nav, Navbar, Form, FormControl, NavDropdown } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  .navbar {
    background-color: #222;
  }

  a, .navbar-nav, .navbar-dark .nav-link {
    color: #9FFFCB;
    &:hover { color: white; }
  }

  .navbar-brand {
    font-size: 1.4em;
    color: #9FFFCB;
    &:hover { color: white; }
  }

  .form-center {
    position: absolute !important;
    left: 300px;
    right: 25%;
    max-width: 500px;
  }
  
  .navdropdown-item {
    color: #222;
    &:hover { background-color: #4d4d4d; color: white;}
  }

  @media (max-width: 991px) {
    .form-center {
      left: 150px;
      z-index: 1;
    }
  }
`;

class NavigationBar extends Component {
  render() {
    return (
      <Styles>
        <Navbar collapseOnSelect expand="lg" variant="dark">
          <Navbar.Brand href="/">GamerBase</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Categories" id="collasible-nav-dropdown">
                <NavDropdown.Item className="navdropdown-item" href="#action/3.1">FPS</NavDropdown.Item>
                <NavDropdown.Item className="navdropdown-item" href="#action/3.2">MMORPG</NavDropdown.Item>
                <NavDropdown.Item className="navdropdown-item" href="#action/3.3">Strategy</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item className="navdropdown-item" href="#action/3.4">Other</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Sign up</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Form className="form-center">
            <FormControl type="text" placeholder="Search" />
          </Form>
        </Navbar>
      </Styles>
    );
  }
}

export default NavigationBar;