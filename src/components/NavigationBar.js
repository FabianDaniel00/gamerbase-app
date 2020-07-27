import React, { Component, useState } from "react";
import {
  Nav,
  Navbar,
  Form,
  FormControl,
  NavDropdown,
  Dropdown,
  Button,
  ButtonGroup,
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
    font-size: 1.6em;
    color: #9fffcb;
    &:hover {
      color: white;
    }
  }

  .form-center {
    position: absolute;
    left: 280px;
    right: 25%;
    max-width: 430px;
    z-index: 0;
  }

  .navdropdown-item {
    color: #222;
    width: auto;
    margin-left: 5px;
    &:hover {
      background-color: #4d4d4d;
      color: white;
    }
  }

  .navdropdown {
    width: calc(100% - 5px);
    z-index: 2;
  }

  .dropdown-item {
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

  .d-item {
    width: 100%;
    &:hover {
      background-color: #4d4d4d;
      color: white;
    }
  }

  @media (max-width: 500px) {
    .navdropdown-item {
      font-size: 75%;
    }
    .d-item {
      font-size: 75%;
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
  render() {
    const { categories, games } = this.props;
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
                    <Dropdown
                      className="navdropdown"
                      key={key}
                      drop="right"
                      as={ButtonGroup}
                    >
                      <Button
                        className="navdropdown-item"
                        href={`/categories/${category.slug}`}
                        variant="secondary"
                      >
                        {category.name}
                      </Button>

                      <Dropdown.Toggle
                        split
                        variant="secondary"
                        id="dropdown-split-basic"
                      />

                      <Dropdown.Menu>
                        {games
                          .filter(
                            (game) => game.category.name === category.name
                          )
                          .map((filteredGame, key) => {
                            return (
                              <Dropdown.Item
                                className="d-item"
                                key={key}
                                href={`/games/${filteredGame.slug}`}
                              >
                                {filteredGame.name}
                              </Dropdown.Item>
                            );
                          })}
                      </Dropdown.Menu>
                    </Dropdown>
                  );
                })}
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
    const [value] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(() => !value)}
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
          <Dropdown.Item className="operator-menu" key="1" href="/action/3.1">
            My profile
          </Dropdown.Item>
          <Dropdown.Item className="operator-menu" key="2" href="/action/3.2">
            Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item className="operator-menu" key="3" href="/action/3.3">
            Log out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
