import React, { Component, useState } from "react";
import {
  Nav,
  Navbar,
  Form,
  FormControl,
  NavDropdown,
  Dropdown,
} from "react-bootstrap";
import styled from "styled-components";

const Styles = styled.div`
  .navbar {
    background-color: #222;
  }

  a,
  .navbar-nav,
  .navbar-dark .nav-link {
    color: #9fffcb;
    &:hover {
      color: white;
    }
  }

  .navbar-brand {
    font-size: 1.4em;
    color: #9fffcb;
    &:hover {
      color: white;
    }
  }

  .form-center {
    position: absolute !important;
    left: 270px;
    right: 25%;
    max-width: 430px;
  }

  .navdropdown-item {
    color: #222;
    &:hover {
      background-color: #4d4d4d;
      color: white;
    }
  }

  .bigger {
    font-size: 23px;
    margin: 0px 0px 0px 10px;
  }

  .dropdown-item {
    font-size: 13px;
    color: #222;
    &:hover {
      background-color: #4d4d4d;
      color: white;
    }
  }

  @media (max-width: 991px) {
    .form-center {
      left: 150px;
      z-index: 1;
    }
  }
`;

class NavigationBar extends Component {
  state = {
    categories: ["FPS", "MMORPG", "Strategy"],
  };
  render() {
    const { categories } = this.state;
    return (
      <Styles>
        <Navbar collapseOnSelect expand="lg" variant="dark">
          <Navbar.Brand href="/">GamerBase</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Categories" id="collasible-nav-dropdown">
                {categories.map((category, key) => {
                  return (
                    <NavDropdown.Item
                      key={key}
                      className="navdropdown-item"
                      href="#action/3.1"
                    >
                      {category}
                    </NavDropdown.Item>
                  );
                })}
                <NavDropdown.Divider />
                <NavDropdown.Item
                  className="navdropdown-item"
                  href="#action/3.4"
                >
                  Other
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Sign up</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <CustomDropdownButton />
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

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value ||
              child.props.children.toLowerCase().startsWith(value) ||
              child.props.children.toUpperCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

class CustomDropdownButton extends Component {
  render() {
    return (
      <Dropdown drop="left">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <div className="bigger">
            <i className="fas fa-sort-down" />
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          <Dropdown.Item eventKey="1" href="#action/3.1">
            <div className="dropdown-item">My profile</div>
          </Dropdown.Item>
          <Dropdown.Item eventKey="2" href="#action/3.2">
            <div className="dropdown-item">Settings</div>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="4" href="#action/3.4">
            <div className="dropdown-item">Log out</div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
